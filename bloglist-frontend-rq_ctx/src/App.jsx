import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useNotificationDispatch,
  useNotificationValue,
  useUserDispatch,
  useUserValue,
} from './Context'
import auth from './services/auth'

const App = () => {
  const client = useQueryClient()

  const notification = useNotificationValue()
  const user = useUserValue()

  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()

  const blogFormRef = useRef()

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
    } catch (error) {
      notificationDispatch({
        type: 'SET',
        payload: { message: error.response.data.error, error: true },
      })
      setTimeout(() => notificationDispatch({ type: 'REMOVE' }), 3000)
    }
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = client.getQueryData(['blogs'])
      client.setQueryData(['blogs'], [...blogs, newBlog])
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

  const handleCreate = async (postData) => {
    newBlogMutation.mutate(postData)
    blogFormRef.current.toggleVisibility()
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    userDispatch({ type: 'CLEAR_USER' })
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm handleCreate={handleCreate} />
    </Togglable>
  )

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  console.log(JSON.parse(JSON.stringify({ isPending, isError, data, error })))

  return (
    <>
      <Notification
        message={notification?.message}
        error={notification?.error}
      />
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
          {data?.map((blog) => (
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
