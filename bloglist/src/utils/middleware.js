const jwt = require('jsonwebtoken')
const logger = require('./logger')
const config = require('./config')
const User = require('../models/user')
const { Session } = require('../models')

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

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'mal-formatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'UserDisableError') {
    return response.status(401).json({ error: 'user disabled' })
  }

  next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  const token = getTokenFrom(request)
  if (token) {
    const decodedToken = jwt.verify(token, config.SECRET)
    if (decodedToken.id) {
      const user = await User.findByPk(decodedToken.id)
      if (user) {
        if (user.disabled) {
          return response.status(401).json({ error: 'user disabled' })
        }
        const session = await Session.findOne({ where: { user_id: user.id } })
        if (session) {
          request.user = user
        } else {
          return response.status(401).json({ error: 'require login' })
        }
      } else {
        return response.status(401).json({ error: 'user not exist' })
      }
    } else {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
