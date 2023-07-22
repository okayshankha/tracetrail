
const { TraceTrail } = require('../dist')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 4444

const traceTrail = new TraceTrail('mongodb://192.168.0.100:27017/TraceTrail')

app.use(cors())
app.use('/tracetrail', traceTrail.UI())
app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
    res.json({ Hello: 'World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})