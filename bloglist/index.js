const app = require('./src/app') // the actual Express app
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')
const { connectToDatabase } = require('./src/utils/db')

const start = async () => {
  await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
}

start()
