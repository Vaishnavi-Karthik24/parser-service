/**
 * This module exports a logger instance created using the 'pino' library.
 * @module logger
 * @type {Object}
 */
const pino = require('pino')
const nrPino = require('@newrelic/pino-enricher')

const logger = pino(nrPino())

module.exports = logger
