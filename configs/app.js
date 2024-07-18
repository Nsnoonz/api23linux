import dotenv from 'dotenv'

dotenv.config()

export const environment = process.env.NODE_ENV || 'develop'
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelop = process.env.NODE_ENV === 'develop'
export const isTest = process.env.NODE_ENV === 'test'
export const port = process.env.PORT || 4600