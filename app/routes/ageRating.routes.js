const express = require('express');
const ageRatingController = require('../controllers/ageRating.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(ageRatingController.findAll));
router.get('/:id', asyncHandler(ageRatingController.find));
router.post('/', asyncHandler(ageRatingController.create));
router.put('/:id', asyncHandler(ageRatingController.update));
router.delete('/:id', asyncHandler(ageRatingController.delete));

module.exports = router;
