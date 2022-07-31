const bcrypt = require('bcrypt')
const config = require('../utils/config')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

const mandatoryFields = ["name", "password", "dob", "address", "latStr", "longStr", "description"]

const checkParams = (userObj) => {
  const keys = Object.keys(userObj)
  const vals = Object.values(userObj)

  logger.info('userObj vals: ', vals)

  let errorsObj = { errors: [] }

  const invalidParams = vals.filter(v => v.length < 3);
  if (invalidParams.length > 0) {
    errorsObj.errors.push(`the following params are not at least 3 characters long: ${invalidParams.toString()}`)
  }

  if (keys.find(k => k === 'latStr') !== undefined) {
    const lat = parseFloat(userObj.latStr)
    if (lat < -90 || lat > 90) {
      errorsObj.errors.push('lat must be between -90 and 90')
    }
  }

  if (keys.find(k => k === 'longStr') !== undefined) {
    const long = parseFloat(userObj.longStr)
    if (long < -180 || long > 180) {
      errorsObj.errors.push('long must be between -180 and 180')
    }
  }

  logger.info('errorsObj: ', errorsObj)

  return errorsObj
}

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const missingFields = mandatoryFields.filter(field => !Object.keys(req.body).includes(field))
  if (missingFields.length > 0) {
    res.status(400).json({ error: `the following params are missing: ${missingFields.toString()}` })
  }

  const errorsObj = checkParams(req.body)
  if (errorsObj.errors.length > 0) {
    res.status(400).json(errorsObj)
    return
  }

  const { name, password, dob, address, latStr, longStr, description } = req.body
  const lat = parseFloat(latStr)
  const long = parseFloat(longStr)

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