export const Config = {
  TRACETRAIL_ENV: process.env.TRACETRAIL_ENV || 'PROD',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 7777,
  REACT_APP_PORT: process.env.REACT_APP_PORT
    ? parseInt(process.env.REACT_APP_PORT)
    : undefined,
}
