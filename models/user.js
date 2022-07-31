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
  createdAt: Date,
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // logger.info('toJSON returnedObject', returnedObject)
    // convert MongoDB date format to date-only String
    // logger.info('dob: ', returnedObject.dob.toISOString().substring(0, 10))
    if (returnedObject.hasOwnProperty("dob")) {
      returnedObject.dob = returnedObject.dob.toISOString().substring(0, 10)
    }

    // convert MongoDB id to String
    returnedObject.id = returnedObject._id.toString()

    // delete sensitive fields
    delete returnedObject._id
    if (returnedObject.hasOwnProperty("__v")) {
      delete returnedObject.__v
    }
    if (returnedObject.hasOwnProperty("passwordHash")) {
      delete returnedObject.passwordHash
    }
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User