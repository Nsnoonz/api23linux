const dbConn = {
  mssql: {
    conn02: {
      server: process.env.SQL_02_SERVER,
      user: process.env.SQL_02_USER,
      password: process.env.SQL_02_PASSWORD,
      database: process.env.SQL_02_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    conn03: {
      server: process.env.SQL_03_SERVER,
      user: process.env.SQL_03_USER,
      password: process.env.SQL_03_PASSWORD,
      database: process.env.SQL_03_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    conn04: {
      server: process.env.SQL_04_SERVER,
      user: process.env.SQL_04_USER,
      password: process.env.SQL_04_PASSWORD,
      database: process.env.SQL_04_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    conn05: {
      server: process.env.SQL_05_SERVER,
      user: process.env.SQL_05_USER,
      password: process.env.SQL_05_PASSWORD,
      database: process.env.SQL_05_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    conn30: {
      server: process.env.SQL_30_SERVER,
      user: process.env.SQL_30_USER,
      password: process.env.SQL_30_PASSWORD,
      database: process.env.SQL_30_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    conn36: {
      server: process.env.SQL_36_SERVER,
      user: process.env.SQL_36_USER,
      password: process.env.SQL_36_PASSWORD,
      database: process.env.SQL_36_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    },
    connonline: {
      server: process.env.SQL_ONLINE_SERVER,
      user: process.env.SQL_ONLINE_USER,
      password: process.env.SQL_ONLINE_PASSWORD,
      database: process.env.SQL_ONLINE_DATABASE,
      connectionTimeout: 60000,
      requestTimeout: 60000,
      options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    }
  },

  mysql: {
    conn93: {
      host: process.env.MYSQL_93_SERVER,
      user: process.env.MYSQL_93_USER,
      password: process.env.MYSQL_93_PASSWORD,
      database: process.env.MYSQL_93_DATABASE,
      connectionLimit : 100
    },
    connAPIApplication: {
      host: process.env.MYSQL_API_App_SERVER,
      user: process.env.MYSQL_API_App_USER,
      password: process.env.MYSQL_API_App_PASSWORD,
      database: process.env.MYSQL_API_App_DATABASE,
      connectionLimit : 100
    }
  }
}

export default dbConn
