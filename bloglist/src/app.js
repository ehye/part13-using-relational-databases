const express = require('express')
const app = express()
const cors = require('cors')
// const mongoose = require('mongoose')
// require('dotenv').config()
const { Sequelize } = require('sequelize')
require('express-async-errors')


const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const sequelize = new Sequelize(config.DATABASE_URI)
const main = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
}

main()

// mongoose
//   .connect(config.MONGODB_URI)
//   .then(() => {
//     logger.info('connected to MongoDB')
//   })
//   .catch((error) => {
//     logger.error('error connecting to MongoDB:', error.message)
//   })

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

app.use(middleware.tokenExtractor)
if (process.env.NODE_ENV === 'development') {
  app.use(middleware.requestLogger)
}

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
