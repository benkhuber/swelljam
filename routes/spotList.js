const express = require('express')
const router = express.Router()
const spotListController = require('../controllers/spotList')

router.get('/', spotListController.getIndex)

router.post('/addSpot', spotListController.addSpot)

router.delete('/deleteSpot', spotListController.deleteSpot)

module.exports = router