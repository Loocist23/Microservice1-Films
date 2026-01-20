const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const validateFilmPayload = (payload = {}, options = {}) => {
    const { partial = false } = options;
    const sanitizedPayload = {};
    const errors = [];

    if (payload.name !== undefined) {
        const name = normalizeString(payload.name);

        if (!name) {
            errors.push('Le champ "name" ne peut pas être vide.');
        } else if (name.length > 255) {
            errors.push('Le champ "name" doit contenir moins de 255 caractères.');
        } else {
            sanitizedPayload.name = name;
        }
    } else if (!partial) {
        errors.push('Le champ "name" est obligatoire.');
    }

    if (payload.synopsis !== undefined) {
        const synopsis = normalizeString(payload.synopsis);

        if (synopsis.length > 2000) {
            errors.push('Le champ "synopsis" doit contenir moins de 2000 caractères.');
        } else {
            sanitizedPayload.synopsis = synopsis;
        }
    }

    if (payload.author !== undefined) {
        const author = normalizeString(payload.author);

        if (!author) {
            errors.push('Le champ "author" ne peut pas être vide.');
        } else if (author.length > 255) {
            errors.push('Le champ "author" doit contenir moins de 255 caractères.');
        } else {
            sanitizedPayload.author = author;
        }
    } else if (!partial) {
        errors.push('Le champ "author" est obligatoire.');
    }

    if (payload.ageRatingId !== undefined) {
        const ageRatingId = Number(payload.ageRatingId);

        if (!Number.isInteger(ageRatingId) || ageRatingId <= 0) {
            errors.push('Le champ "ageRatingId" doit être un identifiant valide.');
        } else {
            sanitizedPayload.ageRatingId = ageRatingId;
        }
    } else if (!partial) {
        errors.push('Le champ "ageRatingId" est obligatoire.');
    }

    if (payload.genreIds !== undefined) {
        if (!Array.isArray(payload.genreIds)) {
            errors.push('Le champ "genreIds" doit être un tableau d\'identifiants.');
        } else {
            const sanitizedGenreIds = [];
            let hasInvalidId = false;

            payload.genreIds.forEach((rawId) => {
                const genreId = Number(rawId);

                if (!Number.isInteger(genreId) || genreId <= 0) {
                    hasInvalidId = true;
                } else {
                    sanitizedGenreIds.push(genreId);
                }
            });

            if (hasInvalidId) {
                errors.push('Chaque valeur de "genreIds" doit être un identifiant valide.');
            } else {
                sanitizedPayload.genreIds = [...new Set(sanitizedGenreIds)];
            }
        }
    } else if (!partial) {
        sanitizedPayload.genreIds = [];
    }

    return {
        isValid: errors.length === 0,
        payload: sanitizedPayload,
        errors
    };
};

module.exports = {
    validateFilmPayload
};
