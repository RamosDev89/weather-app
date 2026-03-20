const express = require('express')
const router = express.Router()
const { exportJSON, exportCSV, exportPDF } = require('../controllers/exportController')

router.get('/json', exportJSON)
router.get('/csv', exportCSV)
router.get('/pdf', exportPDF)

module.exports = router