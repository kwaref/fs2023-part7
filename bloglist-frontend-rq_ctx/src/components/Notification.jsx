import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

export const Notification = ({ message, error = false }) => {
  return message ? (
    <Alert id="notification-message" variant={error ? 'danger' : 'success'}>
      {message}
    </Alert>
  ) : null
}

Notification.protoTypes = {
  message: PropTypes.string.isRequired,
}
