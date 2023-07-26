import { Connection, Document, Schema } from 'mongoose'

interface ITraceTrail extends Document {
  endpoint: string
  method: string
  statusCode: number
  timeTakenInMilliseconds: number
  input: {
    headers: any
    params: any
    query: any
    body: any
  }
  output: {
    headers: any
    body: any
  }
}

const schema: Schema = new Schema<ITraceTrail>(
  {
    endpoint: String,
    method: String,
    statusCode: Number,
    timeTakenInMilliseconds: Number,
    input: {
      headers: Schema.Types.Mixed,
      params: Schema.Types.Mixed,
      query: Schema.Types.Mixed,
      body: Schema.Types.Mixed,
    },
    output: {
      headers: Schema.Types.Mixed,
      body: Schema.Types.Mixed,
    },
  },
  {
    autoIndex: true,
    versionKey: false,
    timestamps: true,
  },
)

export default function (DB_CONNECTION: Connection) {
  return DB_CONNECTION.model('TraceTrail', schema, 'TraceTrail')
}
