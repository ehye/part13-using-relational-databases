const config = require('./src/utils/config')
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(config.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })
    sequelize.close()

    blogs.forEach((blog) => {
      console.log("%s: '%s', %d likes", blog.author, blog.title, blog.likes)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
