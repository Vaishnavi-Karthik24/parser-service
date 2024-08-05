const Client = require('mysql2')
const logger = require('../logger')
const config = require('config')

logger.info('Getting db configuration')

const dbConfig = JSON.parse(process.env.mdbConfig)

logger.info('Creating db connection pool')

const pool = Client.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.db,
  dateStrings: true,
  connectionLimit: 10,
  multipleStatements: true,
  connectTimeout: 60 * 60 * 1000,
  connectAttributes: {
    appName: 'snapshot-extractor-service',
  },
})
module.exports = pool
