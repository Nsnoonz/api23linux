const errorHandler = (app) => {
  app.use((req, res, next) => {
    const err = new Error('Endpoint Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    res.status(statusCode)
    res.json({ result: { status: 'error', statuscode: statusCode, message: err.message } })

    next()
  })
}

export default errorHandler
