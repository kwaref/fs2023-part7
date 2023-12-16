import PropTypes from 'prop-types'
import { useField } from '../hooks'
import { Button, Form, InputGroup } from 'react-bootstrap'

const CommentForm = ({ blog, handleComment }) => {
  const { reset: resetComment, ...comment } = useField('text')

  const handleSubmit = (evt) => {
    evt.preventDefault()
    handleComment(comment.value)
    resetComment()
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            id="commentInput"
            name="comment"
            {...comment}
            size="sm"
          />
          <Button variant="primary" size="sm" type="submit">
            add comment
          </Button>
        </InputGroup>
      </Form>
    </div>
  )
}

CommentForm.propTypes = {
  handleComment: PropTypes.func.isRequired,
}

export default CommentForm
