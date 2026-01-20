const Film = require('../models/Film');
const Genre = require('../models/Genre');
const AgeRating = require('../models/AgeRating');
const { BadRequestError, NotFoundError } = require('../errors/HttpError');
const { validateFilmPayload } = require('../validators/film.validator');

const parseIdParam = (rawId) => {
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('Identifiant invalide fourni.');
    }

    return id;
};

const findFilmOrThrow = async (id, options = {}) => {
    const film = await Film.findByPk(id, options);

    if (!film) {
        throw new NotFoundError(`Film ${id} introuvable.`);
    }

    return film;
};

const ensureGenresExist = async (genreIds) => {
    if (!Array.isArray(genreIds) || genreIds.length === 0) {
        return [];
    }

    const uniqueIds = [...new Set(genreIds)];
    const count = await Genre.count({
        where: {
            id: uniqueIds
        }
    });

    if (count !== uniqueIds.length) {
        throw new BadRequestError('Un ou plusieurs genres fournis sont introuvables.');
    }

    return uniqueIds;
};

const ensureAgeRatingExists = async (ageRatingId) => {
    if (ageRatingId === undefined || ageRatingId === null) {
        return;
    }

    const ageRating = await AgeRating.findByPk(ageRatingId);

    if (!ageRating) {
        throw new BadRequestError(`La classification ${ageRatingId} n'existe pas.`);
    }
};

const filmIncludes = [
    {
        model: Genre,
        as: 'genres',
        through: {
            attributes: []
        }
    },
    {
        model: AgeRating,
        as: 'ageRating'
    }
];

module.exports = {
    findAll: async (req, res) => {
        const films = await Film.findAll({
            order: [['name', 'ASC']],
            include: filmIncludes
        });

        res.json({
            success: true,
            data: films
        });
    },

    find: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const film = await findFilmOrThrow(id, {
            include: filmIncludes
        });

        res.json({
            success: true,
            data: film
        });
    },

    create: async (req, res) => {
        const { isValid, payload, errors } = validateFilmPayload(req.body);

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        const { genreIds: rawGenreIds, ...filmPayload } = payload;

        await ensureAgeRatingExists(filmPayload.ageRatingId);
        const genreIds = await ensureGenresExist(rawGenreIds);

        const film = await Film.create(filmPayload);

        if (genreIds.length > 0) {
            await film.setGenres(genreIds);
        }

        await film.reload({ include: filmIncludes });

        res.status(201).json({
            success: true,
            data: film
        });
    },

    update: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const { isValid, payload, errors } = validateFilmPayload(req.body, { partial: true });

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        const { genreIds: rawGenreIds, ...filmPayload } = payload;
        const hasGenreUpdates = Array.isArray(rawGenreIds);

        if (Object.keys(filmPayload).length === 0 && !hasGenreUpdates) {
            throw new BadRequestError('Aucune donnée valide à mettre à jour.');
        }

        await ensureAgeRatingExists(filmPayload.ageRatingId);
        const genreIds = hasGenreUpdates ? await ensureGenresExist(rawGenreIds) : undefined;

        const film = await findFilmOrThrow(id);
        if (Object.keys(filmPayload).length > 0) {
            await film.update(filmPayload);
        }

        if (hasGenreUpdates) {
            await film.setGenres(genreIds);
        }

        await film.reload({ include: filmIncludes });

        res.json({
            success: true,
            data: film
        });
    },

    delete: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const film = await findFilmOrThrow(id);

        await film.destroy();
        res.status(204).send();
    }
};
