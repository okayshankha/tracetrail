declare namespace Express {
  export interface Response {
    __tracetrail_json: CallableFunction
    __tracetrail_started_at: Date
    __tracetrail_requestOverview: any
  }
}
