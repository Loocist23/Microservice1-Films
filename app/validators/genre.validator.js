const normalizeLabel = (label) => (typeof label === 'string' ? label.trim() : '');

const validateGenrePayload = (payload = {}, options = {}) => {
    const { partial = false } = options;
    const sanitizedPayload = {};
    const errors = [];

    if (payload.label !== undefined) {
        const label = normalizeLabel(payload.label);

        if (!label) {
            errors.push('Le champ "label" ne peut pas être vide.');
        } else if (label.length > 150) {
            errors.push('Le champ "label" doit contenir moins de 150 caractères.');
        } else {
            sanitizedPayload.label = label;
        }
    } else if (!partial) {
        errors.push('Le champ "label" est obligatoire.');
    }

    return {
        isValid: errors.length === 0,
        payload: sanitizedPayload,
        errors
    };
};

module.exports = {
    validateGenrePayload
};
