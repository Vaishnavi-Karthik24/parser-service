import { PROCESS_STAGE, STATUS, VENDORS } from '../utils/constants.js';
import * as dao from '../dao/index.js';
import logger from '../logger/index.js';
import {
  getCurrentTimeStamp,
  descriptionStatus,
  querySqlizer,
} from '../utils/index.js';
import { unTarFiles } from '../helpers/samsung.js';
import { moveFiles } from '../helpers/nokia.js';
import * as unZipFiles from '../helpers/ericsson.js';

// Extraction process for Samsung, Ericsson and Nokia
export const extractor = async (msg) => {
  logger.info(`Extractor message received :: ${JSON.stringify(msg)}`);

  const msgData = msg;
  const {
    uuid,
    vendor: ems_vendor,
    ems_name,
    filename,
    path: filePath,
    expireAt: expiredAt,
    debug: isDebugEnabled,
    ossName,
  } = msgData;
  let processStart;
  let emsTimeZone;

  // Get process start time for the given ems in its timezone
  if (ems_name) {
    let ems_details = await dao.getEmsTimeZone(ems_name);
    if (ems_details.length > 0) {
      processStart = ems_details[0]?.process_start_time;
      emsTimeZone = ems_details[0]?.time_zone;
    }
  }

  try {
    if (msgData) {
      logger.info(
        `Topic consumed successfully with message ::: ${JSON.stringify({
          ...msgData,
          emsTimeZone,
        })}`
      );
      logger.info(`Process started at ::: ${processStart}`);

      // form the audit object

      const logQuery = {
        transactions_id: uuid,
        market_id: null,
        ems_name: ems_name,
        process_name: PROCESS_STAGE,
      };

      let expireTime = new Date(expiredAt).getTime();
      let currentTime = emsTimeZone
        ? getCurrentTimeStamp(emsTimeZone)
        : new Date().getTime();

      if (
        ems_vendor == undefined ||
        ![VENDORS.SAMSUNG, VENDORS.ERICSSON, VENDORS.NOKIA].includes(
          ems_vendor
        ) ||
        uuid == undefined ||
        ems_name == undefined ||
        filename == undefined ||
        filePath == undefined
      ) {
        logger.error(
          `Something went wrong ems_vendor:${ems_vendor}, ems_vendor:${ems_vendor}, uuid:${uuid}, ems_name:${ems_name}, filename:${filename}, filePath:${filePath}`
        );
        throw new Error(
          `Something went wrong ems_vendor:${ems_vendor}, ems_vendor:${ems_vendor}, uuid:${uuid}, ems_name:${ems_name}, filename:${filename}, filePath:${filePath}`
        );
      }

      const startedLogQuery = {
        ...logQuery,
        status: STATUS.STARTED,
        status_desc: descriptionStatus(STATUS.STARTED),
        time_stamp: processStart,
      };

      // insert process start audit
      let { logColumns, logValues } = await querySqlizer(startedLogQuery);
      await dao.insertAuditlogs(logColumns, logValues);

      if (currentTime > expireTime) {
        const expiredLogQuery = {
          ...logQuery,
          status: STATUS.EXPIRED,
          status_desc: `Current time ${currentTime} exceeds expiration time ${expiredAt} and hence cannot be proceed further`,
          time_stamp: getCurrentTimeStamp(emsTimeZone),
        };

        // insert audit indicating current time crossed expiry
        let { logColumns, logValues } = await querySqlizer(expiredLogQuery);
        await dao.insertAuditlogs(logColumns, logValues);
        dao.updateAuditTracker(
          STATUS.EXPIRED,
          uuid,
          getCurrentTimeStamp(emsTimeZone)
        );
        return;
      }

      // extraction process
      if (ems_vendor.toLowerCase() == VENDORS.SAMSUNG) {
        await unTarFiles(
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
        );
      } else if (ems_vendor.toLowerCase() == VENDORS.NOKIA) {
        let { destinationDirectory, destinationFileName } = await moveFiles(
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
        );
      } else if (ems_vendor.toLowerCase() === VENDORS.ERICSSON) {
        await unZipFiles(
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
        );
      }
    } else {
      logger.info('No msg record found');
    }
  } catch (error) {
    logger.error(
      `Exception occurred while processing extractor func :: ${error}`
    );
    // form the error audit object
    const logQuery = {
      transactions_id: uuid,
      market_id: null,
      ems_name: msg.ems_name,
      process_name: PROCESS_STAGE,
      status: STATUS.FAILED,
      status_desc: descriptionStatus(STATUS.FAILED),
      time_stamp: processStart,
    };
    // insert the failed audit
    let { logColumns, logValues } = await querySqlizer(logQuery);
    dao.insertAuditlogs(logColumns, logValues);
    dao.updateAuditTracker(
      STATUS.FAILED,
      uuid,
      getCurrentTimeStamp(emsTimeZone)
    );
    throw error;
  }
};
