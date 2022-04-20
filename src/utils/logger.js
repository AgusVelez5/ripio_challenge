const winston = require('winston')
const path = require('path')
const { LOGS_PATH, DEVELOPMENT } = require('./env')

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: path.join(LOGS_PATH, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(LOGS_PATH, 'combined.log'), level: 'info' }),
    ]
})

logger.error = err => {
  if (err instanceof Error) {
    logger.log({ level: 'error', message: `${err.stack || err}` })
  } else {
    logger.log({ level: 'error', message: err })
  }
}

if (DEVELOPMENT) {
  const myFormatter = winston.format((info) => {
    const {message} = info
  
    if (info.data) {
      info.message = `${message} ${JSON.stringify(info.data)}`
      delete info.data
    }
    
    return info
  })()

  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      myFormatter,
      winston.format.simple(),
    ),
  }))
}

exports.logger = logger