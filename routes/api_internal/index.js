import express from 'express'

import demo from './demo/index.js'
import convertpdf from './convertpdf/index.js'

const router = express.Router()

router.use('/demo', demo)
router.use('/convertpdf', convertpdf)

export default router
