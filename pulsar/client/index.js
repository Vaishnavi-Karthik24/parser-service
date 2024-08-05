import Pulsar from 'pulsar-client'
import logger from '../../logger/index.js'

const certificatePath = process.env.CERTIFICATE_PATH
const privateKeyPath = process.env.PRIVATE_KEY_PATH
const tlsTrustCertsFilePath = process.env.TLS_TRUST_CERT_FILE_PATH

let client

try {
  let serviceUrl = process.env.VMB
  logger.info('Establishing pulsar connection with ' + serviceUrl)
  if (certificatePath && privateKeyPath && tlsTrustCertsFilePath) {
    logger.info('Authenticating with certificate and private key')
    let auth = new Pulsar.AuthenticationTls({
      certificatePath,
      privateKeyPath,
    })
    client = new Pulsar.Client({
      serviceUrl: serviceUrl,
      authentication: auth,
      tlsTrustCertsFilePath,
    })
    logger.info('Certificate and private key authentication successfull')
  } else {
    logger.info('No certificate or private key provided')
    client = new Pulsar.Client({
      serviceUrl: serviceUrl,
    })
  }
} catch (error) {
  logger.error('Error while establishing pulsar connection', error.message)
  process.exit(1)
}

export default client
