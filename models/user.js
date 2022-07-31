const mongoose = require('mongoose')
const logger = require('../utils/logger')

const userSchema = new mongoose.Schema({
  name: String,
  passwordHash: String,
  dob: Date,
  address: String,
  lat: Number,
  long: Number,
  description: String,
  createdAt: Date
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // convert MongoDB date format to date-only String
    // logger.info('dob: ', returnedObject.dob.toISOString().substring(0, 10))
    returnedObject.dob = returnedObject.dob.toISOString().substring(0, 10)

    // convert MongoDB id to String
    returnedObject.id = returnedObject._id.toString()

    // delete sensitive fields
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User