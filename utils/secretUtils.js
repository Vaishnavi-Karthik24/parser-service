require('dotenv').config()
const config = require('config')
const serverConfig = JSON.parse(process.env.sshConfig)

module.exports = { serverConfig }
