// Import required modules
import 'newrelic'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
// import * as swaggerDocument from './swagger.json'
import pulsarClient from './pulsar/client/index.js'
import { consumerInit } from './pulsar/consumer/index.js'
import routes from './routes/index.js'
import logger from './logger/index.js'
import { cronJob } from './cronJob/index.js'

// Initialize Express app
export const app = express()

// Parse request body
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Welcome route
app.get('/snapshot-extractor/welcome', function (req, res) {
  res.json({ message: 'Welcome to snapshot extractor service API!' })
})

//Logger Middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url })
  next()
})

// Swagger documentation route
// app.use(
//   '/snapshot-extractor/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument)
// )

// API routes
app.use('/snapshot-extractor', routes)

// 404 route
app.use((req, res, next) => {
  res.status(404).json({ error: 'Page Not found' })
})

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err, 'Internal Server Error')
  const errStatus = err.statusCode || 500
  const errMsg = err.message || ' INTERNAL SERVER ERROR!'
  let output = {
    errStatus,
    errMsg,
  }
  res.status(errStatus).json(output)
})

// Initialize Pulsar consumers
try {
  consumerInit()
  logger.info('Successfully Initiated Consumer')
} catch (error) {
  logger.error('Error while initiating Consumer', error)
}

// Start the server
const server = app.listen(process.env.PORT, function () {
  logger.info('Application started on port : ' + process.env.PORT)
})

cronJob() // cron job

// Gracefully shutdown on SIGINT signal
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Shutting down gracefully...')
  logger.info('Closing consumer connection')
  await pulsarClient.close()

  // Close the server
  new Promise((resolve) => {
    server.close(async () => {
      logger.info('Server closed.')
      // Close MySQL connections
      resolve()
    })
  }).then(() => process.exit(0))
})
