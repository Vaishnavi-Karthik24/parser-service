const client = require('../client')
const listener = require('../../listener')
const logger = require('../../logger')
const newrelic = require('newrelic')
require('dotenv').config()

let consumer

const consumerInit = async () => {
  try {
    let topic = process.env.EXTRACTOR_TOPIC
    let subscription = process.env.SUBSCRIPTION
    let subscriptionType = process.env.SUBSCRIPTION_TYPE
    let receiverQueueSize = process.env.RECEIVER_QUEUE_SIZE
    consumer = client.subscribe({
      topic,
      subscription,
      subscriptionType,
      receiverQueueSize,
      listener: (msg, msgConsumer, topic) => {
        newrelic.startBackgroundTransaction(topic, async () => {
          await listener(msg, msgConsumer)
          newrelic.endTransaction()
        })
      },
    })
  } catch (err) {
    logger.error(`Error while consuming message :: ${err.message}`)
    throw error
  }
  return consumer
}

module.exports = { consumerInit, consumer }
