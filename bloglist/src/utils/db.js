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
  // const m = await migrator.down()
  // console.log('Migrations down:', {
  //   files: m.map((mig) => mig.name),
  // })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    logger.info('connected to the database')
  } catch (err) {
    logger.info('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
