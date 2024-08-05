const logger = require('../logger')
const newrelic = require('newrelic')
const { extractor } = require('../controller/snapshotExtractor')

async function listener(msg, msgConsumer) {
  try {
    let msgData = JSON.parse(msg.getData())
    logger.info(`Extraction process started ${JSON.stringify(msgData)}`)
    await extractor(msgData)
    await msgConsumer.acknowledge(msg)
    logger.info('Positive acknowledged')
  } catch (err) {
    logger.error(`Error occurred and negative acknowledged :: ${err}`)
    newrelic.noticeError(err)
    msgConsumer.acknowledge(msg)
  }
}

module.exports = listener
