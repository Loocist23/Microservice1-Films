const AgeRating = require('../models/AgeRating');
const { BadRequestError, NotFoundError } = require('../errors/HttpError');
const { validateAgeRatingPayload } = require('../validators/ageRating.validator');

const parseIdParam = (rawId) => {
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError('Identifiant invalide fourni.');
    }

    return id;
};

const findAgeRatingOrThrow = async (id) => {
    const ageRating = await AgeRating.findByPk(id);

    if (!ageRating) {
        throw new NotFoundError(`Classification ${id} introuvable.`);
    }

    return ageRating;
};

module.exports = {
    findAll: async (req, res) => {
        const ageRatings = await AgeRating.findAll({
            order: [['value', 'ASC']]
        });

        res.json({
            success: true,
            data: ageRatings
        });
    },

    find: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const ageRating = await findAgeRatingOrThrow(id);

        res.json({
            success: true,
            data: ageRating
        });
    },

    create: async (req, res) => {
        const { isValid, payload, errors } = validateAgeRatingPayload(req.body);

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        const ageRating = await AgeRating.create(payload);

        res.status(201).json({
            success: true,
            data: ageRating
        });
    },

    update: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const { isValid, payload, errors } = validateAgeRatingPayload(req.body, { partial: true });

        if (!isValid) {
            throw new BadRequestError('La validation des données a échoué.', errors);
        }

        if (Object.keys(payload).length === 0) {
            throw new BadRequestError('Aucune donnée valide à mettre à jour.');
        }

        const ageRating = await findAgeRatingOrThrow(id);
        await ageRating.update(payload);

        res.json({
            success: true,
            data: ageRating
        });
    },

    delete: async (req, res) => {
        const id = parseIdParam(req.params.id);
        const ageRating = await findAgeRatingOrThrow(id);

        await ageRating.destroy();
        res.status(204).send();
    }
};
