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

const port = 4444
const app = express()

// You can use a separate database to keep things neat and clean.
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail')

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
const traceTrail = new TraceTrail('mongodb://localhost:27017/TraceTrail')

// Get the UI
app.use('/tracetrail', traceTrail.UI())

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
