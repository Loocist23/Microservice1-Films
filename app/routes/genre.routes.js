const express = require('express');
const genreController = require('../controllers/genre.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(genreController.findAll));
router.get('/:id', asyncHandler(genreController.find));
router.post('/', asyncHandler(genreController.create));
router.put('/:id', asyncHandler(genreController.update));
router.delete('/:id', asyncHandler(genreController.delete));

module.exports = router;
