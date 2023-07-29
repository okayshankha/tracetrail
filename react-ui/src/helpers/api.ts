import _ from 'lodash'
import axios from 'axios'

export default async function Api(_params: {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  endpoint: string
  payload?: any
  headers?: any
  params?: any
}) {
  const ALLOWED_HEADERS = [
    'accept',
    'accept-language',
    'authorization',
    'cache-control',
    'content-type',
    'if-match',
    'if-modified-since',
    'if-none-match',
    'if-unmodified-since',
    'x-requested-with',
    'x-csrf-token',
  ]

  const {
    method = 'GET',
    endpoint,
    payload,
    headers = null,
    params = null,
  } = _params

  const effectiveHeaders: { [key: string]: string } = {}
  if (headers) {
    for (const key in headers) {
      if (ALLOWED_HEADERS.includes(key.toLowerCase())) {
        effectiveHeaders[key] = headers[key]
      }
    }
  }

  const response = await axios(
    _.omitBy(
      {
        referrerPolicy: '',
        headers: effectiveHeaders,
        method: method.toLocaleUpperCase(),
        url: endpoint,
        data: payload,
        params,
      },
      _.isNil,
    ),
  ).catch((e) => e.response)

  return response?.data
}
