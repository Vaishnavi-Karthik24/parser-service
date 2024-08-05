/**
 * This module exports a logger instance created using the 'pino' library.
 * @module logger
 * @type {Object}
 */

import pino from 'pino'
import nrPino from '@newrelic/pino-enricher'

const logger = pino(nrPino())

export default logger
