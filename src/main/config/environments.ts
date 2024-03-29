// Dependencies
import { config } from 'dotenv'

config()

const defaultEnv = 'development'

const env = process.env.NODE_ENV || defaultEnv

const configs = {
  base: {
    ENV: env,
    DEV: env === defaultEnv,
    // General
    NAME: process.env.APP_NAME || 'AppName',
    TITLE: process.env.APP_TITLE || 'AppTitle',
    DESCRIPTION: process.env.APP_DESCRIPTION || 'AppDescription',
    // API
    PREFIX: process.env.APP_PREFIX || 'v1',
    API_EXPLORER_PATH: process.env.APP_API_EXPLORER_PATH || '/api',
    // BROWSERLESS
    BROWSERLESS_KEY: process.env.BROWSERLESS_KEY || '',
    // Server
    HOST: process.env.APP_HOST || '127.0.0.1',
    PORT: process.env.PORT || process.env.APP_PORT || 8080,
    // MONGO
    MONGO_URI: process.env.MONGO_URI || 'mongodb://root:bandmanager@localhost:27017',
    // JWT
    SECRET: process.env.APP_SECRET || 'DEV',
    EXPIRATION: process.env.APP_EXPIRATION || '90d',
    // SENDGRID SERVICES
    SENDGRID_SENDER: process.env.SENDGRID_SENDER || '',
    SENDGRID_KEY: process.env.SENDGRID_KEY || '',
    // INTEGRATIONS
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    // CHAT GPT
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY || ''
  },
  development: {},
  production: {
    PORT: process.env.PORT || process.env.APP_PORT || 8080
  },
  test: {
    port: 3001
  }
}

const options = { ...configs.base, ...configs[env] }

export { options }
