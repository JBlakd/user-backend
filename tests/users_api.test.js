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

  test('adding valid user successful', async () => {
    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
      .expect(201)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb).toHaveLength(1);
  })

  test('adding noPasswordUser unsuccessful', async () => {
    await api
      .post('/api/users')
      .send(helper.invalidUsers.noPasswordUser)
      .expect(400)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb).toHaveLength(0);
  })

  test('adding nameTooShortUser unsuccessful', async () => {
    await api
      .post('/api/users')
      .send(helper.invalidUsers.nameTooShortUser)
      .expect(400)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb).toHaveLength(0);
  })

  test('adding invalidLatUser unsuccessful', async () => {
    await api
      .post('/api/users')
      .send(helper.invalidUsers.invalidLatUser)
      .expect(400)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb).toHaveLength(0);
  })
})

describe('database with users', () => {
  beforeEach(async () => {
    // restore database to empty state
    await User.deleteMany({})

    // Add all initialUsers
    const promiseArray = helper.initialUsers.map(u => api.post('/api/users').send(u))
    await Promise.all(promiseArray)
  })

  test('getting all users properly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialUsers.length)
    // logger.info(response.body)
  })

  test('getting specific user', async () => {
    // getting the ID of a specific user
    const users = await helper.usersInDb()
    const specificId = users[2].id

    const response = await api
      .get(`/api/users/${specificId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toEqual(users[2].name)
  })

  test('getting specific nonexistent user unsuccessful', async () => {
    const response = await api
      .get(`/api/users/ffffffffffffffffffffffff`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })

  test('successful user deletion with valid password', async () => {
    const users = await helper.usersInDb()
    expect(users).toHaveLength(4)
    const specificUser = users.find(u => u.name === 'RydeEngineer')
    logger.info(`specificUser.id ${specificUser.id}`)

    await api
      .delete(`/api/users/${specificUser.id}`)
      .send({ password: "RydeEngineerPassword" })
      .expect(204)

    const afterDeletionUsers = await helper.usersInDb()
    expect(afterDeletionUsers).toHaveLength(users.length - 1)
    // Check that none of the users in afterDeletionUsers contain the deleted user's name
    expect(!afterDeletionUsers.some(u => u.name === specificUser.name))
  })

  test('unsuccessful user deletion with invalid password', async () => {
    const users = await helper.usersInDb()
    expect(users).toHaveLength(4)
    const specificUser = users.find(u => u.name === 'RydeEngineer')
    logger.info(`specificUser.id ${specificUser.id}`)

    await api
      .delete(`/api/users/${specificUser.id}`)
      .send({ password: "DefinitelyWrongPassword" })
      .expect(401)

    const afterDeletionUsers = await helper.usersInDb()
    expect(afterDeletionUsers).toHaveLength(users.length)
    // Check that the user is not deleted
    expect(!afterDeletionUsers.some(u => u.name == specificUser.name))
  })

  test('no effect on invalid id delete attempt', async () => {
    const users = await helper.usersInDb()
    expect(users).toHaveLength(4)

    await api
      .delete(`/api/users/ffffffffffffffffffffffff`)
      .send({ password: "DefinitelyWrongPassword" })
      .expect(204)

    const afterDeletionUsers = await helper.usersInDb()
    expect(afterDeletionUsers).toHaveLength(users.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})