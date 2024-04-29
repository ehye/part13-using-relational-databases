import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [addedMessage, setAddedMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      window.location.reload()
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const addBlogForm = () => (
    <div>
      <Togglable buttonLabel="add new" toggleButtonLabel="cancel" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <ErrorNotification error={errorMessage} />
    </div>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
      setAddedMessage('a new blog ' + createdBlog.title + ' by ' + createdBlog.author + ' added')
      setTimeout(() => {
        setAddedMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLikesOf = async (blogObject) => {
    const updatedBlog = {
      user: blogObject.user.id,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
      likes: blogObject.likes + 1,
    }
    const res = await blogService.update(blogObject.id, updatedBlog)
    return res
  }

  const removeBlogOf = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.remove(blogObject.id)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
  }

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  return (
    <div>
      <ErrorNotification error={errorMessage} />
      <h2>blogs</h2>
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <button id="button-logout" onClick={handleLogout}>
              logout
            </button>
          </p>
          <Notification message={addedMessage} />
          <ul>
            {blogs.sort(compareLikes).map((blog, i) => (
              <Blog
                key={i}
                blog={blog}
                updateLikes={() => updateLikesOf(blog)}
                removeBlog={() => removeBlogOf(blog)}
                isRemovable={user.id === blog.user.id}
              />
            ))}
          </ul>
          {addBlogForm()}
        </div>
      )}
    </div>
  )
}

export default App
