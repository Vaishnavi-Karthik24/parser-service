const SftpClient = require('ssh2-sftp-client')
const logger = require('../logger')

class SFTPConnection {
  constructor(config) {
    this.sftp = new SftpClient()
    this.config = config
  }

  async connect() {
    try {
      await this.sftp.connect(this.config)
      logger.info('Connected to SFTP server')
    } catch (error) {
      logger.error('Error while connecting to SFTP server:', error.message)
    }
  }

  async disconnect() {
    try {
      await this.sftp.end()
    } catch (error) {
      logger.error('Error disconnecting from SFTP server:', error.message)
    }
  }

  getSftpClient() {
    return this.sftp
  }
}

module.exports = SFTPConnection
