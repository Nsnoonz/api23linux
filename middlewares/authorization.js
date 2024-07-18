import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import NodeCache from 'node-cache'

import * as appConfig from '../configs/app.js'
import dbConn from '../configs/dbConn.js'
import errorHelper from '../helpers/error.helper.js'
import dbHelper from '../helpers/database.helper.js'
import utilHelper from '../helpers/utility.helper.js'
import workerControl from '../worker-pool/controller.js'

const apiCache = new NodeCache()

function extractToken (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  } else {
    return null
  }
}

const validateAPIToken = async (req, res, next) => {
  const token = extractToken(req)

  if (token == null) {
    next(errorHelper.createError('Unauthorized: Missing api credentials', 401))
  } else {
    let validToken = false

    if (apiCache.has(token)) {
      const value = apiCache.get(token)

      if (utilHelper.dayBetween(new Date(), value.end_date) >= 0) {
        validToken = true
      }
    }

    if (validToken === false) {
      const query = {}

      query.header = { system: 'Demo', description: 'Demo Query', createdate: '2023-01-11', updatedate: '2023-01-11', contactname: 'Nopphadol' }
      query.sql = `
      select apit_start_date, ifnull(apit_end_date, date(now())) as apit_end_date, apit_is_active 
      from api_token 
      where apit_is_active = 1
      and datediff(now(), apit_start_date) >= 0
      and (datediff(apit_end_date, now()) >= 0 or apit_end_date is null)
      and apit_token =  :token 
      `
      query.params = dbHelper.createParameter(this, req)
      query.params.token = token
      const preparedQuery = dbHelper.preparedQuery(query)

      const workerPool = workerControl.get()
      const rs = await workerPool.myExec(dbConn.mysql.connAPIApplication, preparedQuery)

      if (rs.length > 0) {
        const obj = { start_date: rs[0].apit_start_date, end_date: rs[0].apit_end_date }
        const success = apiCache.set(token, obj, 300)

        next()
      } else {
        next(errorHelper.createError('Unauthorized: Invalid api credentials', 401))
      }
    } else {
      next()
    }
  }
}

const validateAPIPayload = (req, res, next) => {
  if (req.body && JSON.stringify(req.body) !== '{}' && !req.headers.checksum) {
    next(errorHelper.createError('Not Acceptable: Missing payload checksum', 406))
  } else if (req.body && JSON.stringify(req.body) !== '{}' && !req.body.timestamp) {
    next(errorHelper.createError('Not Acceptable: Missing payload timestamp', 406))
  } else if (req.body && JSON.stringify(req.body) !== '{}' && !utilHelper.isNumericString(req.body.timestamp)) {
    next(errorHelper.createError('Not Acceptable: Invalid payload timestamp', 406))
  } else if (req.body && JSON.stringify(req.body) !== '{}' && (utilHelper.timeBetween(req.body.timestamp, new Date()) > 1800 || utilHelper.timeBetween(req.body.timestamp, new Date()) < -1800)) {
    next(errorHelper.createError('Not Acceptable: Invalid payload timestamp', 406))
  } else if (req.body && JSON.stringify(req.body) !== '{}' && req.headers.checksum) {
    let date = new Date()

    const weekday1 = (date.getDay() + 1).toString()
    const yearStr1 = date.getFullYear().toString()
    const sYear1 = yearStr1.substr(0, 2)
    const eYear1 = yearStr1.substr(2, 2)
    const day1 = date.getDate().toString()
    const hour1 = date.getHours()

    const saltKey1 = weekday1 + sYear1 + day1 + eYear1

    date = utilHelper.addDays(date, -1)

    const weekday2 = (date.getDay() + 1).toString()
    const yearStr2 = date.getFullYear().toString()
    const sYear2 = yearStr2.substr(0, 2)
    const eYear2 = yearStr2.substr(2, 2)
    const day2 = date.getDate().toString()

    const saltKey2 = weekday2 + sYear2 + day2 + eYear2

    const validate1 = crypto.createHmac('sha512', saltKey1).update(JSON.stringify(req.body)).digest('hex')
    const validate2 = crypto.createHmac('sha512', saltKey2).update(JSON.stringify(req.body)).digest('hex')

    if (req.headers.checksum === validate1 || (hour1 < 6 && req.headers.checksum === validate2)) {
      next()
    } else {
      next(errorHelper.createError('Not Acceptable: Invalid payload checksum', 406))
    }
  } else {
    next()
  }
}

export default { validateAPIToken, validateAPIPayload }
