import path from 'path'
import cors from 'cors'
import _ from 'lodash'
import express, { Request, Response } from 'express'
import { Paginator } from './pagination.helper'

const ITEMS_PER_PAGE = 50

export default function (params: any) {
  const { MONGO_MODEL } = params

  const app = express()
  app.use(cors())

  app.use(express.static(path.join(__dirname, '../../ui')))

  // Handle requests to the sub-route
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../ui', 'index.html'))
  })

  app.get('/api/requests', async (req: Request, res: Response) => {
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
      ...result,
    })
  })

  return app
}
