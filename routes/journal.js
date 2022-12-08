const express = require('express')
const router = express.Router()
const journalController = require('../controllers/journal')

router.get('/', journalController.getIndex)

router.post('/addSession', journalController.addSession)

module.exports = router