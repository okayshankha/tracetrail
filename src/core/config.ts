export const Config = {
  TRACETRAIL_ENV: process.env.TRACETRAIL_ENV || 'PROD',
  REACT_APP_PORT: process.env.REACT_APP_PORT
    ? parseInt(process.env.REACT_APP_PORT)
    : 3535,
}
