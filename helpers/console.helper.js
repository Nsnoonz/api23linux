import dotenv from 'dotenv'

dotenv.config()

const log = (body) => {
  if (process.env.isProduction !== 'production') {
    console.log(body)
  }
}

export default { log }
