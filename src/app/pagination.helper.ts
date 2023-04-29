import { Logger } from '../core/logger'

const ITEMS_PER_PAGE = 10

class PaginationHelperClass {
    async Paginate(inputs: {
        q?: string
        model: any
        populate?: any
        startIndex?: number
        itemsPerPage?: number
        query?: any
        sort?: any
        projection?: any
    }) {
        try {
            const {
                q,
                model,
                populate = null,
                startIndex = 1,
                itemsPerPage = ITEMS_PER_PAGE,
                query = {},
                sort = { _id: 1 },
                projection = {},
            } = inputs

            const Model = model

            const skipCount: number = startIndex > 0 ? startIndex - 1 : 0

            const perPage =
                itemsPerPage > 0 ? itemsPerPage : ITEMS_PER_PAGE

            // Wild card search will be handled by fuzzy-search helper
            if (q) {
                // Get wildcard search query
                const fuzzyQuery = { $text: { $search: q } }
                const fuzzyProjection = { confidence: { $meta: 'textScore' } }
                const fuzzySort = { confidence: { $meta: 'textScore' } }

                Object.assign(query, fuzzyQuery)
                Object.assign(projection, fuzzyProjection)
                Object.assign(sort, fuzzySort)
            }

            const totalItems = await Model.countDocuments(query)

            let items = []
            if (populate) {
                items = await Model.find(query, projection)
                    .skip(skipCount)
                    .limit(perPage)
                    .sort(sort)
                    .populate(populate)
                    .lean()
            } else {
                items = await Model.find(query, projection)
                    .skip(skipCount)
                    .limit(perPage)
                    .sort(sort)
                    .lean()
            }

            return {
                totalItems,
                startIndex: skipCount + 1,
                itemsPerPage: perPage,
                items,
            }
        } catch (error) {
            Logger.error(error)
        }

        // On Error Return Null
        return null
    }
}

// All Done
export const Paginator = new PaginationHelperClass()
