export function createResponse(success, data = null, message = null) {
  return {
    success,
    data,
    message
  };
}

export function successResponse(res, statusCode, data, message = null) {
  return res.status(statusCode).json(createResponse(true, data, message));
}

export function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json(createResponse(false, null, message));
}