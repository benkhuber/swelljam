const express = require('express')
const journal = require('./controllers/journal')
const connectDB = require('./config/database')
const app = express()
const bodyParser = require("body-parser")

const homeRoutes = require('./routes/home')
const journalRoutes = require('./routes/journal')
const spotListRoutes = require('./routes/spotList')

require('dotenv').config({path: './config/.env'})

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/journal', journalRoutes)
app.use('/spotList', spotListRoutes)

app.listen(process.env.PORT, () => {
    console.log('server running')
})
