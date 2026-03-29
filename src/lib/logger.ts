/**
 * Утилита логгирования для проекта
 * Автоматически отключает логи в production
 */

const isDev = process.env.NODE_ENV === "development"

type LogLevel = "log" | "warn" | "error" | "info" | "debug"

interface Logger {
  log: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

/**
 * Префикс для логов
 */
const PREFIX = "[Quantum Horizon]"

/**
 * Создает префикс для конкретного модуля
 */
function createModulePrefix(module: string): string {
  return `${PREFIX} ${module}:`
}

/**
 * Базовый логгер
 */
const baseLogger: Logger = {
  log: (...args: unknown[]) => {
    console.log(PREFIX, ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(PREFIX, "⚠️", ...args)
  },
  error: (...args: unknown[]) => {
    console.error(PREFIX, "❌", ...args)
  },
  info: (...args: unknown[]) => {
    console.info(PREFIX, "ℹ️", ...args)
  },
  debug: (...args: unknown[]) => {
    console.debug(PREFIX, "🔍", ...args)
  },
}

/**
 * Production логгер (отключает всё кроме error)
 */
const productionLogger: Logger = {
  log: () => undefined,
  warn: () => undefined,
  error: (...args: unknown[]) => {
    console.error(PREFIX, "❌", ...args)
  },
  info: () => undefined,
  debug: () => undefined,
}

/**
 * Основной экспортируемый логгер
 */
export const logger = isDev ? baseLogger : productionLogger

/**
 * Создает логгер для конкретного модуля
 * @param module - имя модуля
 * @returns объект с методами логгирования
 */
export function createLogger(module: string): Logger {
  const prefix = createModulePrefix(module)

  const devLogger: Logger = {
    log: (...args: unknown[]) => {
      console.log(prefix, ...args)
    },
    warn: (...args: unknown[]) => {
      console.warn(prefix, "⚠️", ...args)
    },
    error: (...args: unknown[]) => {
      console.error(prefix, "❌", ...args)
    },
    info: (...args: unknown[]) => {
      console.info(prefix, "ℹ️", ...args)
    },
    debug: (...args: unknown[]) => {
      console.debug(prefix, "🔍", ...args)
    },
  }

  const prodLogger: Logger = {
    log: () => undefined,
    warn: () => undefined,
    error: (...args: unknown[]) => {
      console.error(prefix, "❌", ...args)
    },
    info: () => undefined,
    debug: () => undefined,
  }

  return isDev ? devLogger : prodLogger
}

export type { Logger, LogLevel }
