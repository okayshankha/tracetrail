
import { TraceTrail } from 'tracetrail'
const express = require('express')

const app = express()
const port = 4444

const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail')

app.use('/tracetrail', traceTrail.UI())
app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
    res.json({ Hello: 'World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})