const logoutRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const { Session } = require('../models/')
const { info, error } = require('../utils/logger')

logoutRouter.delete('/', userExtractor, async (request, response) => {
  const session = await Session.findOne({
    where: { user_id: request.user.id },
  })

  if (session) {
    await session.destroy()
    info(`user ${request.user.id} logout`)
    response.status(200).end()
  } else {
    error('not such session for user ', request.user.id)
    response.status(404).end()
  }
})

module.exports = logoutRouter
