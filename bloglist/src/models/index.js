const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

Blog.belongsTo(User)
Blog.belongsToMany(ReadingList, { through: Blog })
User.hasMany(Blog)
User.belongsToMany(ReadingList, { through: User })

module.exports = {
  Blog,
  User,
  ReadingList,
}
