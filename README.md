# user-backend
 Ryde Back-end Developer Test

## Usage
1. Install [Node.js](https://nodejs.org/en/download/) if not already installed
2. Clone this repository: `git clone https://github.com/JBlakd/user-backend/`
3. Change directory to the newly cloned project root directory and install Node package dependencies: `npm install`
4. Copy the `.env` file into the project root directory (not committed to GitHub, provided separately)
5. Start the server: `npm run start`
6. The server is up and running! Sample API endpoint: `http://localhost:3003/api/users`

As an alternative to starting the server at step 5, use `npm run test` to execute testcases.

## Tech Stack
* NoSQL database
  * MongoDB, hosted on MongoDB Atlas, interfaced in code with the Mongoose library.
* Backend
  * Express.js
* Runtime environment
  * Node.js
* Unit testing library
  * Jest.js

## High-Level Design
`.env` is a file that is **not committed** to this repository and is to be provided to the user separately. It contains sensitive credential information pertaining to the MongoDB Atlas database connection from the backend.

The entry point of the program is `/index.js`. The sole responsibility of the entry point is to start an instance of the server `app.js` that can start listening to incoming requests.

The next program-wide layer is `/app.js`. This layer is responsible for importing various middleware that are required for the functionality of the program, as well as the programmer-designed Routers.

The subdirectory `/controllers` contains the various Routers that the server is required to service. In the case of this project, only `/controllers/users.js` is needed. This Router is responsible for getting, creating, deleting and modifying the users in the database.

The subdirectory `/models` contains the various MongoDB Schemas that the server will use. 

The subdirectory `/tests` contains the files pertaining to unit testing. `test_helper.js` contains some reusable definitions and functions that are used across all testcases, and `users_api.test.js` contains the testcases. 

## API documentation

### GET all users
* URL
  * `http://localhost:3003/api/users`
* URL Params
  * `None`
* Request Body
  * `None`
* Success Response
  * Code: `200`
  * Sample Body (JSON format):
```
[
  {
    "friends": [
      {
        "name": "IvanHu",
        "id": "62e69c6b1dfa255574c898dd"
      }
    ],
    "name": "RydeEngineer",
    "dob": "1992-01-24",
    "address": "Singapore Anson Road",
    "lat": 1.275926,
    "long": 103.846099,
    "description": "Located in Singapore User 2",
    "createdAt": "2022-07-31T16:11:05.193Z",
    "id": "62e6a9995f0ca66fe466a2df"
  },
  ...
]
```
* Error Response
  * `None`

### GET specific user
* URL
  * `http://localhost:3003/api/users/:id`
* URL Params
  * `:id` ID of a user in the string representation of a MongoDB ObjectID
* Request Body
  * `None`
* Success Response
  * Code: `200`
  * Sample Body (JSON format):
```
{
  "friends": [
    {
      "name": "IvanHu",
      "id": "62e69c6b1dfa255574c898dd"
    }
  ],
  "name": "RydeEngineer",
  "dob": "1992-01-24",
  "address": "Singapore Anson Road",
  "lat": 1.275926,
  "long": 103.846099,
  "description": "Located in Singapore User 2",
  "createdAt": "2022-07-31T16:11:05.193Z",
  "id": "62e6a9995f0ca66fe466a2df"
}
```
* Error Response
  * Code `404` JSON body `{ "error": "user not found" } `

### GET nearby friends
* URL
  * `http://localhost:3003/api/users/nearbyfriends/:name`
* URL Params
  * `:id` Name of the user of whom you want to find the nearby friends of, within a 50km Earth surface radius
* Request Body
  * `None`
* Success Response
  * Code: `200`
  * Sample Body (JSON format):
```
[
    {
        "name": "RydeEngineer",
        "address": "Singapore Anson Road",
        "lat": 1.275926,
        "long": 103.846099,
        "id": "62e6a9995f0ca66fe466a2df"
    },
    ...
]
```
* Error Response
  * Code `404` JSON body `{ "error": "user not found" } `
