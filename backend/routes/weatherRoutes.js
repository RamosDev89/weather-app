const express = require('express')
const router = express.Router()
const {
  createSearch,
  getSearches,
  getSearchById,
  updateSearch,
  deleteSearch
} = require('../controllers/weatherController')

// CREATE
router.post('/', createSearch)

// READ — listar todas
router.get('/', getSearches)

// READ — buscar por ID
router.get('/:id', getSearchById)

// UPDATE
router.put('/:id', updateSearch)

// DELETE
router.delete('/:id', deleteSearch)

module.exports = router