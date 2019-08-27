import winston from 'winston';

const {
  cli, combine, timestamp,
} = winston.format;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: combine(
    cli(),
    timestamp(),
  ),
});

export default logger;
