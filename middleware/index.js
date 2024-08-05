const jwt = require('jsonwebtoken')
const logger = require('../logger')
const newrelic = require('newrelic')

/**
 * Middleware function to validate the token in the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const validateTokenMiddleware = (req, res, next) => {
  // Log the method and URL of the incoming request
  logger.info({ method: req.method, url: req.url })

  const token = req.headers.authorization
  if (!token) {
    // If no token is provided, return a 401 Unauthorized response
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    logger.debug('Verifying JWT token')
    const decoded = jwt.verify(token, process.env.jwt_secret, {
      algorithm: process.env.jwt_algorithm || 'HS512',
      issuer: process.env.jwt_issuer || '',
      expiresIn: process.env.jwt_expires_in || '900',
    })

    if (decoded.status && decoded.status.toLowerCase() === 'active') {
      // If the token is valid and the status is "active", log the decoded token and set the user ID in New Relic
      logger.debug(decoded, 'Authorized Access')
      logger.info(decoded)
      newrelic.setUserID(decoded.loginId)
    } else {
      // If the token is valid but the status is not "active", return a 401 Unauthorized response
      logger.debug('Unauthorized Access')
      return res.status(401).json({ message: 'Unauthorized Access' })
    }
  } catch (error) {
    // If the token is invalid, return a 403 Forbidden response
    logger.debug('Invalid Token')
    return res.status(403).json({ message: 'Invalid token' })
  }

  // Call the next middleware function
  next()
}

module.exports = validateTokenMiddleware
