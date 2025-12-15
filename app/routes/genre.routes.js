const express = require('express')
const router = express.Router()
const genreController = require('../controllers/genre.controller');

router.get('/', genreController.findAll)
router.get('/:id', genreController.find)
router.post('/', genreController.create)
router.put('/:id', genreController.update)
router.delete('/:id', genreController.delete)

module.exports = router