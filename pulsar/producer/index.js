// Import required modules
const client = require('../client/index.js')
const logger = require('../../logger')

export const createProducer = async (message) => {
  logger.info('Creating producer connection')

  // Create a producer with specified topic and send timeout
  const producer = await client.createProducer({
    topic: process.env.PARSER_TOPIC,
    sendTimeoutMs: 30000,
  })
  await producer.send({
    data: Buffer.from(
      JSON.stringify({
        ...message,
      })
    ),
  })
  logger.info(
    `Produced to parser successfully!! ::: ${JSON.stringify(message)}`
  )
  await producer.close()
}
