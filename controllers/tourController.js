// const fs = require('fs');
const { tr } = require('date-fns/locale');
const Tour = require('./../models/tourModels');
const { query } = require('express');
const APIFeatures = require('./../utils/apiFeatures');





// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//     if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next(); //next()を呼び出さないと、次のミドルウェアに処理が移らない
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     // returnを書かないと、次のミドルウェアに処理が移ってしまう
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// app.get('/', (req, res) => {
//   // res.status(200).send('Hello World!');
//   res.status(200).json({ message: 'Hello World!' });
// });

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); //Tour.find()はqueryを返す
    const tours = await features.query;  //queryはawaitを使って、実行する必要がある
    // const queryObj = { ...req.query }; //req.queryはオブジェクトなので、スプレッド構文でコピーする。req.queryはオブジェクトの参照なので、直接変更すると、req.queryも変更されてしまう
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // // console.log(req.query, queryObj);
    // console.log(req.query);

    // let queryStr = JSON.stringify(queryObj);
    // // console.log(JSON.parse(queryStr));
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //正規表現を使って、queryStrの中のgte,gt,lte,ltを$gte,$gt,$lte,$ltに置き換える
    // // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr)); //Tour.find()はqueryを返す

    // if(req.query.sort) {
    //   // console.log(req.query.sort);
    //   // console.log(req.query.sort.split(','));
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy); //sort('price ratingsAverage') urlのクエリパラメーターにsort=price,ratingsAverageと入力すると、priceでソートした後に、ratingsAverageでソートする
    // } else {
    //   query = query.sort('-createdAt'); //sort('-price')はpriceを降順にソートする
    // }

    // if(req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select(fields); //select('name duration price') urlのクエリパラメーターにfields=name,duration,priceと入力すると、name,duration,priceのみを取得する
    // } else {
    //   query = query.select('-__v'); //select('-name -duration -price')はname,duration,priceを除外する
    // }

    // if(req.query.page) {
    //   const page = req.query.page * 1 || 1; //文字列を数値に変換するdefaultは1
    //   const limit = req.query.limit * 1 || 100;
    //   const skip = (page - 1) * limit;

    //   // page=2&limit=10, 1-10 page1, 11-20 page2, 21-30 page3
    //   // query = query.skip(2).limit(10);

    //   query = query.skip(skip).limit(limit);
    //   // console.log(page, limit, skip);
    //   if(req.query.page > 1) {
    //     const numTours = await Tour.countDocuments();
    //     if(skip >= numTours) throw new Error('This page does not exist');
    //   }
    // }

    // const tours = await query;

    // const tours = await Tour.find(JSON.parse(queryStr)); //Tour.find()はqueryを返す
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy'); //queryをチェーンすることができる

    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1; //文字列を数値に変換する
  try {
    const tour = await Tour.findById(req.params.id); // Tour.findOne({ _id: req.params.id }) と同じ
    // const tour = tours.find((el) => el.id === id);
    // // if (id > tours.length) {
    // if (!tour) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'Invalid ID',
    //   });
    // }

    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

  exports.createTour = async (req, res) => {
    try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  };

// exports.createTour = (req, res) => {
//   // console.log(req.body); //need to use middleware express.json() to get req.body and it is a middleware that modifies the incoming request data into a format that we want
//   const newId = tours[tours.length - 1].id + 1;
//   // Object.assign()は、すべての列挙可能なプロパティの値を、1つ以上のコピー元オブジェクトからコピー先オブジェクトにコピーするためのメソッドです。
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, //return the new updated document
        runValidators: true, //run the validators again
      }
    )
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
  // 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try { 
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
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

