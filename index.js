'use strict'

import * as appConfig from './configs/app.js'
import app from './configs/express.js'

let server = null

server = app.listen(appConfig.port, () => {
  console.log(`API listening at port ${server.address().port} on ${appConfig.environment} environment`)
})

server.timeout = 1800000
