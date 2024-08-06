import pool from '../database/index.js'
import logger from '../logger/index.js'
import * as sql from './sql/index.js'

export const getEmsTimeZone = async (ems_name) => {
  try {
    const [rows] = await pool.promise().query(sql.getEmsTimeZone(ems_name))
    return rows
  } catch (error) {
    logger.error(
      `Error while fetching timezones from the table for ems => ${ems_name} :: ${error.message}`
    )
    throw error
  }
}

export const getLastTransaction = async (uuid, statusComplete, oss, vendor) => {
  try {
    const [rows] = await pool
      .promise()
      .query(sql.getLastTransaction(uuid, statusComplete, oss, vendor))
    return rows
  } catch (error) {
    logger.error('Error while fetching last transaction: ' + error.message)
    throw error
  }
}

export const insertAuditlogs = async (columns, values) => {
  try {
    const [rows] = await pool
      .promise()
      .query(sql.insertAuditlogs(columns, values))
    return rows
  } catch (error) {
    logger.error(`Error while inserting into audit logs :: ${error.message}`)
    throw error
  }
}

export const updateAuditTracker = async (
  FAILURESTATUS,
  uuid,
  lastModifiedTs = null
) => {
  try {
    const [rows] = await pool
      .promise()
      .query(sql.updateAuditTracker(FAILURESTATUS, uuid, lastModifiedTs))
    return rows
  } catch (error) {
    logger.error(
      `Error while updating into audit tracker table :: ${error.message}`
    )
    throw error
  }
}
