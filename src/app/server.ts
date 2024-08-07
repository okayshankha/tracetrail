import _ from 'lodash'
import path from 'path'
import cors from 'cors'
import crypto from 'crypto'
import { readFileSync } from 'fs'
import { Wrap } from '../core/utils'
import { spawn } from 'child_process'
import { Config } from '../core/config'
import express, { Request, Response } from 'express'
import { Paginator } from '../helpers/pagination.helper'
import JWTHelper, { IJwtHelperConstructorPayload } from '../helpers/jwt.helper'

interface IServerCreationPayload {
  LOGIN_PASSWORD?: string
  SALT_ROUNDS?: number
  KEY_LEN?: number
}

export type TServerCreationPayload = IServerCreationPayload &
  IJwtHelperConstructorPayload

const ITEMS_PER_PAGE = 50
const DEFAULT_SALT_ROUNDS = 12

export default function (params: TServerCreationPayload) {
  const {
    LOGIN_PASSWORD = '1234', // 1234 is the default password
    SECRET_KEY,
    JWT_EXPIRY_SECS,
    SALT_ROUNDS = DEFAULT_SALT_ROUNDS,
    KEY_LEN = 64,
  } = params

  const STORED_SALT = crypto.randomBytes(SALT_ROUNDS).toString('hex')
  const PASSWORD_HASH = crypto
    .scryptSync(LOGIN_PASSWORD, STORED_SALT, KEY_LEN)
    .toString('hex')

  const { version } = JSON.parse(
    readFileSync(
      path.resolve(__dirname, '../../') + '/package.json',
    ).toString(),
  )

  const jwtHelper = new JWTHelper({ SECRET_KEY, JWT_EXPIRY_SECS })

  const app = express()
  app.use(cors())
  app.use(express.json())

  app.post(
    '/api/sign-in',
    Wrap(async (req: Request, res: Response) => {
      const { password } = req.body ?? {}
      if (!password) {
        return res.status(400).json({
          message: 'Password is required, but not provided in request.',
        })
      }

      const isPasswordValid =
        crypto.scryptSync(password, STORED_SALT, KEY_LEN).toString('hex') ===
        PASSWORD_HASH

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid Password.',
        })
      }

      const token = jwtHelper.GenerateToken()

      // Issue JWT to the user
      return res.status(200).json({
        message: 'Login Successful.',
        token,
      })
    }),
  )

  app.get(
    '/api/requests',
    Wrap(async (req: Request, res: Response) => {
      const bearerToken = req.headers.authorization
      if (!bearerToken) {
        return res.status(401).json({
          message: 'Unauthorized.',
        })
      }
      const token = bearerToken.split(' ')[1]
      const jwtPayload = jwtHelper.VerifyToken(token)

      if (jwtPayload === null) {
        return res.status(401).json({
          message: 'Unauthorized.',
        })
      }

      const { startIndex = 0, itemsPerPage = ITEMS_PER_PAGE } = req.query

      delete req.query.startIndex
      delete req.query.itemsPerPage

      const result = await Paginator.Paginate({
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
    }),
  )

  // Handle requests to the sub-route
  if (Config.TRACETRAIL_ENV === 'DEV') {
    const PORT = Config.PORT
    const REACT_APP_PORT = Config.REACT_APP_PORT || PORT + 1

    const reactAppHandle = spawn('bash', [
      '-c',
      `cd ./react-ui && cross-env BROWSER=none REACT_APP_API_BASE_URL=http://localhost:${PORT}/tracetrail/ PORT=${REACT_APP_PORT} npm start`,
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
      res.redirect('http://localhost:' + REACT_APP_PORT),
    )
  } else {
    app.use(express.static(path.join(__dirname, '../../ui')))

    // Handle requests to the sub-route
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../ui', 'index.html'))
    })
  }

  return app
}
