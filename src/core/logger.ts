import winston from 'winston'

const WINSTON_FORMAT = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.label({ label: '' }),
    winston.format.printf(
        log => `[TraceTrail] - ${log.message} ${log.stack ?? ''}`
    )
)

export const Logger = winston.createLogger({
    exitOnError: false,
    format: WINSTON_FORMAT,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize({ all: true })),
            level: 'info',
        }),
    ].filter((e) => e != undefined),
})
