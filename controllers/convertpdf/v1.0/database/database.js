import dbConn from '../../../../configs/dbConn.js'
import dbHelper from '../../../../helpers/database.helper.js'
import errorHelper from '../../../../helpers/error.helper.js'
import workerControl from '../../../../worker-pool/controller.js'

const Database = {
  async dfnDemo (inputParams) {
    try {
      /*
      * This is Demo Query

      const query = {}

      query.header = {'system': 'Demo', 'description': 'Demo Query', 'createdate': '2023-01-11', 'updatedate': '2023-01-11', 'contactname': 'Nopphadol'}
      query.sql = `
        select id = 1, username = `+ inputParams.username +`
      `
      query.params = dbHelper.addParameterMethod(this, inputParams)

      const preparedQuery = dbHelper.preparedQuery(query)

      let workerPool = workerControl.get()
      let result = await workerPool.msExec(dbConn.mssql.conn30, preparedQuery)
      */

      /*
      * This is Demo Fix Result
      */

      const result = [{ id: '1', username: inputParams.username }]
      return result
    } catch (error) {
      throw errorHelper.createError(error)
    }
  }
}

export default Database
