import utilHelper from '../helpers/utility.helper.js'

const responseFormat = (req, res, next) => {
  res.success = (data = '', statusCode = 200) => {
    res.status(statusCode || 200).send({ result: { status: 'success', statuscode: statusCode, data } })
  }

  res.error = (errorMsg, statusCode = 500) => {
    if (utilHelper.isJson(errorMsg)) {
      res.status(statusCode || 500).send({ result: { status: 'error', statuscode: statusCode, message: JSON.parse(errorMsg) } })
    } else {
      res.status(statusCode || 500).send({ result: { status: 'error', statuscode: statusCode, message: errorMsg } })
    }
  }

  next()
}

export default responseFormat
