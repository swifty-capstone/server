import HttpException from './HttpException.js';

export default class ValidationException extends HttpException {
  constructor(message, field = null) {
    super(400, message);
    this.field = field;
    this.name = 'ValidationException';
  }
}