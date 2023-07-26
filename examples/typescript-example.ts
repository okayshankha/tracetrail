import cors from 'cors'
import { TraceTrail } from '../src'
import express from 'express'
import { Logger } from '../src/core/logger'

const app = express()
const port = 4444

const traceTrail = new TraceTrail('mongodb://192.168.0.100:27017/TraceTrail')

app.use(cors())
app.use('/tracetrail', traceTrail.UI())
app.use(traceTrail.MiddleWare)

app.get('/*', (req, res) => {
  res.json({ Hello: 'World!' + Date.now() })
})

app.listen(port, () => {
  Logger.info(`Example app listening on port ${port}`)
})
