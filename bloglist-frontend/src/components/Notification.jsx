const Notification = ({ message }) => {
  if (message === null || message === '') {
    return null
  }

  return <h2>{message}</h2>
}

export default Notification
