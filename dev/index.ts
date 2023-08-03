import Express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { TraceTrail } from '../src/index'
import { Logger } from '../src/core/logger'

const app = Express()

const dbUrl = process.env.DB_URL
if (!dbUrl) {
  throw new Error('Database connection URL missing in `.env`')
}
const traceTrail = new TraceTrail(dbUrl)
// Get the UI
app.use('/tracetrail', traceTrail.UI())

// You need to use traceTrail.MiddleWare to make this package work.
app.use(traceTrail.MiddleWare)

app.get('/ping', (_req, res) => {
  res.status(200).json({
    message: 'Success',
    statusCode: 200,
  })
})

app.listen(process.env.PORT, () => {
  Logger.info('Server listening on port', process.env.PORT)
})
