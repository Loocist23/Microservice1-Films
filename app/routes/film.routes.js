const express = require('express');
const filmController = require('../controllers/film.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(filmController.findAll));
router.get('/:id', asyncHandler(filmController.find));
router.post('/', asyncHandler(filmController.create));
router.put('/:id', asyncHandler(filmController.update));
router.delete('/:id', asyncHandler(filmController.delete));

module.exports = router;
