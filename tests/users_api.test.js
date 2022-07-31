const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/User')
const logger = require('../utils/logger')

describe('initial empty database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('empty database returns empty JSON array', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(0)
  })
})

describe('database with users', () => {
  beforeEach(async () => {
    // restore database to empty state
    await User.deleteMany({})

    // Add all initialUsers
    const userObjects = helper.initialUsers.map(u => new User(u))
    const promiseArray = userObjects.map(uObj => uObj.save())
    await Promise.all(promiseArray)
  })

  test('all users successfully added', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialUsers.length)
    logger.info(response.body)
  })
})

afterAll(() => {
  mongoose.connection.close()
})