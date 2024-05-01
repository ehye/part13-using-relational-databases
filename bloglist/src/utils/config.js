require('dotenv').config()

const PORT = process.env.PORT | 3003

const SECRET = process.env.SECRET || 'secret'

const ARGV = process.argv

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URL
    : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET,
  ARGV,
}
