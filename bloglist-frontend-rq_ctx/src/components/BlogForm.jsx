import PropTypes from 'prop-types'
import { useField } from '../hooks'

const BlogForm = ({ handleCreate }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const handleSubmit = (evt) => {
    evt.preventDefault()
    handleCreate({ title: title.value, author: author.value, url: url.value })
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input id="titleInput" name="title" {...title} />
        </div>
        <div>
          author
          <input id="authorInput" name="author" {...author} />
        </div>
        <div>
          url
          <input id="urlInput" name="url" {...url} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
}

export default BlogForm
