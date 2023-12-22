import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import { TraceTrail } from '../src'
import express from 'express'
import { Logger } from '../src/core/logger'

const app = express()
const port = 4444

const traceTrail = new TraceTrail(
  process.env.TRACETRAIL_DB_URL || 'mongodb://localhost:27017/TraceTrail',
  {
    AUTO_CLEAN_RECORDS_OLDER_THAN: 10, // Optional [Default: 60]
    AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT: 'days', // Optional [Default: days]
  },
)

app.use(cors())
app.use(
  '/tracetrail',
  traceTrail.UI({
    LOGIN_PASSWORD: '1234', // Optional [Default: 1234]
    // SALT_ROUNDS: 10,                          // Optional [Default: 12]
    // SECRET_KEY: Config.SECRET_KEY as string,  // Optional [Default: Auto]
    // JWT_EXPIRY_SECS: 60 * 60 * 24,            // Optional [Default: 1 day]
  }),
)

// Following is an alternate way to configure your tracetrail
/*
    app.use(
      '/tracetrail',
      traceTrail.UI({
        SALT_ROUNDS: 12,
        LOGIN_PASSWORD: "LOGIN_PASSWORD_OF_YOUR_CHOICE or set process.env.TRACETRAIL_LOGIN_PASSWORD",
        SECRET_KEY: "SECRET_KEY_OF_YOUR_CHOICE",
        JWT_EXPIRY_SECS: 60 * 60 * 24, // 1 day
      }),
    )
*/

app.use(traceTrail.MiddleWare)

app.get('/*', (req, res) => {
  res.json({ Hello: 'World!' + Date.now() })
})

app.listen(port, () => {
  Logger.info(`Example app listening on port ${port}`)
})
