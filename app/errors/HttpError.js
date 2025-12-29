class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

class BadRequestError extends HttpError {
    constructor(message, details) {
        super(400, message || 'Bad Request', details);
    }
}

class NotFoundError extends HttpError {
    constructor(message, details) {
        super(404, message || 'Resource not found', details);
    }
}

module.exports = {
    BadRequestError,
    HttpError,
    NotFoundError
};
