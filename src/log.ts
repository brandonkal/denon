import {
  setColorEnabled,
  log,
  reset,
  LogRecord,
  LogLevelName,
} from "../deps.ts";

import { DenonConfig } from "./config.ts";

/**
 * Logger tag
 */
const TAG = "[denon]";

const DEBUG_LEVEL = "DEBUG";
const QUIET_LEVEL = "ERROR";
const DEFAULT_LEVEL = "INFO";

const DEFAULT_HANDLER = "format_fn";

/**
 * Deno logger, but slightly better.
 * @param logRecord passed by Deno, contains logging info
 */
const formatter = (logRecord: LogRecord) => {
  let msg = `${TAG} ${reset(logRecord.msg)}`;
  logRecord.args.forEach((arg: any) => {
    if (arg instanceof Object) {
      msg += ` ${JSON.stringify(arg)}`;
    } else {
      msg += ` ${String(arg)}`;
    }
  });
  return msg;
};

const logLevel = (config: DenonConfig): LogLevelName => {
  let level: LogLevelName = DEFAULT_LEVEL;
  if (config.debug) level = DEBUG_LEVEL;
  if (config.quiet) level = QUIET_LEVEL;
  return level;
};

/**
 * Modify default deno logger.
 * @param config denom config
 */
export const setupLog = async (config: DenonConfig) => {
  setColorEnabled(true);

  await log.setup({
    handlers: {
      [DEFAULT_HANDLER]: new log.handlers.ConsoleHandler(
        DEBUG_LEVEL,
        { formatter },
      ),
    },
    loggers: {
      default: {
        level: logLevel(config),
        handlers: [DEFAULT_HANDLER],
      },
    },
  });
};
