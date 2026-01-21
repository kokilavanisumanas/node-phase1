class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent Error class

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
