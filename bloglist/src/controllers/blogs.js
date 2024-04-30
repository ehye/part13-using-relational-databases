const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { userExtractor } = require('../utils/middleware')
const { Blog, User } = require('../models/')

const blogFinder = async (request, res, next) => {
  request.blog = await Blog.findByPk(request.params.id, {
    include: {
      model: User,
    },
  })
  next()
}

blogsRouter.get('/', userExtractor, async (request, response) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['user_id'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where: {
      user_id: request.user.id,
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${request.query.search ?? ''}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${request.query.search ?? ''}%`,
          },
        },
      ],
    },
    order: [['likes', 'DESC']],
  })
  response.json(blogs)
})

blogsRouter.get('/:id', blogFinder, async (request, response) => {
  if (request.blog) {
    response.json(request.blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (body.year && body.year > new Date().getFullYear()) {
    return response.status(401).json({
      error: 'year is greater than the current year',
    })
  } else {
    body.year = 1991
  }

  const blog = await Blog.create({
    title: body.title,
    author: body.author,
    url: body.url,
    year: body.year,
    likes: body.likes === undefined ? 0 : body.likes,
    user_id: user.id,
  })

  response.status(201).json(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  let blog = await Blog.findById(request.params.id)
  blog.comments.push(request.body.comment)
  const updateResult = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
  response.json(updateResult)
})

blogsRouter.put(
  '/:id',
  blogFinder,
  userExtractor,
  async (request, response) => {
    if (
      typeof request.body.likes === 'string' ||
      request.body.likes instanceof String
    )
      throw Error('ValidationError')

    const blog = await Blog.findByPk(request.params.id)
    if (blog) {
      blog.likes = request.body.likes
      const result = await blog.save()
      response.json(result)
    } else {
      response.status(404).end()
    }
  }
)

blogsRouter.delete(
  '/:id',
  blogFinder,
  userExtractor,
  async (request, response) => {
    if (
      !request.user ||
      request.blog.user?.id.toString() !== request.user.id.toString()
    ) {
      return response.status(401).json({ error: 'operation not permitted' })
    }

    const user = await User.findByPk(request.user.id, {
      include: {
        model: Blog,
      },
    })

    user.blogs = user.blogs.filter((b) => b.id !== request.blog.id)

    await user.save()
    await request.blog.destroy()

    response.status(204).end()
  }
)

module.exports = blogsRouter
