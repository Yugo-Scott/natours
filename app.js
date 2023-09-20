// app.js is used for middleware decorartion
const { id } = require('date-fns/locale');
const express = require('express');
const morgan = require('morgan');

const { get } = require('http');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); //by default, express set the env to development

app.use(express.json()); //リクエストボディの中身がJSON形式であるとき、このミドルウェアはそのJSONをJavaScriptのオブジェクトに変換しJSONをオブジェクトに変換した後、それはreq.bodyとして利用できる
//process object is a global object that is available everywhere in the application
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') { 
  app.use(morgan('dev')); //ログを出力するミドルウェア
}

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 　Routing middleware that only applies to the tourRouter when the route is /api/v1/tours 
// /api/v1/toursへのリクエストはtourRouterを経由して処理 
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.get('*', (req, res) => { //全てのHTTPメソッドに対応するルートハンドラー
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`, //req.originalUrlはリクエストのURLを返す
  });
});

app.use(express.static(`${__dirname}/public`)); //静的ファイルを提供するミドルウェア

module.exports = app;