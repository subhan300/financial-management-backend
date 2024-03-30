class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }

  toJson() {
    return {
      success: false,
      error: {
        message: this.message,
        status: this.statusCode,
        errors: this.errors
      }
    };
  }
}

module.exports = { ApiError };
