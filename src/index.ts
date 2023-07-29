import { Request, Response, NextFunction } from 'express'
import OnFinished from 'on-finished'
import TrailTraceModel from './models/trace.model'
import mongoose from 'mongoose'
import { Logger } from './core/logger'
import server from './app/server'
import Dayjs from 'dayjs'
import { JSONObject } from './@types/json'

const S = (payload: any) => JSON.parse(JSON.stringify(payload))

let MONGO_MODEL: mongoose.Model<JSONObject>

export class TraceTrail {
  constructor(
    DB_CONNECTION_STRING: string,
    DB_CONNECTION_OPTIONS: JSONObject = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  ) {
    if (!MONGO_MODEL) {
      const MONGO_CONN = mongoose.createConnection(
        DB_CONNECTION_STRING,
        DB_CONNECTION_OPTIONS,
      )
      MONGO_MODEL = TrailTraceModel(MONGO_CONN)
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

  UI() {
    return server({
      MONGO_MODEL,
    })
  }
}
