const Genre = require('../models/Genre');
const { BadRequestError, NotFoundError } = require('../errors/HttpError');
const { validateGenrePayload } = require('../validators/genre.validator');

const parseIdParam = (rawId) => {
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('Identifiant invalide fourni.');
    }

    return id;
};

const findGenreOrThrow = async (id) => {
    const genre = await Genre.findByPk(id);

    if (!genre) {
        throw new NotFoundError(`Genre ${id} introuvable.`);
    }

    return genre;
};

module.exports = {
    findAll: async (req, res) => {
        const genres = await Genre.findAll({
            order: [['label', 'ASC']]
        });

        res.json({
            success: true,
            data: genres
        });
    },

    find: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const genre = await findGenreOrThrow(id);

        res.json({
            success: true,
            data: genre
        });
    },

    create: async (req, res) => {
        const { isValid, payload, errors } = validateGenrePayload(req.body);

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        const genre = await Genre.create(payload);

        res.status(201).json({
            success: true,
            data: genre
        });
    },

    update: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const { isValid, payload, errors } = validateGenrePayload(req.body, { partial: true });

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        if (Object.keys(payload).length === 0) {
            throw new BadRequestError('Aucune donnée valide à mettre à jour.');
        }

        const genre = await findGenreOrThrow(id);
        await genre.update(payload);

        res.json({
            success: true,
            data: genre
        });
    },

    delete: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const genre = await findGenreOrThrow(id);

        await genre.destroy();
        res.status(204).send();
    }
};
