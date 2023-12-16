import PropTypes from 'prop-types'
import { useField } from '../hooks'
import { Button, Form } from 'react-bootstrap'

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
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control id="titleInput" name="title" {...title} />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control id="authorInput" name="author" {...author} />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control id="urlInput" name="url" {...url} />
        </Form.Group>
        <Button variant="primary" size="sm" type="submit">
          create
        </Button>
      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
}

export default BlogForm
