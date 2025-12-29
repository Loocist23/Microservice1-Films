const { HttpError } = require('../errors/HttpError');

const errorHandler = (err, req, res, next) => {
    const isKnownError = err instanceof HttpError;
    const statusCode = isKnownError ? err.statusCode : 500;

    if (!isKnownError) {
        console.error(err);
    }

    const payload = {
        success: false,
        message: err.message || 'Une erreur inattendue est survenue'
    };

    if (err.details) {
        payload.details = err.details;
    }

    res.status(statusCode).json(payload);
};

module.exports = errorHandler;
