import * as expressWinston from "express-winston"
import * as winston from "winston"

const consoleTransport = new winston.transports.Console()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.cli(),
  transports: [consoleTransport],
})

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "HTTP {{req.method}} {{req.url}}",
  meta: false,
  expressFormat: true,
  colorize: true,
})

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
})

export { logger, requestLogger, errorLogger }
