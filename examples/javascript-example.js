
const { TraceTrail } = require('../dist')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 4444

const traceTrail = new TraceTrail(
  process.env.TRACETRAIL_DB_URL || 'mongodb://localhost:27017/TraceTrail',
  {
    AUTO_CLEAN_RECORDS_OLDER_THAN: 10,          // Optional [Default: 60]
    AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT: 'days'  // Optional [Default: days]
  }
)

app.use(cors())
app.use(
  '/tracetrail',
  traceTrail.UI({
    LOGIN_PASSWORD: '1234',                      // Optional [Default: 1234]
    // SALT_ROUNDS: 10,                          // Optional [Default: 12]
    // SECRET_KEY: Config.SECRET_KEY as string,  // Optional [Default: Auto]
    // JWT_EXPIRY_SECS: 60 * 60 * 24,            // Optional [Default: 1 day]
  }),
)

app.use(traceTrail.MiddleWare)


app.get('/', (req, res) => {
  res.json({ Hello: 'World!' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})