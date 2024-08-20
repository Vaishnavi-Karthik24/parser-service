import * as client from '../client'

class PulsarProducerSingleton {
  constructor(serviceUrl, topic, producerOptions) {
    this.serviceUrl = serviceUrl
    this.topic = topic
    this.producerOptions = producerOptions
    this.producerInstance = null
  }

  async getProducer() {
    if (!this.producerInstance) {
      this.producerInstance = await client.createProducer({
        topic: this.topic,
        ...this.producerOptions,
      })
    }
    return this.producerInstance
  }

  async close() {
    if (this.producerInstance) {
      await this.producerInstance.close()
      this.producerInstance = null
    }
  }
}
module.exports = PulsarProducerSingleton
