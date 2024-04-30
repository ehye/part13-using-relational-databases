const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { SECRET } = require('../utils/config')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    attributes: ['id', 'username', 'name'],
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
