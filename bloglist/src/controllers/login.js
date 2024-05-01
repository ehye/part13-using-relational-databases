const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { SECRET } = require('../utils/config')
const { User, Session } = require('../models/')
const { info } = require('../utils/logger')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({
    attributes: ['id', 'username', 'name', 'disabled'],
    where: {
      username: request.body.username,
    },
  })

  if (user.disabled) {
    return response.status(401).send({ error: 'user disabled' })
  }

  const passwordCorrect = request.body.password === 'secret'
  if (!(user && passwordCorrect)) {
    return response.status(401).send({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  const [session, created] = await Session.findOrCreate({
    where: { user_id: user.id },
    defaults: {
      user_id: user.id,
      token: token,
    },
  })
  if (!created) {
    session.token = token
    await session.save()
    info('replenish token by user ', user.id)
  }

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
