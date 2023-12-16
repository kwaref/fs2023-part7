import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import { useField } from '../hooks'

const LoginForm = ({ handleLogin }) => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const handleSubmit = (evt) => {
    evt.preventDefault()
    handleLogin({ username: username.value, password: password.value })
    resetPassword()
    resetUsername()
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control id="input-username" {...username} name="Username" />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control id="input-password" {...password} name="Password" />
        </Form.Group>
        <Button variant="primary" id="button-login" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
