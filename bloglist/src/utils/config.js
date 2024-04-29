require('dotenv').config()

const PORT = process.env.PORT | 3003

const SECRET = process.env.SECRET || 'secret'

const DATABASE_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.DATABASE_URL

module.exports = {
  DATABASE_URI,
  PORT,
  SECRET,
}
