import { appConfig } from "./app.config"

/**
 * Logger class
 */
class Logger {
  private isEnabled: boolean
  private minLevel: number

  constructor() {
    const isStagingOrDevelopment =
      appConfig.app.environment === "development" ||
      appConfig.app.environment === "staging"

    this.isEnabled = isStagingOrDevelopment
    this.minLevel = isStagingOrDevelopment ? 0 : 1 // DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3
  }

  private shouldLog(level: number): boolean {
    return this.isEnabled && level >= this.minLevel
  }

  private formatMessage(
    level: string,
    message: string,
    data?: unknown
  ): string {
    const timestamp = new Date().toISOString()
    const levelStr = `[${level}]`
    const timeStr = `[${timestamp}]`

    let formatted = `${timeStr} ${levelStr} ${message}`

    if (data !== undefined) {
      formatted += ` ${JSON.stringify(data, null, 2)}`
    }

    return formatted
  }

  private log(
    level: string,
    levelNum: number,
    message: string,
    data?: unknown
  ): void {
    if (!this.shouldLog(levelNum)) return

    const formatted = this.formatMessage(level, message, data)

    switch (level) {
      case "DEBUG":
        // eslint-disable-next-line no-console
        console.log(formatted)
        break
      case "INFO":
        // eslint-disable-next-line no-console
        console.log(formatted)
        break
      case "WARN":
        // eslint-disable-next-line no-console
        console.log(formatted)
        break
      case "ERROR":
        // eslint-disable-next-line no-console
        console.error(formatted)
        break
    }
  }

  debug(message: string, data?: unknown): void {
    this.log("DEBUG", 0, message, data)
  }

  info(message: string, data?: unknown): void {
    this.log("INFO", 1, message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log("WARN", 2, message, data)
  }

  error(message: string, data?: unknown): void {
    this.log("ERROR", 3, message, data)
  }

  // Convenience methods
  api(message: string, data?: unknown): void {
    this.debug(`API: ${message}`, data)
  }

  perf(operation: string, duration: number, data?: unknown): void {
    this.debug(`PERF: ${operation} took ${duration}ms`, data)
  }
}

/**
 * Singleton logger instance
 *
 * import { log } from '@/lib/config'
 * log.info('App started')
 * log.debug('Debug info', { userId: 123 })
 * log.api('GET /api/users')
 */
export const logger = new Logger()
