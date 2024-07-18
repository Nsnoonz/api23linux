import express from 'express'
import apiInternal from './api_internal/index.js'
import apiExternal from './api_external/index.js'

import * as appConfig from '../configs/app.js'

const router = express.Router()

router.get('/api/hello', (req, res) => {
  res.success('Hello World!')
})

router.use('/api', apiInternal)
router.use('/api', apiExternal)

export default router
