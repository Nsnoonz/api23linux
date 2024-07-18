import compression from 'compression'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import * as appConfig from './app.js'
import responseFormat from '../middlewares/responseFormat.js'
// import authorization from '../middlewares/authorization.js'
import routes from '../routes/index.js'
import errorHandler from './errorHandler.js'
import WorkerCon from '../worker-pool/controller.js'

const app = express()

const options = { minWorkers: 'max' }
WorkerCon.init(options)

app.use(compression())
app.use(cors())
app.use(helmet())
app.use(morgan('short'))
app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(responseFormat)

// if (appConfig.environment === 'production' || appConfig.environment === 'staging') {
//   app.use(authorization.validateAPIPayload)
// }

app.use(routes)

errorHandler(app)

export default app;