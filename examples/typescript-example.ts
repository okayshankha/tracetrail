
import { TraceTrail } from '../src/index'
import express from 'express'

const app = express()
const port = 4444

const traceTrail = new TraceTrail('mongodb://192.168.0.100:27017/TraceTrail')

app.use('/tracetrail', traceTrail.UI())
app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
    res.json({ Hello: 'World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})