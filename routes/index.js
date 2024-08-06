// Import required modules
import * as express from 'express'
const router = express.Router()
import * as controller from '../controller/snapshotExtractor.js'
import validateTokenMiddleware from '../middleware/index.js'

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
