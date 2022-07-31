const bcrypt = require('bcrypt')
const config = require('../utils/config')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const mongoose = require('mongoose')
const { response } = require('../app')

const mandatoryFields = ["name", "password", "dob", "address", "latStr", "longStr", "description"]
// Password hashing number of rounds
const saltRounds = 10

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

// GET

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  // logger.info('GET id: ', req.params.id)
  const user = await User.findById(req.params.id)
  // logger.info('GET id user: ', user)
  if (user === null) {
    res.status(404).json({ error: "user not found" })
    return
  }

  res.json(user)
})

// POST

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

  // logger.info('user POST dob: ', dob)
  // logger.info('user POST userBeforeSave: ', user)

  const savedUser = await user.save()

  logger.info('savedUser: ', savedUser)

  res.status(201).json(savedUser)
})

// DELETE
usersRouter.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  logger.info('DELETE user: ', user)
  if (user === null) {
    res.status(204).end()
    return
  }

  // logger.info('DELETE user req.body: ', req.body)
  const isPasswordLegit = await bcrypt.compare(req.body.password, user.passwordHash)
  logger.info('isPasswordLegit: ', isPasswordLegit)
  if (!isPasswordLegit) {
    res.status(401).json({ error: "invalid password" })
    return
  }

  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// PUT 
usersRouter.put('/:id', async (req, res) => {
  // check field validity
  const invalidFields = Object.keys(req.body).filter(field =>
    !mandatoryFields.includes(field)
  )
  if (invalidFields.length > 0) {
    res.status(400).json({ error: `the following fields are invalid: ${invalidFields.toString()}` })
    return
  }

  const errorsObj = checkParams(req.body)
  if (errorsObj.errors.length > 0) {
    res.status(400).json(errorsObj)
    return
  }

  const user = await User.findById(req.params.id)
  logger.info('PUT user: ', user)
  if (user === null) {
    res.status(404).end()
    return
  }
  const isPasswordLegit = await bcrypt.compare(req.body.password, user.passwordHash)
  logger.info('isPasswordLegit: ', isPasswordLegit)
  if (!isPasswordLegit) {
    res.status(401).json({ error: "invalid password" })
    return
  }

  // the final parameter ensures the updated object is returned
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(updatedUser)
})

usersRouter.put('/addfriend/:id', async (req, res) => {
  // check field completeness
  if (!req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('friendToAdd')) {
    res.status(400).json({ error: 'must contain fields password and friendToAdd' })
    return
  }

  const user = await User.findById(req.params.id)
  if (user === null) {
    res.status(404).end()
    return
  }

  const isPasswordLegit = await bcrypt.compare(req.body.password, user.passwordHash)
  logger.info('isPasswordLegit: ', isPasswordLegit)
  if (!isPasswordLegit) {
    res.status(401).json({ error: "invalid password" })
    return
  }

  const friendToAdd = await User.findById(req.body.friendToAdd)
  if (friendToAdd === null) {
    res.status(400).json({ error: 'invalid friendToAdd' })
    return
  }

  // The MongoDB _id must be used
  user.friends = user.friends.concat(friendToAdd._id)
  await user.save()

  const updatedUser = await User.findById(req.params.id).populate('user', { id: 1, name: 1 })
  res.status(200).json(updatedUser)
})

const mongoUrl = config.MONGODB_URI
logger.info("connecting to mongoDB")
mongoose.connect(mongoUrl)

module.exports = usersRouter