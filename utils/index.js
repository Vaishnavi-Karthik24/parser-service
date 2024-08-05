import moment from 'moment-timezone'
import { exec } from 'child_process'
import util from 'util'
import { promises as fs } from 'fs'
import logger from '../logger/index.js'

export const executeCMD = async (cmd) => {
  try {
    logger.info(`Entered :: executeCMD ${cmd}`)
    const execPromise = util.promisify(exec)
    const { error, stdout, stderr } = await execPromise(cmd)
    logger.info(stdout.trim())
    if (error) {
      logger.error(`ERROR :: executeCMD:: ${error}`)
      // throw error;
    }
    if (stderr) {
      logger.error(`STDERR :: executeCMD:: ${stderr}`)
      // throw new Error(stderr);
    }
    logger.info(`SUCCESS :: executeCMD: ${cmd}`)
    console.log(`stdout: ${stdout}`)
    logger.info(`stdout logs: ${stdout}`)
    return true
  } catch (e) {
    logger.error(`ERROR : Exit :: executeCMD ${cmd} - ${e.message}`)
    throw new Error(`Error while executing ${cmd}`)
  }
}

export async function createDirectories(destinationPath) {
  try {
    await fs.mkdir(destinationPath, { recursive: true })
    logger.info('Directory created successfully' + destinationPath)
    return true
  } catch (e) {
    logger.error(`Error creating directories: ${e.message}`)
    return false
  }
}

export const getCurrentTimeStamp = (timeZoneId) => {
  return moment
    .tz(new Date(), timeZoneId)
    .tz(timeZoneId)
    .format('YYYY-MM-DD HH:mm:ss')
}

export const descriptionStatus = (type) =>
  `Extraction process ${
    type == 'STARTED' ? 'started' : type == 'FAILED' ? 'failed' : 'completed'
  }`

export const querySqlizer = async (logQuery) => {
  const logColumns = Object.keys(logQuery).join(', ')
  const logValues = `'${Object.values(logQuery).join(`', '`)}'`
  return {
    logColumns,
    logValues,
  }
}
