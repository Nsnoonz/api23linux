import { validationResult } from 'express-validator'

import errorHelper from '../helpers/error.helper.js'

const validatorResult = (req, res) => {
  let result = true

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    result = false
    throw errorHelper.createError(errors.array(), 406)
  }

  return result
}

export default validatorResult
