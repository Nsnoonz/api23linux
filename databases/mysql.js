import mysql from 'mysql'
import util from 'util'

import errorHelper from '../helpers/error.helper.js'

const mysqlExec = async (db, query) => {
  let result

  try {
    if (typeof query !== 'object' || query === null) {
      throw Error('Query is not prepared')
    } else if (query.status !== 'success') {
      throw Error('Query is not accepted')
    } else {
      const queryHeader = query.header
      const preparedQuery = query.sql

      const connection = mysql.createConnection(db)
      const exec = util.promisify(connection.query).bind(connection)

      try {
        result = await exec(preparedQuery)
      } catch (error) {
        throw error
      } finally {
        connection.end()
      }
    }
  } catch (error) {
    throw error
  }
  return result
}


export default mysqlExec
