import path from 'path'
import cors from 'cors'
import _ from 'lodash'
import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Paginator } from './pagination.helper'
import { readFileSync } from 'fs'
import { spawn } from 'child_process'
import mongoose from 'mongoose'
import { JSONObject } from '../@types/json'
import JWTHelper, { IJWTHelperConstructorP } from './jwt.helper'

interface IServerCreationP {
  MONGO_MODEL: mongoose.Model<JSONObject>
  LOGIN_PASSWORD: string
  SALT_ROUNDS?: number
}

export type TServerCreationP = IServerCreationP & IJWTHelperConstructorP

const ITEMS_PER_PAGE = 50
const DEFAULT_SALT_ROUNDS = 12

export default function (params: TServerCreationP) {
  const {
    MONGO_MODEL,
    LOGIN_PASSWORD,
    PVT_KEY_SECRET,
    JWT_EXPIRY_SECS,
    SALT_ROUNDS = DEFAULT_SALT_ROUNDS,
  } = params
  const PASSWORD_HASH = bcrypt.hashSync(LOGIN_PASSWORD, SALT_ROUNDS)

  const { version } = JSON.parse(
    readFileSync(
      path.resolve(__dirname, '../../') + '/package.json',
    ).toString(),
  )

  const jwtHelper = new JWTHelper({ PVT_KEY_SECRET, JWT_EXPIRY_SECS })

  const app = express()
  app.use(cors())

  /* app.use(express.static(path.join(__dirname, '../../ui'))) */

  app.post('/sign-in', async (req: Request, res: Response) => {
    const { password } = req.body ?? {}
    if (!password) {
      return res.status(400).json({
        message: 'Password is required, but not provided in request.',
        hasError: true,
      })
    }

    const isPasswordValid = await bcrypt.compare(password, PASSWORD_HASH)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid Password.',
        hasError: true,
      })
    }

    const token = jwtHelper.GenerateToken()

    // Issue JWT to the user
    return res.status(200).json({
      message: 'Login Successful.',
      token,
    })
  })

  app.get('/api/requests', async (req: Request, res: Response) => {
    const bearerToken = req.headers.authorization
    if (!bearerToken) {
      return res.status(401).json({
        message: 'Unauthorized.',
        hasError: true,
      })
    }
    const token = bearerToken.split(' ')[1]
    const jwtPayload = jwtHelper.VerifyToken(token)

    if (jwtPayload === null) {
      return res.status(401).json({
        message: 'Unauthorized.',
        hasError: true,
      })
    }

    const { startIndex = 0, itemsPerPage = ITEMS_PER_PAGE } = req.query

    delete req.query.startIndex
    delete req.query.itemsPerPage

    const result = await Paginator.Paginate({
      model: MONGO_MODEL,
      query: _.omitBy(req.query, _.isNil),
      startIndex: +startIndex,
      itemsPerPage: +itemsPerPage,
      sort: {
        _id: -1,
      },
    })

    return res.json({
      message: 'Requests fetched successfully.',
      version,
      ...result,
    })
  })

  // Handle requests to the sub-route
  if (process.env.TRACETRAIL_ENV === 'DEV') {
    const DEFAULT_REACT_APP_PORT = 3000
    const reactAppPort =
      process.env.REACT_APP_PORT ?? `${DEFAULT_REACT_APP_PORT}`
    const reactAppHandle = spawn('bash', [
      '-c',
      `cd ./react-ui && PORT=${reactAppPort} npm start`,
    ])
    reactAppHandle.stderr.pipe(process.stderr)
    reactAppHandle.stdout.pipe(process.stdout)
    reactAppHandle.on('exit', (code) => {
      throw new Error('REACT APP exited with code ' + code)
    })
    process.on('exit', () => {
      reactAppHandle.kill()
    })
    app.use('/', (_req, res) =>
      res.redirect('http://localhost:' + reactAppPort),
    )
  } else {
    app.get('/', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../ui', 'index.html'))
    })
  }

  return app
}
