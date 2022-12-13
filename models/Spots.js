const mongoose = require('mongoose')

const SpotSchema = new mongoose.Schema({
    spot: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Spot', SpotSchema)