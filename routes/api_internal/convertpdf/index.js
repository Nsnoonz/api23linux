import express from 'express'
import convertpdf from '../../../controllers/convertpdf/v1.0/index.js'

const router = express.Router()

router.post('/v1.0/fnDemo', async (req, res) => { await convertpdf.fnDemo(req, res) })
router.post('/v1.0/fnConvertPDF', async (req, res) => { await convertpdf.fnConvertPDF(req, res) })

export default router
