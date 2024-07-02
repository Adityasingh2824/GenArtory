// backend/src/utils/errorHandler.js

const handleError = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    // Define common error types and responses
    const errors = {
      '400': { message: 'Bad Request', status: 400 },
      '401': { message: 'Unauthorized', status: 401 },
      '403': { message: 'Forbidden', status: 403 },
      '404': { message: 'Not Found', status: 404 },
      '429': { message: 'Too Many Requests', status: 429 },
    };

    const errorStatus = err.status || err.statusCode || 500; // Get status code from error or default to 500
    const errorData = errors[errorStatus.toString()] || { message: 'Internal Server Error', status: 500 };
    let errorMessage = errorData.message;

    // Check for specific error types
    if (err.name === 'ValidationError') {
      // Mongoose validation errors
      errorMessage = Object.values(err.errors).map(val => val.message);
      errorStatus = 400; // Set status to 400 for validation errors
    } else if (err.name === 'CastError') {
      // Mongoose cast error (e.g., invalid ObjectId)
      errorMessage = `Invalid ${err.path}: ${err.value}`;
      errorStatus = 400;
    } else if (err instanceof Error && err.message.includes('Move abort')) {
      // Aptos transaction error
      errorMessage = err.message;
    }

    res.status(errorStatus).json({ 
        success: false,
        statusCode: errorStatus,
        message: errorMessage 
    });
};

module.exports = handleError;

