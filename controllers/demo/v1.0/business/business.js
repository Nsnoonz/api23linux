import { body } from 'express-validator'

import dbHelper from '../../../../helpers/database.helper.js'
import errorHelper from '../../../../helpers/error.helper.js'
import validatorResult from '../../../../middlewares/validatorResult.js'
import database from '../database/database.js'

const Business = {
  async bfnDemo (req, res) {
    try {
      /*
      ! Start Validate Payload
      */
      await body('username').notEmpty().run(req)

      validatorResult(req, res)
      /*
      ! End Validate Payload
      */

      const params = dbHelper.createParameter(this, req)
      params.username = req.body.username

      const result = await database.dfnDemo(params)
      return result
    } catch (err) {
      throw errorHelper.createError(err)
    }
  }
}

export default Business
