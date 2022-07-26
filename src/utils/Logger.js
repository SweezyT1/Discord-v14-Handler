import _pkg from 'winston';
import pkg from 'winston/lib/winston/transports/index.js';
import { inspect } from 'node:util';
import moment from 'moment'

const date = moment().format("DD/MM/YYYY HH:mm:ss");
const { createLogger, format } = _pkg;
const { Console, File } = pkg;

function loadWinstonLogger(logger, shardId = 'Manager') {
  logger
    .add(
      new Console({
        level: 'silly',
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf((info) => {
            const tags = info.tags?.map((t) => `\x1B[36m${t}\x1B[39m`).join(', ') ?? '';
            const shardPrefix = `[\x1B[36mShard ${shardId}\x1B[39m, ${tags}]:`;
            return `${date} ${shardPrefix} ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          }),
        ),
      }),
    )
    .add(
      new File({
        level: 'debug',
        filename: typeof shardId === 'number' ? `shard${shardId}.log` : 'manager.log',
        dirname: './logs',
        format: format.combine(
          format.timestamp(),
          format.uncolorize(),
          format.printf((info) => {
            const tags = info.tags?.map((t) => `\x1B[36m${t}\x1B[39m`).join(', ') ?? '';
            return `${date} [Shard ${shardId}, ${tags}]: ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          }),
        ),
      }),
    );
}

function createWinstonLogger(options, client) {
  const logger = createLogger({
    handleExceptions: options?.handleExceptions ?? true,
    handleRejections: options?.handleRejections ?? true,
    exitOnError: false,
  });
  loadWinstonLogger(logger, client?.shard?.ids[0] ?? 'Manager');

  return logger;
}

export { createWinstonLogger, loadWinstonLogger };
