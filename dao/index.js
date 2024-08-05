import pool from '../database/index.js'
import logger from '../logger/index.js'
import * as sql from './sql/index.js'

module.exports = {
  getEmsTimeZone: async (ems_name) => {
    try {
      const [rows] = await pool.promise().query(sql.getEmsTimeZone(ems_name))
      return rows
    } catch (error) {
      logger.error(
        `Error while fetching timezones from the table for ems => ${emsName} :: ${error.message}`
      )
      throw error
    }
  },

  getLastTransaction: async (uuid, statusComplete, oss, vendor) => {
    try {
      const [rows] = await pool
        .promise()
        .query(sql.getLastTransaction(uuid, statusComplete, oss, vendor))
      return rows
    } catch (error) {
      logger.error('Error while fetching last transaction' + error)
      throw error
    }
  },

  insertAuditlogs: async (columns, values) => {
    try {
      const [rows] = await pool
        .promise()
        .query(sql.insertAuditlogs(columns, values))
      return rows
    } catch (error) {
      logger.error(`Error while inserting into audit logs :: ${error.message}`)
      throw error
    }
  },

  updateAuditTracker: async (FAILURESTATUS, uuid, lastModifiedTs = null) => {
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
  },
}
