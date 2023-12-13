import PropTypes from 'prop-types'

export const Notification = ({ message, error = false }) => {
  return message ? (
    <div id="notification-message" className={error ? 'error' : 'success'}>
      {message}
    </div>
  ) : null
}

Notification.protoTypes = {
  message: PropTypes.string.isRequired,
}
