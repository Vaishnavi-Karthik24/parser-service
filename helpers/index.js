const { serverConfig } = require('../utils/secretUtils')
const { exec } = require('child_process')
const util = require('util')
const { rawStoragePath } = require('../utils/filePath')
const { STATUS, VENDORS } = require('../utils/constants')
const dao = require('../dao')
const logger = require('../logger')
const { createProducer } = require('../pulsar/producer')
const fs = require('fs')
const {
  getCurrentTimeStamp,
  descriptionStatus,
  querySqlizer,
} = require('../utils')

const groupByMarket = async (
  uuid,
  ems_name,
  ossName,
  PROCESS_STAGE,
  processStart,
  expiredAt,
  sourceDirectory,
  targetDirectory,
  emsFolderName,
  filename,
  isDebugEnabled,
  ems_vendor,
  logQuery,
  emsTimeZone
) => {
  const directoryPath = `${targetDirectory}/${emsFolderName}/`
  try {
    const files = await fs.promises.readdir(directoryPath)
    logger.info(
      `Files list presented inside ${directoryPath} :: ${JSON.stringify(files)}`
    )
    let uniqueMarketIds = []
    // Market separation for samsung and ericsson
    if (ems_vendor.toLowerCase() === VENDORS.SAMSUNG) {
      uniqueMarketIds = await getUniqueSamsungMarkets(files)
    } else if (ems_vendor.toLowerCase() === VENDORS.ERICSSON) {
      uniqueMarketIds = await getUniqueEricssonMarkets(files)
    }
    const mktCount = uniqueMarketIds.length
    logger.info(
      `Unique market ids for ${ems_name} : ${uuid} are ${JSON.stringify(
        uniqueMarketIds
      )}`
    )
    const results = []
    // Publish the markets to parser
    uniqueMarketIds.forEach((marketId) => {
      results.push({
        transaction_id: uuid,
        ems_name: ems_name,
        ossName,
        market_id: marketId,
        marketCount: mktCount,
        vendor: ems_vendor,
        filepath: `${targetDirectory}/${emsFolderName}/`,
        expiredAt: expiredAt,
      })
    })

    logger.info(
      `JSON formed successfully by grouping it by markets :: ${JSON.stringify(
        results
      )}`
    )

    // delete files from raw storage
    await deleteFilesfromRawStorage(
      uuid,
      ems_vendor,
      ems_name,
      ossName,
      PROCESS_STAGE,
      sourceDirectory,
      filename,
      logQuery,
      results,
      emsTimeZone
    )
    if (isDebugEnabled) {
      logger.info(
        `Skipped to produced message to parser since debug flag is enabled!`
      )
    } else {
      logger.info(`Producing msgs to parser for ems: ${ems_name}`)
      for (const result of results) {
        await createProducer(result)
      }
    }
  } catch (error) {
    logger.error(`Error while grouping by market :: ${error}`)
    throw error
  }
}

const deleteFilesfromRawStorage = async (
  uuid,
  ems_vendor,
  ems_name,
  ossName,
  PROCESS_STAGE,
  sourceDirectory,
  filename,
  logQuery,
  results,
  emsTimeZone
) => {
  let noOfCount
  let prev_uuid

  logger.info(`Awaiting to execute deleteFilesCmd`)

  try {
    let lastTransaction = await dao.getLastTransaction(
      uuid,
      STATUS.COMPLETED,
      ossName,
      ems_vendor
    )
    logger.info(
      `last transaction details :: ${JSON.stringify(lastTransaction)}`
    )
    noOfCount = lastTransaction[0]?.count
    prev_uuid = lastTransaction[0]?.prevUuid

    if (noOfCount == 0 && lastTransaction[0]?.prevUuid == null) {
      logger.error(
        `${noOfCount} record found for the previous transaction with the status :: ${STATUS.COMPLETED} for deleting the raw files.`
      )
    } else {
      logger.info(
        `Found ${noOfCount} record with the status :: ${STATUS.COMPLETED} and proceeding further`
      )

      const deleteFilesCmd = `cd ${rawStoragePath}/${ems_vendor.toLowerCase()}/ && rm -rf ${prev_uuid}`
      const { error, stderr } = await util.promisify(exec)(deleteFilesCmd)

      if (error) {
        logger.error(`Error in delete command :: ${error}`)
        throw new Error(`Error in delete command :: ${error}`)
      }
      if (stderr) {
        logger.info(`STDERR in delete command :: ${stderr}`)
      }

      logger.info(
        `Successfully deleted ${rawStoragePath}/${ems_vendor.toLowerCase()}/${prev_uuid} file from raw storage`
      )
    }
    // Insert extraction completed audit logs
    const completedQuery = {
      ...logQuery,
      status: STATUS.COMPLETED,
      status_desc: `${descriptionStatus(STATUS.COMPLETED)} market list ${results
        .map((x) => x.market_id)
        .join(',')}`,
      time_stamp: getCurrentTimeStamp(emsTimeZone),
    }
    let { logColumns, logValues } = await querySqlizer(completedQuery)
    await dao.insertAuditlogs(logColumns, logValues)
  } catch (err) {
    logger.error(`Error occurred while deleting the file :: ${err}`)
    const failedQuery = {
      ...logQuery,
      status: STATUS.COMPLETED,
      status_desc: `Error while executing the command for deleting the files :: ${err.message}`,
      time_stamp: getCurrentTimeStamp(emsTimeZone),
    }
    let { logColumns, logValues } = await querySqlizer(failedQuery)
    dao.insertAuditlogs(logColumns, logValues)
    throw err
  }
}

const getUniqueSamsungMarkets = async (files) => {
  // Check if the file ends with .xml
  let filesList = files.filter((i) => !i.endsWith('W.xml'))
  const regexExp = /_(\d+)\./
  let groupedFilenames = {}

  logger.info(`Checking files matching with regex`)

  const enodebIdList = filesList
    .map((files) => {
      const match = files && files.match(regexExp)
      if (match) {
        const numbers = match[1]
        if (!groupedFilenames[numbers]) {
          groupedFilenames[numbers] = []
        }
        groupedFilenames[numbers].push(files)
        return match && match[1]
      }
    })
    .filter((i) => i != null)

  logger.info(`Checking if the digits are less than 6..`)

  let zeroPaddedEnodebIds = [...enodebIdList].map((mkt) => {
    let len = mkt.length
    return len < 6 ? '0'.repeat(6 - len) + mkt : mkt
  })

  const regex = /^\d{3}/

  let mktIds = zeroPaddedEnodebIds.map((item) => {
    const match = item.match(regex)
    return match && match[0]
  })
  return [...new Set(mktIds)]
}

const getUniqueEricssonMarkets = async (files) => {
  // Process ericsson market splitting logic. Sample input file format "split.ONRM_ROOT_MO.MKT_171.1710000.xml"
  let filesList = files.filter((i) => i.endsWith('.xml'))
  logger.info(`List of files that ends with .xml are ${filesList}`)
  let mktNumber
  let uniqIds = new Set()
  // Split and identify market based on MKT_171 --> 171 indicates the market
  const regexExp = /MKT_(\d+)\./
  filesList.forEach((file) => {
    mktNumber = file.match(regexExp)?.[1]
    if (mktNumber != null && mktNumber != 'undefined') {
      uniqIds.add(mktNumber)
    }
  })
  return [...uniqIds]
}

module.exports = {
  groupByMarket,
  deleteFilesfromRawStorage,
  getUniqueEricssonMarkets,
  getUniqueSamsungMarkets,
}
