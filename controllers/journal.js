const Journal = require('../models/Journal')

module.exports = {
    getIndex: (req,res) => {
        try {
            date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (day < 10) {
                day = `0${day}`
            }
            let currentDate = `${year}-${month}-${day}`
            res.render('journal.ejs', {currentDate : currentDate})
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
    }
}