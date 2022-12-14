const Journal = require('../models/Journal')
const SpotList = require('../models/Spots')

module.exports = {
    getIndex: async (req,res) => {
        try {
            date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (day < 10) {
                day = `0${day}`
            }
            let currentDate = `${year}-${month}-${day}`
            const spots = await SpotList.find()
            const journals = await Journal.find()
            res.render('journal.ejs', {currentDate : currentDate, spots: spots, journals : journals})
            console.log(journals)
        } catch(err) {
        console.log(err)
        }
    },
    addSession: async (req,res) => {
        try {
            await Journal.create({date: req.body.sessionDate, spot: req.body.sessionSpot, rating: req.body.sessionRating})
            console.log('session added')
            res.redirect('/journal')
        } catch(err) {
            console.log(err)
        }
    },
    deleteSession: async (req,res) => {
        try {
            await Journal.findOneAndDelete({_id:req.body.journalIdFromJSFile})
            console.log('deleted todo')
            res.json('deleted it')
            res.redirect('/journal')
        } catch(err) {
            console.log(err)
        }
    }
}