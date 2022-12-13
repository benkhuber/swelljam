const mongoose = require('mongoose')

const JournalSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    spot: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Journal', JournalSchema)