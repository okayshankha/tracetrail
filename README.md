# Tracetrail

Introducing "Tracetrail" -  the npm package that streamlines the API debugging process. This package enables you to record the input and output payloads transferred to and from your client or server with ease.

Tracetrail makes it simple to find out what payload was transmitted by the client or received as a response from the server. This package is particularly created to assist you in more effectively debugging your APIs, making it a crucial tool for developers.

Payload Recorder is ideal for anybody working on a large-scale application or a basic project. It makes debugging easier, allowing you to rapidly detect and handle any problems that may develop. You can quickly navigate through the recorded payloads and receive insights into the performance of your API thanks to its user-friendly interface.


## Installation

``` bash
npm install tracetrail
```

## Usage

For regular javascript code
```javascript
const { TraceTrail } = require('tracetrail')
```

For CJS / Module Imports
```javascript
import { TraceTrail } from 'tracetrail' 
```

```javascript
import { TraceTrail } from 'tracetrail' 
import express from 'express'

const port = 4444
const app = express()

// You can use a separate database to keep things neat and clean.
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail', {
  AUTO_CLEAN_RECORDS_OLDER_THAN: 10,          // Optional [Default: 60]
  AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT: 'days'  // Optional [Default: days]
})

// You need to use traceTrail.MiddleWare to make this package work.
app.use(traceTrail.MiddleWare)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
```

## UI

To get the inbuilt UI you can easily code it like this.

![image](https://i.imgur.com/xtUuRCe.jpg)

``` javascript
import { TraceTrail } from 'tracetrail'
import express from 'express'

const port = 4444
const app = express()

// You can use a separate database to keep things neat and clean.
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail', {
  AUTO_CLEAN_RECORDS_OLDER_THAN: 10,          // Optional [Default: 60]
  AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT: 'days'  // Optional [Default: days]
})

// Get the UI
app.use(
  '/tracetrail',
  traceTrail.UI({
    LOGIN_PASSWORD: '1234',                      // Optional [Default: 1234]
    // SALT_ROUNDS: 10,                          // Optional [Default: 12]
    // SECRET_KEY: Config.SECRET_KEY as string,  // Optional [Default: Auto]
    // JWT_EXPIRY_SECS: 60 * 60 * 24,            // Optional [Default: 1 day]
  }),
)

// You need to use traceTrail.MiddleWare to make this package work.
app.use(traceTrail.MiddleWare)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
```


## Developers Guide

If you want to set up the project in your local follow these steps:

- Terminal #1
  - Clone the repository
  - Run following command ```npm i```
  - Create .env file and add the following bare minimum environment variables
    
    ```shell
    DB_URL=mongodb:/localhost:27017/TraceTrail
    PORT=7777
    TRACETRAIL_ENV=DEV
    ```

  - Now run ```npm run dev```
  - Go to the examples folder and pick any file of your choice JavaScript one or TypeScript one.
  - Make sure to update the MongoDB url.
---

That's it, you are all set. Now you can open your browser and open ```http//:localhost:7777/tracetrail``` it will open TraceTrail UI.

If you haven't changed any ports, then the following would be true.
- Backend Server: ```http//:localhost:7777```
- React Front End: ```http//:localhost:7778```

---

# Future Scope
- [done] - Login page for access authorization
- Write test cases
- [on-hold] - Socket.io implementation for real-time data fetch
- [on-hold] - Support multiple databases
