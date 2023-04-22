import { Request, Response, NextFunction } from 'express'
import OnFinished from 'on-finished'
import TrailTraceModel from './models/trace.model';
import mongoose from 'mongoose';
import { Logger } from './core/logger';
import server from './app/server'


let MONGO_MODEL: mongoose.Model<{ [key: string]: string }>

export class TraceTrail {

    constructor(
        DB_CONNECTION_STRING: string,
        DB_CONNECTION_OPTIONS: { [key: string]: any } = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ) {
        if (!MONGO_MODEL) {
            const MONGO_CONN = mongoose.createConnection(DB_CONNECTION_STRING, DB_CONNECTION_OPTIONS)
            MONGO_MODEL = TrailTraceModel(MONGO_CONN)
        }
    }

    MiddleWare(req: Request, res: Response, next: NextFunction) {

        res.__json = res?.json
        res.json = function (payload: { [key: string]: any }) {
            this.__requestOverview = {
                input: {
                    method: req.method,
                    headers: req.headers,
                    params: req.params,
                    query: req.query,
                    body: req.body,
                },
                output: {
                    headers: res.getHeaders(),
                    body: payload,
                }
            }
            return res.__json(payload)
        }

        OnFinished(res, async function (error, res: Response) {
            try {
                if (error) {
                    Logger.error(error)
                    return
                }

                if (res.__requestOverview) {
                    await MONGO_MODEL.create(res.__requestOverview)
                }

            } catch (error) {
                Logger.error(error)
            }
        })

        next()
    }

    UI() {
        return server
    }
}