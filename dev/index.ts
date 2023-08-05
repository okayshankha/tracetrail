import Express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { TraceTrail } from '../src/index'
import { Logger } from '../src/core/logger'

const app = Express()

const dbUrl = process.env.DB_URL
const saltRounds = parseInt(process.env.SALT_ROUNDS as string)
if (!dbUrl) {
  throw new Error('Database connection URL missing in `.env`')
}
const traceTrail = new TraceTrail(dbUrl)
// Get the UI
app.use(
  '/tracetrail',
  traceTrail.UI({
    SALT_ROUNDS: !Number.isNaN(saltRounds) ? saltRounds : undefined,
    LOGIN_PASSWORD: process.env.LOGIN_PASSWORD as string,
    PVT_KEY_SECRET: process.env.PVT_KEY_SECRET as string,
    JWT_EXPIRY_SECS: 60 * 60 * 24, // 1 day
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

app.listen(process.env.PORT, () => {
  Logger.info(`Server listening on port ${process.env.PORT}`)
})
