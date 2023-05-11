# Tracetrail

Introducing "Tracetrail" -  the npm package that streamlines the API debugging process. This package enables you to record the input and output payloads transferred to and from your client or server with ease.

Tracetrail makes it simple to find out what payload was transmitted by the client or received as a response from the server. This package is particularly created to assist you in more effectively debugging your APIs, making it a crucial tool for developers.

Payload Recorder is ideal for anybody working on a large-scale application or a basic project. It makes debugging easier, allowing you to rapidly detect and handle any problems that may develop. You can quickly navigate through the recorded payloads and receive insights into the performance of your API thanks to its user-friendly interface.


## Installation

``` bash
npm install tracetrail
```

## Usage

```javascript
import { TraceTrail } from 'tracetrail'
import express from 'express'
const app = express()

// You can use a separate database to keep things neat and clean.
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail')

// You need to use traceTrail.MiddleWare to make this package working.
app.use(traceTrail.MiddleWare)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
```

## UI

In order to get the inbuilt UI you an easily code it like this.


``` javascript
import { TraceTrail } from 'tracetrail'
import express from 'express'
const app = express()

// You can use a separate database to keep things neat and clean.
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail')

// Get the UI
app.use('/tracetrail', traceTrail.UI())

// You need to use traceTrail.MiddleWare to make this package working.
app.use(traceTrail.MiddleWare)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
```




