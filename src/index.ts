import Dayjs from 'dayjs'
import Agenda from 'agenda'
import mongoose from 'mongoose'
import OnFinished from 'on-finished'
import { Logger } from './core/logger'
import { JSONObject } from './@types/json'
import TrailTraceModel from './models/trace.model'
import { Request, Response, NextFunction } from 'express'
import { MongoMemoryServer } from 'mongodb-memory-server'
import server, { TServerCreationPayload } from './app/server'

// const events = require('events')
// events.defaultMaxListeners = 30

const S = (payload: any) => JSON.parse(JSON.stringify(payload))

let MONGO_MODEL: mongoose.Model<JSONObject>

export function GetMongoModel() {
  return MONGO_MODEL
}

export class TraceTrail {
  #agenda: Agenda | any

  constructor(
    DB_CONNECTION_STRING?: string,
    OPTIONS: {
      DB_CONNECTION_OPTIONS?: JSONObject
      AUTO_CLEAN_RECORDS_OLDER_THAN?: number
      AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT?: Dayjs.ManipulateType
    } = {},
  ) {
    const {
      DB_CONNECTION_OPTIONS = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      AUTO_CLEAN_RECORDS_OLDER_THAN = 60,
      AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT = 'days',
    } = OPTIONS

    if (!MONGO_MODEL) {
      const fn = () => {
        const MONGO_CONN = mongoose.createConnection(
          DB_CONNECTION_STRING || '',
          DB_CONNECTION_OPTIONS,
        )
        MONGO_MODEL = TrailTraceModel(MONGO_CONN)

        if (AUTO_CLEAN_RECORDS_OLDER_THAN) {
          this.#agenda = new Agenda({
            db: {
              address: DB_CONNECTION_STRING || '',
              options: DB_CONNECTION_OPTIONS,
              collection: 'tracetrailJobs',
            },
          })
          this.#agenda.define('AUTO_CLEAN_RECORDS', async () => {
            await MONGO_MODEL.deleteMany({
              updatedAt: {
                $lt: Dayjs()
                  .subtract(
                    AUTO_CLEAN_RECORDS_OLDER_THAN,
                    AUTO_CLEAN_RECORDS_OLDER_THAN_UNIT,
                  )
                  .toDate(),
              },
            })
          })

          this.#agenda.start().then(() => {
            this.#agenda.every('24 hours', 'AUTO_CLEAN_RECORDS')
          })
        }
      }

      if (!DB_CONNECTION_STRING) {
        MongoMemoryServer.create({
          instance: {
            dbName: 'tracetrail',
          },
        }).then((mongod) => {
          DB_CONNECTION_STRING = mongod.getUri() + 'tracetrail'
          fn()
        })
      } else {
        fn()
      }
    }
  }

  MiddleWare(req: Request, res: Response, next: NextFunction) {
    res.__tracetrail_started_at = Dayjs().toDate()
    res.__tracetrail_json = res?.json
    res.json = function (payload: JSONObject) {
      this.__tracetrail_requestOverview = {
        endpoint: req.originalUrl.toString(),
        method: req.method.toString(),
        input: {
          headers: req.headers,
          query: req.query,
          body: req.body,
        },
        output: {
          headers: res.getHeaders(),
          body: payload,
        },
      }
      return res.__tracetrail_json(payload)
    }

    OnFinished(res, async function (error, res: Response) {
      try {
        if (error) {
          Logger.error(error)
          return
        }

        if (res.__tracetrail_requestOverview) {
          res.__tracetrail_requestOverview.statusCode = res.statusCode
          const timeTakenInMilliseconds = Dayjs().diff(
            res.__tracetrail_started_at,
            'milliseconds',
          )
          res.__tracetrail_requestOverview.timeTakenInMilliseconds =
            +timeTakenInMilliseconds
          await MONGO_MODEL.insertMany([S(res.__tracetrail_requestOverview)])
        }
      } catch (error) {
        Logger.error(error)
      }
    })

    next()
  }

  UI(params?: Omit<TServerCreationPayload, 'MONGO_MODEL'>) {
    // console.log('server => MONGO_MODEL', MONGO_MODEL)
    return server({
      ...params,
    })
  }
}
