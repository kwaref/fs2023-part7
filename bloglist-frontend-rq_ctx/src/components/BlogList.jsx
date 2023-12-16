import { useRef } from 'react'
import Blog from './Blog'
import { useNotificationDispatch, useUserValue } from '../Context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { Link } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'

export const BlogList = () => {
  const loggedUser = useUserValue()
  const client = useQueryClient()

  const blogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm handleCreate={handleCreate} />
    </Togglable>
  )

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
    try {
      newBlogMutation.mutate(postData)
      blogFormRef.current.toggleVisibility()
      notificationDispatch({
        type: 'SET',
        payload: {
          message: `Successfully Added ${postData.title}`,
          error: false,
        },
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

  const { data } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  return !loggedUser ? null : (
    <div>
      <h2>blogs</h2>
      {blogForm()}
      <Table striped>
        <tbody>
          {data
            ?.sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    type="button"
                    onClick={() => handleRemove(blog.id)}
                  >
                    remove
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}
