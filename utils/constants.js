const env_types = {
  DEV: 'dev',
  UAT: 'uat',
  PROD: 'prod',
}

const PROCESS_STAGE = 'EXTRACTION'
const STATUS = {
  STARTED: 'STARTED',
  INPROGRESS: 'INPROGRESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED',
  SUCCESS: 'SUCCESS',
}

const VENDORS = {
  SAMSUNG: 'samsung',
  ERICSSON: 'ericsson',
  NOKIA: 'nokia',
}
module.exports = {
  PROCESS_STAGE,
  env_types,
  STATUS,
  VENDORS,
}
