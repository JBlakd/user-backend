# user-backend
 Ryde Back-end Developer Test

## Usage
1. Install [Node.js](https://nodejs.org/en/download/) if not already installed
2. Clone this repository: `git clone https://github.com/JBlakd/user-backend/`
3. Change directory to the newly cloned project root directory and install Node package dependencies: `npm install`
4. Copy the `.env` file into the project root directory (not committed to GitHub, provided separately)
5. Start the server: `npm run start`
6. The server is up and running! Sample api endpoint: `http://localhost:3003/api/users`

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

The subdirectory `/controllers` contains the various MongoDB Schemas that the server will use. 

TODO: documentation, get production database to a demonstrable state, don't forget the .env file!!
