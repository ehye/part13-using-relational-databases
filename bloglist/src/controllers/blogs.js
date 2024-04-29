const blogsRouter = require('express').Router()
// const { userExtractor } = require('../utils/middleware')

const { Blog } = require('../models/')

const blogFinder = async (request, res, next) => {
  request.blog = await Blog.findByPk(request.params.id)
  next()
}

blogsRouter.get('/', blogFinder, async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

blogsRouter.get('/:id', blogFinder, async (request, response) => {
  if (request.blog) {
    response.json(request.blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  // const user = request.user

  const blog = await Blog.create({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    // user: user.id,
  })

  // const result = await blog.save()
  // user.blogs = user.blogs.concat(result._id)
  // await user.save()
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

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (blog) {
    blog.likes = request.body.likes
    const result = await blog.save()
    response.json(result)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', blogFinder, async (request, response) => {
  if (request.blog) {
    await request.blog.destroy()
  }
  response.status(204).end()

  // const user = request.user

  // if (!user || blog.user._id.toString() !== user.id.toString()) {
  //   return response.status(401).json({ error: 'operation not permitted' })
  // }

  // user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())

  // await user.save()
  // await Blog.findByIdAndDelete(blog.id)

  response.status(204).end()
})

module.exports = blogsRouter
