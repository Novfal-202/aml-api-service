import { get, isEqual } from 'lodash';
import path from 'path';
import { Logger, createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { appConfiguration } from '../config/index';

const { log, applicationEnv } = appConfiguration;

const { day, isEnable, name, size, zippedArchive } = log;

// Define a function to enumerate error formats
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: get(info, 'stack') });
  }

  return info;
});

const logLevel = isEqual(applicationEnv, 'development') ? 'debug' : 'info';

// Define log format for transport
const logFormat = format.combine(
  enumerateErrorFormat(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.splat(),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
);

// Create an empty array for transports
const loggerTransports = [];

// Push the console transport
loggerTransports.push(
  new transports.Console({
    stderrLevels: ['error'],
    format: format.combine(isEqual(applicationEnv, 'development') ? format.colorize() : format.uncolorize(), logFormat),
  }),
);

// Conditionally push the file transport if isEnable is true
if (isEnable) {
  loggerTransports.push(
    new DailyRotateFile({
      filename: path.join(__dirname, `../logs/${name}`),
      zippedArchive, // A boolean to define whether or not to gzip archived log files
      maxSize: size, // Adjust the maximum log file size
      maxFiles: day, // Adjust the maximum number of log files to retain
    }),
  );
}

// Create a Winston logger instance
const logger: Logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: loggerTransports,
});

export default logger;
