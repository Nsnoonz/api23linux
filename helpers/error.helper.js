import utilHelper from "./utility.helper.js"

const createError = (errorMsg = '', statusCode = 500) => {
  let error

  if (typeof errorMsg === 'string' || errorMsg instanceof String) {
    error = Error(errorMsg)
    error.status = statusCode
  } else if (errorMsg instanceof Error) { 
    console.error(errorMsg)

    if (utilHelper.isJson(errorMsg.message)) {
      error = Error(JSON.stringify(JSON.parse(errorMsg.message)))
    } else {
      error = Error(errorMsg)
    }
    error.status = errorMsg.status
  } else {
    error = Error(JSON.stringify(errorMsg))
    error.status = statusCode
  }  

  return error
}

export default { createError }