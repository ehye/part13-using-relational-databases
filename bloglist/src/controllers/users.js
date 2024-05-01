const usersRouter = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog } = require('../models/')
const { userExtractor } = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll()
  response.json(users)
})

usersRouter.get('/:id', userExtractor, async (request, response) => {
  const options = {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        include: ['id', 'url', 'title', 'author', 'likes', 'year'],
        exclude: ['user_id', 'created_at', 'updated_at'],
      },
      through: {
        as: 'readinglists',
        attributes: ['is_read', 'id'],
      },
    },
  }
  if (request.query.read !== undefined) {
    options.include.through.where = { is_read: { [Op.eq]: request.query.read } }
  }

  const user = await User.findByPk(request.params.id, options)

  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

usersRouter.put('/:username', userExtractor, async (request, response) => {
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
