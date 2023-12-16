import PropTypes from 'prop-types'
import { useUserValue } from '../Context'
import CommentForm from './CommentForm'
import { Button } from 'react-bootstrap'

const Blog = ({ blog, like, remove, comment }) => {
  const loggedUser = useUserValue()

  const handleDelete = () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )
    confirm && remove(blog.id)
  }

  const handleComment = (message) => {
    const commentedBlog = { ...blog, comments: blog.comments.push(message) }
    comment(commentedBlog)
  }

  return !loggedUser || !blog ? null : (
    <div className="blog">
      <h2>
        {`${blog.title} ${blog.author}`}
        <span>
          <Button
            type="button"
            onClick={handleDelete}
            variant="danger"
            size="sm"
          >
            remove
          </Button>
        </span>
      </h2>
      <p>
        <a href={blog.url} target="_blank">
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} likes{' '}
        <span>
          <Button variant="primary" size="sm" onClick={like}>
            like
          </Button>
        </span>
      </p>
      <p>added by {blog.user.name}</p>
      <div>
        <h3>comments</h3>
        <CommentForm handleComment={handleComment} />
        <ul>
          {blog.comments.map((c, index) => (
            <li key={`${c}-${index}`}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

Blog.propTypes = {
  // blog: PropTypes.object.isRequired,
  // user: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
}

export default Blog
