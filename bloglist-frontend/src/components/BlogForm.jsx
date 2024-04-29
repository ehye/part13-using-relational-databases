import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input id="input-title" value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        author: <input id="input-author" value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>
        url: <input id="input-url" value={newUrl} onChange={handleUrlChange} />
      </div>
      <button id='button-createBlog' type="submit">create</button>
    </form>
  )
}

export default BlogForm
