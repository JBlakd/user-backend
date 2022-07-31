const bcrypt = require('bcrypt')
const config = require('../utils/config')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

const mandatoryFields = ["name", "password", "dob", "address", "latStr", "longStr", "description"]

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const missingFields = mandatoryFields.filter(field => !Object.keys(req.body).includes(field))
  if (missingFields.length > 0) {
    res.status(400).json({ error: `the following params are missing: ${missingFields.toString()}` })
  }

  const { name, password, dob, address, latStr, longStr, description } = req.body
  const invalidParams = Object.values(req.body).filter(p => p.length < 3);
  if (invalidParams.length > 0) {
    res.status(400).json({ error: `the following params are not at least 3 characters long: ${invalidParams.toString()}` })
    return
  }

  const lat = parseFloat(latStr)
  if (lat < -90 || lat > 90) {
    res.status(400).json({ error: 'lat must be between -90 and 90' }).end()
    return
  }
  const long = parseFloat(longStr)
  if (long < -180 || long > 180) {
    res.status(400).json({ error: 'long must be between -180 and 180' }).end()
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const createdAt = new Date()

  const user = new User({
    name,
    passwordHash,
    dob,
    address,
    lat,
    long,
    description,
    createdAt
  })

  logger.info('user POST dob: ', dob)
  logger.info('user POST userBeforeSave: ', user)

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

const mongoUrl = config.MONGODB_URI
logger.info("connecting to mongoDB")
mongoose.connect(mongoUrl)

module.exports = usersRouter