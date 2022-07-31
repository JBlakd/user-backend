const express = require('express')
require('express-async-errors')
const app = express()
const usersRouter = require('./controllers/users')
const cors = require('cors')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app