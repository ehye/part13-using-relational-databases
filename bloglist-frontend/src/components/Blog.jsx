import { useState, useRef } from 'react'
import Togglable from './Togglable'

const removeButton = (removeBlog) => (
  <button id="button-remove" onClick={removeBlog}>
    remove
  </button>
)

const Blog = ({ blog, updateLikes, removeBlog, isRemovable }) => {
  const viewFormRef = useRef()
  const [likes, setLikes] = useState(blog.likes)

  const handleLikes = async () => {
    const res = await updateLikes()
    blog.likes = res.likes
    setLikes(res.likes)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blog" style={blogStyle}>
      {blog.title}
      <Togglable buttonLabel="view" toggleButtonLabel="hide" ref={viewFormRef}>
        <ul>
          <div>{blog.url}</div>
          <div>
            likes {likes}
            <button id="btn-likes" onClick={handleLikes}>
              like
            </button>
          </div>
          <div>{blog.author}</div>
        </ul>
        {isRemovable && removeButton(removeBlog)}
      </Togglable>
    </div>
  )
}

export default Blog
