import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import authService from './services/auth'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from './reducers/notificationReducer'
import {
  createBlog,
  initializeBlogs,
  likeUp,
  removeBlog,
} from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()

  const [user, setUser] = useState(null)

  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)

  const blogFormRef = useRef()

  useEffect(() => {
    user && dispatch(initializeBlogs())
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (accessData) => {
    try {
      const user = await authService.login(accessData)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user))
    } catch (error) {
      setNotification({ message: error.response.data.error, error: true })
      setTimeout(() => {
        setNotification({ message: null, error: false })
      }, 3000)
    }
  }

  const handleCreate = async (postData) => {
    dispatch(createBlog(postData))
    blogFormRef.current.toggleVisibility()
  }

  const handleLike = async (data) => {
    try {
      dispatch(likeUp(data))
      dispatch(
        notify({ message: `you liked ${data.title}`, error: false }, 3000)
      )
    } catch (error) {
      dispatch(
        notify({ message: error.response.data.error, error: true }, 3000)
      )
    }
  }

  const handleRemove = async (id) => {
    try {
      dispatch(removeBlog(id))
    } catch (error) {
      dispatch(
        notify({ message: error.response.data.error, error: true }, 3000)
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm handleCreate={handleCreate} />
    </Togglable>
  )

  return (
    <>
      <Notification message={notification.message} error={notification.error} />
      {user === null ? (
        <div>
          <LoginForm handleLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            <span>
              {`${user.name} logged in`}{' '}
              <button className="logout-button" onClick={handleLogout}>
                logout
              </button>
            </span>
          </p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              like={() => handleLike(blog)}
              remove={handleRemove}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default App
