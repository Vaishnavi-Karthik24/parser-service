import fs from 'fs/promises'
import path from 'path'
import logger from '../logger/index.js'
import { getExtractorStoragePath, rawStoragePath } from '../utils/filePath.js'
import {
  descriptionStatus,
  getCurrentTimeStamp,
  querySqlizer,
} from '../utils/index.js'
import * as dao from '../dao/index.js'
import { createProducer } from '../pulsar/producer/index.js'
import { STATUS } from '../utils/constants.js'
import util from 'util'
import { exec } from 'child_process'

export const moveFiles = async (
  uuid,
  ems_vendor,
  ems_name,
  filename,
  filePath,
  expiredAt,
  ossName,
  isDebugEnabled,
  logQuery,
  emsTimeZone
) => {
  try {
    const sourceFilePath = path.join(filePath, filename)

    try {
      await fs.access(sourceFilePath)
    } catch (error) {
      logger.info(`source file does not Exit :: ${sourceFilePath}`)
      throw new Error('source file does not Exit.')
    }

    const targetDirectory = getExtractorStoragePath(ems_vendor, uuid, ems_name)
    const destinationDirectory = path.join(targetDirectory)

    try {
      await fs.access(destinationDirectory)
    } catch (error) {
      await fs.mkdir(destinationDirectory, {
        recursive: true,
      })
    }

    await fs.copyFile(sourceFilePath, path.join(destinationDirectory, filename))

    const deleteFilesCmd = `cd ${rawStoragePath}/${ems_vendor.toLowerCase()}/ && rm -rf ${uuid}`
    const { error, stderr } = await util.promisify(exec)(deleteFilesCmd)

    if (error) {
      logger.error(`Error in delete command :: ${error}`)
      throw new Error(`Error in delete command :: ${error}`)
    }
    if (stderr) {
      logger.info(`STDERR in delete command :: ${stderr}`)
    }

    logger.info(
      `Successfully deleted ${rawStoragePath}/${ems_vendor.toLowerCase()}/${uuid} file from raw storage`
    )
    // let unlinkPath = sourceFilePath.split(ems_name)
    // unlinkPath = unlinkPath[0];
    // console.log(unlinkPath,'unlinkpath');
    // await fs.unlink(unlinkPath)

    logger.info(`file are deleted successfully :: ${sourceFilePath}`)

    if (isDebugEnabled) {
      logger.info(
        `Skipped to produced message to parser since debug flag is enabled!`
      )
    } else {
      logger.info(`Awaiting to produce to parser with result :: ${emsTimeZone}`)
      const successQuery = {
        ...logQuery,
        status: STATUS.COMPLETED,
        status_desc: descriptionStatus(STATUS.COMPLETED),
        time_stamp: getCurrentTimeStamp(emsTimeZone),
      }
      let data = await querySqlizer(successQuery)
      await dao.insertAuditlogs(data.logColumns, data.logValues)
      const result = {
        transaction_id: uuid,
        ems_name: ems_name,
        market_id: null,
        marketCount: 1,
        vendor: ems_vendor,
        filepath: `${destinationDirectory}/`,
        expiredAt: expiredAt,
        ossName,
      }
      await createProducer(result)
      return 'success'
    }

    return {
      destinationDirectory: destinationDirectory,
      destinationFileName: filename,
    }
  } catch (error) {
    logger.error(`Error occurred inside moving function :: ${error}`)
    throw new Error(error.message)
  }
}
