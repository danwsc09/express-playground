const loggingMiddleware = (req, res, next) => {
  console.log(Date.now())
  next()
}

export default loggingMiddleware
