const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `La ressource ${req.method} ${req.originalUrl} n'existe pas`
    });
};

module.exports = notFound;
