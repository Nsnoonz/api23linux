import WorkerPool from 'workerpool'
import mysqlExec from '../databases/mysql.js';
import mssqlExec from '../databases/mssql.js';

function myExec(db, query)  {
  return mysqlExec(db, query)
}

function msExec(db, query)  {
  return mssqlExec(db, query)
}

WorkerPool.worker({
  myExec,
  msExec
})