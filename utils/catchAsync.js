module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //next関数に引数を渡すと、エラーハンドリングミドルウェアに処理が移る
  };
};
