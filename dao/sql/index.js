module.exports = {
  getEmsTimeZone: (ems_name) => {
    let nativeQuery = `select ed.time_zone as time_zone, CONVERT_TZ(CURRENT_TIMESTAMP(), @@global.time_zone, ed.time_zone) as process_start_time from ems_details ed where ed.ems_name = '${ems_name}';`
    return nativeQuery
  },

  getLastTransaction: (uuid, statusComplete, oss, vendor) => {
    const nativeQuery = `select sat.transactions_id as prevUuid, count(sat.transactions_id) as count from snapshot_audit_tracker sat where sat.transactions_id != '${uuid}' and sat.status = '${statusComplete}' and sat.ossname = '${oss}' and sat.vendor = '${vendor}' order by sat.created_ts desc limit 1`
    return nativeQuery
  },

  insertAuditlogs: (columns, values) => {
    let nativeQuery = `INSERT INTO vson.snapshot_audit_logs(${columns}) values(${values})`
    return nativeQuery
  },

  updateAuditTracker: (FAILURESTATUS, uuid, lastModifiedTs) => {
    const nativeQuery = `UPDATE vson.snapshot_audit_tracker SET status = '${FAILURESTATUS}', last_modified_ts = '${lastModifiedTs}' WHERE (transactions_id = '${uuid}');`
    return nativeQuery
  },
}
