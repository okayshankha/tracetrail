
const { TraceTrail } = require('../dist')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 4444

const traceTrail = new TraceTrail('mongodb://192.168.0.100:27017/TraceTrail')

app.use(cors())
app.use('/tracetrail', traceTrail.UI())

// Following is an alternate way to configure your tracetrail
/*
    app.use(
      '/tracetrail',
      traceTrail.UI({
        SALT_ROUNDS: 12,
        LOGIN_PASSWORD: "LOGIN_PASSWORD_OF_YOUR_CHOICE",
        SECRET_KEY: "SECRET_KEY_OF_YOUR_CHOICE",
        JWT_EXPIRY_SECS: 60 * 60 * 24, // 1 day
      }),
    )
*/

app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
    res.json({ Hello: 'World!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})