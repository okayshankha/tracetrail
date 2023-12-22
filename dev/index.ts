import Express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const Config = {
  DB_URL: process.env.TRACETRAIL_DB_URL,
  LOGIN_PASSWORD: process.env.TRACETRAIL_LOGIN_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT || 7777,
}

import { TraceTrail } from '../src/index'
import { Logger } from '../src/core/logger'
import cors from 'cors'

const app = Express()
app.use(cors())

const DB_URL = Config.DB_URL
if (!DB_URL) {
  throw new Error('Database connection URL missing in `.env`')
}
const traceTrail = new TraceTrail(DB_URL, {
  AUTO_CLEAN_RECORDS_OLDER_THAN: 10, // Optional [Default: 60]
  AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT: 'days', // Optional [Default: days]
})

// Get the UI
app.use(
  '/tracetrail',
  traceTrail.UI({
    LOGIN_PASSWORD: Config.LOGIN_PASSWORD as string, // Optional [Default: 1234]
    // SALT_ROUNDS: 10,                               // Optional [Default: 12]
    // SECRET_KEY: Config.SECRET_KEY as string,       // Optional [Default: Auto]
    // JWT_EXPIRY_SECS: 60 * 60 * 24,                 // Optional [Default: 1 day ]
  }),
)

// You need to use traceTrail.MiddleWare to make this package work.
app.use(traceTrail.MiddleWare)

app.get('/ping', (_req, res) => {
  res.status(200).json({
    message: 'Success',
    statusCode: 200,
  })
})

app.listen(Config.PORT, () => {
  Logger.info(`Server listening on port ${Config.PORT}`)
})
