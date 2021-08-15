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
    // Server
    HOST: process.env.APP_HOST || '127.0.0.1',
    PORT: process.env.APP_PORT || 7070,
    // MONGO
    MONGO_URI: process.env.MONGO_URI || 'mongodb://root:bandmanager@localhost:27017',
    // JWT
    SECRET: process.env.APP_SECRET || 'DEV',
    EXPIRATION: process.env.APP_EXPIRATION || '3d'
  },
  development: {},
  production: {
    PORT: process.env.APP_PORT || 7071
  },
  test: {
    port: 7072
  }
}

const options = { ...configs.base, ...configs[env] }

export { options }
