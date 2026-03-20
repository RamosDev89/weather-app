const express = require('express')
const router = express.Router()
const { getYoutubeVideos, getGoogleMap } = require('../controllers/integrationController')

router.get('/youtube/:location', getYoutubeVideos)
router.get('/maps/:location', getGoogleMap)

module.exports = router