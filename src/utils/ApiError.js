// Standardize the error format that when error comes it is in standard format
// For more info -> Node.js API Error

class ApiError extends Error {
  // If you want to add more fields, you can add them here
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  )
  // Over-riding the Error class
  {
    // Calling parent constructor of base Error class.
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

  }
}

export default ApiError 