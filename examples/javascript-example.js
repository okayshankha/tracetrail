
const { TraceTrail } = require('../dist/index')
const express = require('express')

const app = express()
const port = 3000

const traceTrail = new TraceTrail('mongodb://192.168.0.100:27017/TraceTrail')

app.use('/tracetrail', traceTrail.UI())
app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
    res.json({ Hello: 'World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})