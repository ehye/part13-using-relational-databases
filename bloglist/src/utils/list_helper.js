const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach((blog) => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  let max = 0
  let favoriteBlog
  for (const blog of blogs) {
    if (max < blog.likes) {
      max = blog.likes
      favoriteBlog = blog
    }
  }
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  let group = _.groupBy(blogs, (blog) => blog.author)
  const result = _.maxBy(_.keys(group), (author) => group[author].length)
  return { author: result, blogs: group[result].length }
}

const mostLikes = (blogs) => {
  const group = _.groupBy(blogs, (blog) => blog.author)
  const sortedAuthors = _.map(group, (authorData, author) => ({
    author,
    likes: _.sumBy(authorData, (blog) => blog.likes),
  }))
  const authorWithMostLikes = _.maxBy(sortedAuthors, (blog) => blog.likes)
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
