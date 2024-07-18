import business from './business/business.js'

const Main = {
  async fnSendLineNotify (req, res) {
    try {
      const params = req.body
      const result = await business.bfnSendLineNotify(params)
      res.success(result)
    } catch (error) {
      res.error(error.message, error.status)
    }
  },
  async fnLeavenNotify (req, res) {
    try {
      const params = req.body
      const result = await business.bfnSendLine1on1(params)
      res.success(result)
    } catch (error) {
      res.error(error.message, error.status)
    }
  }
}

export default Main
