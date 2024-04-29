const ErrorNotification = ({ error }) => {
  if (error === null || error === '') {
    return null
  }

  return <div className="error">{error}</div>
}

export default ErrorNotification
