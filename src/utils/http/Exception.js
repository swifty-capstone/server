export default class HttpException extends Error {
  constructor(errorCode, message) {
    super(message);
    this.errorCode = errorCode;
    this.message = message;
  }
}

