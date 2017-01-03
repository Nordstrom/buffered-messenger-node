'use strict'

var BufferMessenger = require('./lib/bufferMessenger')
var messageHandler = require('./lib/messageHandler.js')

module.exports = {
  BufferMessenger,
  handlerInfluxLines: messageHandler
}
