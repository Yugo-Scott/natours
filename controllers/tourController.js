// const fs = require('fs');
const { tr } = require('date-fns/locale');
const Tour = require('./../models/tourModels');
const { query } = require('express');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getAllTours = catchAsync(async (req, res,next) => {
  // console.log(req.requestTime);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); //Tour.find()はqueryを返す
    const tours = await features.query;  //queryはawaitを使って、実行する必要がある

    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour = catchAsync(async (req, res,next) => {
  // console.log(req.params);
  // const id = req.params.id * 1; //文字列を数値に変換する
    const tour = await Tour.findById(req.params.id); // Tour.findOne({ _id: req.params.id }) と同じ
    if(!tour){
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    });
});

  exports.createTour = catchAsync(async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });

exports.updateTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, //return the new updated document
        runValidators: true, //run the validators again
      }
    )

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

});

exports.deleteTour = catchAsync(async (req, res,next) => {
  tour = await Tour.findByIdAndDelete(req.params.id);
  // 204 means no content
  if(!tour){
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res,next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, //matchはfilterの役割
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, //difficultyごとにグループ化する
        numTours: { $sum: 1 }, //difficultyごとにグループ化したtourの数を数える
        numRatings: { $sum: '$ratingsQuantity' }, //difficultyごとにグループ化したratingsQuantityの合計を求める
        avgRating: { $avg: '$ratingsAverage' }, //difficultyごとにグループ化したratingsAverageの平均を求める
        avgPrice: { $avg: '$price' }, //difficultyごとにグループ化したpriceの平均を求める
        minPrice: { $min: '$price' }, //difficultyごとにグループ化したpriceの最小値を求める
        maxPrice: { $max: '$price' }, //difficultyごとにグループ化したpriceの最大値を求める
      },
    },
    {
      $sort: { avgPrice: 1 }, //avgPriceの昇順にソートする
    },
    {
      $match: { _id: { $ne: 'EASY' } }, //difficultyがEASYではないものを取得する
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1; //文字列を数値に変換する
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //startDatesを展開する 1つのドキュメントに複数のstartDatesがある場合、それぞれのstartDatesを別のドキュメントとして扱う
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), //year-01-01より後の日付を取得する
          $lte: new Date(`${year}-12-31`), //year-12-31より前の日付を取得する
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //startDatesの月ごとにグループ化する_id はグループ化のキーとして使用されるフィールドを指定する
        numTourStarts: { $sum: 1 }, //月ごとにグループ化したtourの数を数えるnumTourStartsは$group stageで作成したフィールド
        tours: { $push: '$name' }, //月ごとにグループ化したnameを配列に格納する
      },
    },
    {
      $addFields: { month: '$_id' }, //_idをmonthに変更する
    },
    {
      $project: { _id: 0 }, //_idを非表示にする
    },
    {
      $sort: { numTourStarts: -1 }, //numTourStartsの降順にソートする
    },
    {
      $limit: 12, //12件のみ取得する
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});