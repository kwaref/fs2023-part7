import { useEffect, useRef, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
  Navigate,
} from 'react-router-dom'
import blogService from './services/blogs'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import { Notification } from './components/Notification'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useNotificationDispatch,
  useNotificationValue,
  useUserDispatch,
  useUserValue,
} from './Context'
import auth from './services/auth'
import { UserList } from './components/UserList'
import { BlogList } from './components/BlogList'
import { User } from './components/User'
import Blog from './components/Blog'
import { Nav, Navbar } from 'react-bootstrap'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link to="/" style={padding}>
              blogs
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">
              users
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user ? (
              <span>
                <em style={padding}>{user.name} logged in</em>
                <button
                  className="logout-button btn btn-sm btn-secondary"
                  onClick={handleLogout}
                >
                  logout
                </button>
              </span>
            ) : (
              <Link style={padding} to="/login">
                login
              </Link>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const App = () => {
  const notification = useNotificationValue()
  const loggedUser = useUserValue()

  const navigate = useNavigate()

  const client = useQueryClient()

  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (accessData) => {
    try {
      const loggedUser = await auth.login(accessData)
      blogService.setToken(loggedUser.token)
      userDispatch({ type: 'SET_USER', payload: loggedUser })
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(loggedUser)
      )
      notificationDispatch({
        type: 'SET',
        payload: { message: `welcome ${loggedUser.name}`, error: false },
      })
      setTimeout(() => notificationDispatch({ type: 'REMOVE' }), 3000)
    } catch (error) {
      notificationDispatch({
        type: 'SET',
        payload: { message: error.response.data.error, error: true },
      })
      setTimeout(() => notificationDispatch({ type: 'REMOVE' }), 3000)
    }
  }

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR_USER' })
    window.localStorage.removeItem('loggedBloglistAppUser')
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      client.invalidateQueries('blogs')
    },
    onError: (error) => {
      console.log(error)
      notificationDispatch({
        type: 'SET',
        payload: { message: error.response.data.error, error: true },
      })
      setTimeout(() => notificationDispatch({ type: 'REMOVE' }), 3000)
    },
  })

  const handleRemove = async (id) => {
    try {
      deleteBlogMutation.mutate(id)
      notificationDispatch({
        type: 'SET',
        payload: { message: 'Successfully deleted', error: false },
      })
      navigate('/')
      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE',
          payload: null,
        })
      }, 3000)
    } catch (error) {
      notificationDispatch({
        type: 'SET',
        payload: { message: error.response.data.error, error: true },
      })
      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE',
          payload: null,
        })
      }, 3000)
    }
  }

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const blogs = client.getQueryData(['blogs'])
      const newBlogs = blogs
        .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes)
      client.setQueryData(['blogs'], newBlogs)
    },
    onError: (error) => {
      console.log(error)
      notificationDispatch({
        type: 'SET',
        payload: { message: error.response.data.error, error: true },
      })
      setTimeout(() => notificationDispatch({ type: 'REMOVE' }), 3000)
    },
  })

  const handleLike = async (data) => {
    updateBlogMutation.mutate({ ...data, likes: data.likes + 1 })
  }

  const handleComment = async (data) => {
    updateBlogMutation.mutate(data)
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  console.log(JSON.parse(JSON.stringify({ isPending, isError, data, error })))

  if (isError) {
    console.log(error)
    handleLogout()
  }

  const users = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (users.isError) {
    console.log('FAILED', users)
  }

  const userMatch = useMatch('/users/:id')
  const usr = userMatch
    ? users?.data?.find((a) => a.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? data?.find((a) => a.id === blogMatch.params.id)
    : null

  return (
    <div className="container">
      {loggedUser && <Menu user={loggedUser} handleLogout={handleLogout} />}
      <Notification
        message={notification?.message}
        error={notification?.error}
      />
      {loggedUser === null ? (
        <div>
          <LoginForm handleLogin={handleLogin} />
        </div>
      ) : null}
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList users={users?.data} />} />
        <Route path="/users/:id" element={<User user={usr} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              user={loggedUser}
              blog={blog}
              like={() => handleLike(blog)}
              remove={() => handleRemove(blog.id)}
              comment={() => handleComment(blog)}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
