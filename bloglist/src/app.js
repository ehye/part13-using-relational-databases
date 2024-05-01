const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const config = require('./utils/config')
// const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')
const readingListsRouter = require('./controllers/readinglists')

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

app.use(middleware.tokenExtractor)
if (config.NODE_ENV === 'development') {
  app.use(middleware.requestLogger)
}

if (config.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
