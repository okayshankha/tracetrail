import Express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const Config = {
  DB_URL: process.env.DB_URL,
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  PORT: process.env.PORT,
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
const traceTrail = new TraceTrail(DB_URL)
// Get the UI
/*
    app.use(
      '/tracetrail',
      traceTrail.UI({
        SALT_ROUNDS: !Number.isNaN(saltRounds) ? saltRounds : 10,
        LOGIN_PASSWORD: Config.LOGIN_PASSWORD as string,
        SECRET_KEY: Config.SECRET_KEY as string,
        JWT_EXPIRY_SECS: 60 * 60 * 24, // 1 day
      }),
    )
*/
app.use('/tracetrail', traceTrail.UI())

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
