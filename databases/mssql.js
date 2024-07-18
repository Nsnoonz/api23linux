import mssql from 'mssql'

const poolMap = new Map()

const setDB = async (name, config) => {
  const pool = new mssql.ConnectionPool(config)
  pool.on('error', error => {
    throw error
  })
  const close = pool.close.bind(pool)
  pool.close = (...args) => {
    poolMap.delete(name)
    return close(...args)
  }
  poolMap.set(name, await pool.connect())
}

async function getDB (name, config) {
  if (!poolMap.has(name)) {
    await setDB(name, config)
  }
  return poolMap.get(name)
}

const mssqlExec = async (db, query) => {
  let result
  let name = db.server + db.database
  try {
    if (typeof query !== 'object' || query === null) {
      throw Error('Query is not prepared')
    } else if (query.status !== 'success') {
      throw Error('Query is not accepted')
    } else {
      const queryHeader = query.header
      const preparedQuery = query.sql
      let pool = await getDB(name, db)
      if (!pool) {
        poolMap.delete(name)
        pool = await this.getDB(name, db)
      }
      let isPoolError = false
      if (isPoolError === false) {
        try {
          const readyQuery = '/*' + queryHeader + '*/' + preparedQuery
          result = await pool.request().query(readyQuery)
          result = result.recordset
        } catch (error) {
          poolMap.delete(name)
          throw error
        }
      }
    }
  } catch (error) {
    poolMap.delete(name)
    throw error
  }
  return result
}

export default mssqlExec