const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const config  = require('./config/database')
const session = require("express-session")

mongoose.connect(config.database)

mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database)
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

const users = require('./routes/users')

const app = express()
app.use(cors())

//app set static folder
app.use(express.static(path.join(__dirname, 'public')))

// body-parser middleware
app.use(bodyParser.json())

//passport middleware
app.use(session({
    secret: "ahihi"
}))
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use('/users', users)
app.get('/', (req, res) => {
    res.send('Home page')
})

const port = 5000

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})