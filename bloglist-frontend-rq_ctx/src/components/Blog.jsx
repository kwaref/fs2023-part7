import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, like, remove }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButtonStyle ={
    color: 'white',
    backgroundColor: 'orange',
    borderColor:'orange',
    borderRadius: '10%'
  }

  const toggleButtonStyle ={
    color: 'white',
    backgroundColor: 'green',
    borderColor:'green',
    borderRadius: '10%'
  }

  const likeButtonStyle ={
    color: 'black',
    backgroundColor: 'cyan',
    borderColor:'cyan',
    borderRadius: '10%'
  }

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    const confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    confirm && remove(blog.id)
  }

  return <div className="blog" style={blogStyle}>
    <p className="blog-info" style={{ margin: '0px' }}>
      {blog.title} {blog.author} <button className="toggle-button" style={toggleButtonStyle} onClick={() => setOpen(!open)}>{open ? 'hide':'view'}</button>
    </p>
    <div className="blog-details" style={{ display: open ? 'block' : 'none' }}>
      <p className="blog-url" style={{ margin: '0px' }}>{blog.url}</p>
      <p className="blog-likes" style={{ margin: '0px' }}>likes <span id='likes-holder'>{blog.likes || 0}</span> <button className='like-button' style={likeButtonStyle} onClick={() => like({ ...blog, likes: blog.likes + 1 })}>like</button></p>
      <p className="blog-user" style={{ margin: '0px' }}>{blog.user ? blog.user.name : 'anonymous'}</p>
      {blog.user.username === user.username ? <button className='remove-button' style={removeButtonStyle} onClick={handleDelete}>remove</button>: null}
    </div>
  </div>
}


Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

export default Blog