const usersRouter = require('express').Router()
const { User, Blog } = require('../models/')
const { userExtractor } = require('../utils/middleware')

usersRouter.get('/', userExtractor, async (request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.put('/:username', async (request, response) => {
  const user = await User.findOne({
    where: {
      username: request.params.username,
    },
  })
  if (user) {
    user.username = request.body.username
    const result = await user.save()
    response.json(result)
  } else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name } = request.body

  const user = await User.create({ username, name })

  response.status(201).json(user)
})

module.exports = usersRouter
