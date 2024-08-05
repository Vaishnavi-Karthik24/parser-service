import { getExtractorStoragePath } from '../utils/filePath.js'
import { PROCESS_STAGE, STATUS } from '../utils/constants.js'
import {
  executeCMD,
  getCurrentTimeStamp,
  descriptionStatus,
  querySqlizer,
} from '../utils/index.js'
import { groupByMarket } from './index.js'
import * as dao from '../dao/index.js'
import logger from '../logger/index.js'

/* Ericsson extraction process 
   Sample format of the received files - 20240510.duluth.enm.xml.zip 
   Sample format of the extracted files - split.ONRM_ROOT_MO.MKT_214.214230.xml */

export const unTarFiles = async (
  uuid,
  ems_vendor,
  ems_name,
  ossName,
  filename,
  filePath,
  expiredAt,
  processStart,
  isDebugEnabled,
  logQuery,
  emsTimeZone
) => {
  try {
    logger.info(`Vendor received is ${ems_vendor} and proceeding further...`)
    const targetDir = getExtractorStoragePath(ems_vendor, uuid, ems_name)
    const sourceDir = `${filePath}/${filename}`
    logger.info(`Trying to find .zip files in ${sourceDir} :: ${ems_vendor}`)

    // check if the file is in .zip format
    if (filename.endsWith('.zip')) {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
      const day = ('0' + currentDate.getDate()).slice(-2)
      const formattedDate = `${year}${month}${day}`
      const emsFolderName = `${ems_name}_${formattedDate}`

      // form the destDir to store the enb level files after extraction
      const destDir = `${targetDir}/${emsFolderName}`
      const extractionScriptPath = `loadEricssonMongo.multi.sh`
      try {
        // invoke the shell script loadEricssonMongo.multi.sh
        const shellCommand = `bash ${extractionScriptPath} --ems=${ems_name} --date=${formattedDate} --file=${sourceDir} --destPath=${destDir}`
        logger.info(
          `Executing shellCommand for ericsson extraction :: ${shellCommand}`
        )
        if (await executeCMD(shellCommand)) {
          logger.info(
            `Succesfully executed the file enblevel file split for ${ems_name}, proceeding with market grouping :: ${ems_vendor} `
          )
          // get unique markets from enb files and publish them to parserservice
          await groupByMarket(
            uuid,
            ems_name,
            ossName,
            PROCESS_STAGE,
            processStart,
            expiredAt,
            sourceDir,
            targetDir,
            emsFolderName,
            filename,
            isDebugEnabled,
            ems_vendor,
            logQuery,
            emsTimeZone
          )
        }
      } catch (error) {
        logger.error(
          `Error occurred while executing the unzip command :: ${error}`
        )
        const logQuery = {
          transactions_id: uuid,
          market_id: null,
          ems_name: ems_name,
          process_name: PROCESS_STAGE,
          status: STATUS.FAILED,
          status_desc: descriptionStatus(STATUS.FAILED),
          time_stamp: processStart,
        }

        // insert audit incase of any error
        let { logColumns, logValues } = await querySqlizer(logQuery)
        await dao.insertAuditlogs(logColumns, logValues)
        dao.updateAuditTracker(
          STATUS.FAILED,
          uuid,
          getCurrentTimeStamp(emsTimeZone)
        )
        return
      }
    } else {
      logger.error(`${filename} file type is not matched :: ${ems_vendor}`)
    }
  } catch (error) {
    logger.error(
      `Error occurred inside unZipping function :: ${error} :: ${ems_vendor} `
    )
    throw error
  }
}
