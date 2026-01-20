const validateAgeRatingPayload = (payload = {}, options = {}) => {
    const { partial = false } = options;
    const sanitizedPayload = {};
    const errors = [];

    if (payload.value !== undefined) {
        const value = Number(payload.value);

        if (!Number.isInteger(value) || value < 0) {
            errors.push('Le champ "value" doit être un entier positif.');
        } else {
            sanitizedPayload.value = value;
        }
    } else if (!partial) {
        errors.push('Le champ "value" est obligatoire.');
    }

    return {
        isValid: errors.length === 0,
        payload: sanitizedPayload,
        errors
    };
};

module.exports = {
    validateAgeRatingPayload
};
