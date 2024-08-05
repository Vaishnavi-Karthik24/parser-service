// Import required modules
const express = require('express')
const router = express.Router()
const controller = require('../controller/snapshotExtractor')
const validateTokenMiddleware = require('../middleware')

// Middleware to validate token
router.use(validateTokenMiddleware)

// Route to handle POST request for publishing event
router.post('/publish-snapshot-event', function (req, res, next) {
  try {
    controller.extractor(req.body)
    res
      .status(200)
      .json({ status: 'SUCCESS', message: 'Request submitted successfully ' })
  } catch (e) {
    res.status(400).json({ status: 'ERROR', message: e })
  }
})

export default router
