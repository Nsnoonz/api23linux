import express from 'express'
import demo from '../../../controllers/demo/v1.0/index.js'

const router = express.Router()

router.post('/v1.0/demo', async (req, res) => { await demo.fnDemo(req, res) })

export default router
