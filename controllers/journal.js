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
            return
        } catch(err) {
        console.log(err)
        }
    },
    addSession: async (req,res) => {
        try {
            await Journal.create({date: req.body.sessionDate, spot: req.body.sessionSpot, rating: req.body.sessionRating})
            console.log('session added')
            res.redirect('/journal')
            return
        } catch(err) {
            console.log(err)
        }
    },
    deleteSession: async (req,res) => {
        try {
            await Journal.findOneAndDelete({_id:req.body.journalIdFromJSFile})
            console.log('deleted todo')
            res.json('deleted it')
        } catch(err) {
            console.log(err)
        }
    },
    editSession: async (req, res) => {
        const session = await Journal.findOne({
            _id: req.params.id
        })
        const spots = await SpotList.find()
        res.render('editJournal.ejs', {session: session, spots: spots})
    },
    saveSession: async (req,res) => {
        const session = await Journal.findOneAndUpdate({_id:req.body.journalIdFromJSFile},{date: req.body.sessionDate, spot: req.body.sessionSpot, rating: req.body.sessionRating})
        console.log('session updated')
        res.redirect('/journal')
    }
}