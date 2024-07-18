import business from './business/business.js'

const Main = {
  async fnDemo(req, res) {
    try {
      const result = await business.bfnDemo(req, res)
      res.success(result)
    } catch (error) {
      res.error(error.message, error.status)
    }
  }
}

export default Main