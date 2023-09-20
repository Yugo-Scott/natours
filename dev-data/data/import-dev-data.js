const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModels');
dotenv.config({ path: './config.env' });

// console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//  Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

// read json file. need to JSON.parse to convert json file to js object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')); //utf-8を指定しないと、バイナリデータとして読み込まれる

// import data into database
const importData = async () => {
  try {
    await Tour.create(tours); //createは配列を引数に取ることができる
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //終了
};

// delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany(); //deleteManyは引数を取らない
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //終了
};

if(process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv); // if node dev-data/data/import-dev-data.js --import, then [ '/usr/local/bin/node', '/Users/ryotanomura/Desktop/complete-node-bootcamp/4-natours/starter/dev-data/data/import-dev-data.js', '--import' ] so we can use process.argv[2] to check if the command is --import or --delete
