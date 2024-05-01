const readingListsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const { ReadingList } = require('../models/')

readingListsRouter.post('/', async (request, response) => {
  const readingList = await ReadingList.create({
    user_id: request.body.userId,
    blog_id: request.body.blogId,
  })

  response.status(200).send(readingList)
})

readingListsRouter.get('/', async (request, response) => {
  const readingList = await ReadingList.findAll()

  response.status(200).send(readingList)
})

readingListsRouter.put('/:id', userExtractor, async (request, response) => {
  const readingList = await ReadingList.findByPk(request.params.id)
  if (readingList.userId === request.user.id) {
    readingList.is_read = request.body.read
    const result = readingList.save()
    response.send(result)
  } else {
    response.status(401).send({
      error:
        'The user can only mark the blogs in their own reading list as read.',
    })
  }
})

module.exports = readingListsRouter
