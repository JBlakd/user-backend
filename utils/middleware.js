const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response) => {
  logger.error(error.message)
  return response.status(400).send({ error: error.message })
}

// const tokenExtractor = (error, request, next) => {
//   // logger.info('tokenExtractor request:', request.req.rawHeaders)
//   const authorization = request.req.get('authorization')
//   logger.info('tokenExtractor authorization: ', authorization)
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     request.req.token = authorization.substring(7)
//   } else {
//     request.req.token = null
//   }
//   next()
// }

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
  // tokenExtractor
}