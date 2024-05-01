const Sequelize = require('sequelize')
const { DATABASE_URL, ARGV } = require('./config')
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
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const createSeed = async () => {
  await sequelize.getQueryInterface().bulkInsert('users', [
    {
      username: 'admin@root.com',
      name: 'admin',
      disabled: false,
      created_at: new Date(),
    },
    {
      username: 'su@root.com',
      name: 'su',
      disabled: true,
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
  await sequelize.getQueryInterface().bulkInsert('reading_lists', [
    {
      user_id: '1',
      blog_id: '1',
      created_at: new Date(),
    },
    {
      user_id: '1',
      blog_id: '2',
      created_at: new Date(),
    },
  ])
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    if (ARGV[3] === 'init') {
      await sequelize.drop({ cascade: true })
      await runMigrations()
      await createSeed()
      logger.info('🎉 init database succeed')
      sequelize.close()
      return process.exit(0)
    }
    logger.info('connected to the database')
  } catch (err) {
    logger.error('failed to connect to the database')
    logger.error(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }
