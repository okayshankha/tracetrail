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

![image](https://i.imgur.com/YlfNMzF.jpeg)

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
  - Now run ```npm run build```
  - Go to the examples folder and pick any file of your choice JavaScript one or TypeScript one.
  - Update the MongoDB url.
  - Then open a terminal in the root directory.
  - To run the Server written in JavaScript run ```npm run example:js``` 
  - Or to run the Server written in TypeScript run ```npm run example:ts```

---

- Terminal #2
  - Run ```cd react-ui && npm start``` it will start the React App in development mode.
  - Now you will find one find inside react-ui ```.env.development.local``` modify the value of ```REACT_APP_API_BASE_URL``` only if you have changed the server port in ```examples/javascript-example.js``` or ```examples/typescript-example.ts```. 
  - If you are not sure leave ```REACT_APP_API_BASE_URL``` as it is.


---

That's it, you are all set. Now you can open your browser and open ```http//:localhost:3000``` it will open TraceTrail UI.

If you haven't changed any ports, then the following would be true.
- Backend Server: ```http//:localhost:4444```
- React Front End: ```http//:localhost:3000```

---

# Future Scope
- Login page for access authorization
- Socket.io implementation for real-time data fetch
- Support multiple databases
- Write test cases
