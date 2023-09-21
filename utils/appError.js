class AppError extends Error {
  constructor(message, statusCode){
    super(message); //super()はErrorクラスのコンストラクターを呼び出す

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //statusCodeが400番台の場合、statusはfail,それ以外の場合はerror
    this.isOperational = true; //エラーが予期されるものかどうかを判断するプロパティー

    Error.captureStackTrace(this, this.constructor); //エラーのスタックトレースを作成する
  }
}

module.exports = AppError;