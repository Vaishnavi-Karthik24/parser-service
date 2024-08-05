import logger from '../logger/index.js'
import newrelic from 'newrelic'
import { extractor } from '../controller/snapshotExtractor.js'

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

export default listener
