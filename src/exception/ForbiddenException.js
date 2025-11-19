import HttpException from './HttpException.js';

export default class ForbiddenException extends HttpException {
  constructor(message = 'Access denied') {
    super(403, message);
    this.name = 'ForbiddenException';
  }
}