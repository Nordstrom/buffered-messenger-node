'use strict'

var BufferMessenger = require('./lib/intervalBuffer')
var messageHandler = require('./lib/messageHandler.js')

module.exports = {
  BufferMessenger,
  handlerInfluxLines: messageHandler
}
