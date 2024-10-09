import * as winston from "winston"

export class MyLogger {
  private context = "Global"
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp, context, status }) => {
          const statusInfo = status ? `[${status}]` : ""
          return `${timestamp} [${level}] [${context}] ${statusInfo} - ${message}`
        }),
      ),
      transports: [new winston.transports.Console()],
    })
  }

  setContext(context: string): void {
    this.context = context
  }

  private logMessage(level: string, message: any, optionalParams: any[], status?: string) {
    this.logger.log({
      level: level,
      message: message,
      context: this.context,
      status: status,
      optionalParams: optionalParams,
    })
  }

  log(message: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("info", message, optionalParams, status)
  }

  fatal(message: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("fatal", message, optionalParams, status)
  }

  error(error: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("error", error, optionalParams, status)
  }

  warn(message: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("warn", message, optionalParams, status)
  }

  debug(message: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("debug", message, optionalParams, status)
  }

  verbose(message: any, status?: string, ...optionalParams: any[]) {
    this.logMessage("verbose", message, optionalParams, status)
  }
}
