const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const logger = require('./logger')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL)

const migrator = new Umzug({
  migrations: {
    glob: ['**/migrations/*.js'],
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
})

const runMigrations = async () => {
  const m = await migrator.down()
  console.log('Migrations down:', {
    files: m.map((mig) => mig.name),
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const createSeed = async () => {
  await sequelize.getQueryInterface().bulkInsert('users', [
    {
      id: 1,
      username: 'admin@root.com',
      name: 'admin',
      created_at: new Date(),
    },
  ])
  await sequelize.getQueryInterface().bulkInsert('blogs', [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      year: 1991,
      user_id: 1,
      likes: 7,
      created_at: new Date(),
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      year: 1991,
      user_id: 1,
      likes: 5,
      created_at: new Date(),
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      year: 1991,
      user_id: 1,
      likes: 12,
      created_at: new Date(),
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      year: 1991,
      user_id: 1,
      likes: 10,
      created_at: new Date(),
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      year: 1991,
      user_id: 1,
      likes: 2,
      created_at: new Date(),
    },
  ])
  await sequelize.getQueryInterface().bulkInsert('readingList', [
    {
      user_id: '1',
      blog_id: '1',
      created_at: new Date(),
    },
  ])
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    await createSeed()
    logger.info('connected to the database')
  } catch (err) {
    logger.info('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
