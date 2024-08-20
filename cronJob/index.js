import cron from 'node-cron'
import logger from '../logger/index.js'

export const cronJob = () => {
  try {
    // Use the schedule method from node-cron
    // * * * * * * - every second
    // * * * * * -  every one minute
    const createEvent = cron.schedule('*/5 * * * *', () => {
      logger.info('Running cron job every 5 minutes')
    })

    // No need to call start() as schedule already starts the job by default
    logger.info('Cron job started successfully')
  } catch (error) {
    logger.error(`Error while running cron job :: ${error}`)
  }
}

// CronJob.schedule('*/5 * * * *', () => {
//   logger.info('Running cron job every 5 minutes')
//   // Your code to be executed every 5 minutes goes here
// })
