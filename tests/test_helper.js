const User = require('../models/user')

const initialUsers = [
  {
    "name": "IvanHu",
    "password": "IvanHuPassword",
    "dob": "1997-09-17",
    "address": "Singapore Farrer Park",
    "latStr": "1.312908",
    "longStr": "103.856903",
    "description": "Located in Singapore User 1"
  },
  {
    "name": "RydeEngineer",
    "password": "RydeEngineerPassword",
    "dob": "1992-01-24",
    "address": "Singapore Anson Road",
    "latStr": "1.275926",
    "longStr": "103.846099",
    "description": "Located in Singapore User 2"
  },
  {
    "name": "FamilyOfIvan",
    "password": "IvanFamilyPW",
    "dob": "1971-04-21",
    "address": "Sydney, Hornsby",
    "latStr": "-33.699612",
    "longStr": "151.109878",
    "description": "Located in Sydney User 1"
  },
  {
    "name": "FriendOfIvan",
    "password": "IvanFriendPW",
    "dob": "1998-06-23",
    "address": "Sydney, Waterloo",
    "latStr": "-33.899095",
    "longStr": "151.207294",
    "description": "Located in Sydney User 2"
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  usersInDb, initialUsers
}