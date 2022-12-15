const SpotList = require('../models/Spots')

module.exports = {
    getIndex: async (req,res) => {
        try {
            const spots = await SpotList.find()
            res.render('spotList.ejs', {spots: spots})
        } catch(err) {
        console.log(err)
        }
    },
    addSpot: async (req,res) => {
        try {
            await SpotList.create({spot: req.body.spotToAdd})
            console.log('Spot added')
            res.redirect('/spotList')
            return
        } catch(err) {
            console.log(err)
        }
    },
    deleteSpot: async (req,res) => {
        try {
            await SpotList.findOneAndDelete({_id:req.body.spotIdFromJSFile})
            res.json('deleted it')
            res.redirect('/spotList')
            return
        } catch(err) {
            console.log(err)
        }
    }
}