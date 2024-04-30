const authorsRouter = require('express').Router()
const { Blog } = require('../models/')
const { sequelize } = require('../utils/db')

authorsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['user_id', 'id', 'title', 'url', 'likes'],
      include: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('blog.id')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
    },
    group: 'author',
    order: [['likes', 'DESC']],
  })
  response.json(blogs)
})

module.exports = authorsRouter
