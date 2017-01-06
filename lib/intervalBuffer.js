'use strict'

var _ = require('lodash')
var Promise = require('bluebird')

function IntervalBuffer (options) {
  var self = this

  self.handler = options.handler || _.noop
  self.closeHandler = options.closeHandler
  self.errorHandler = options.errorHandler
  self.mock = options.mock && options.mock === true
  self.maxBufferSize = options.maxBufferSize || 10  // this is max number of items in the buffer array
  self.flushInterval = options.flushInterval || 10000  // default 10 sec
  self.buffer = []
  if (self.maxBufferSize > 0) {
    self.intervalHandle = setInterval(this.onBufferFlushInterval.bind(this), self.flushInterval)
  }
}

/**
 * Send a message to IntervalBuffer
 * @param message {Object} The constructed message without tags
 */
IntervalBuffer.prototype.send = function (message) {
  var self = this

  // Only send this message if we're not a mock.
  if (self.mock) {
    return Promise.resolve()
  }

  if (self.maxBufferSize === 0) {
    return self._send(message)
  }

  if (self.buffer.length >= self.maxBufferSize) {
    return self.flush()
      .then(function () {
        self.buffer.push(message)
        return Promise.resolve()
      })
  }

  self.buffer.push(message)
  return Promise.resolve()
}

/**
 * Flush the buffer, sending on the messages
 */
IntervalBuffer.prototype.flush = function () {
  var self = this
  return self._send(self.buffer)
    .then(function () {
      self.buffer = []
      return Promise.resolve()
    })
}

/**
 * Send on the message through the messageHandler.
 * Internal function
 *
 * @param message {String} The message
 */
IntervalBuffer.prototype._send = function (messages) {
  if (_.isEmpty(messages)) {
    return Promise.resolve()
  }
  var self = this
  if (!_.isArray(messages)) {
    messages = [messages]
  }
  const promise = self.handler(messages)
  if (promise && promise.then) {
    return promise.catch(function (err) {
      err = err.error || err
      var errMessage = 'Error sending message from MessageHandler: ' + err
      throw new Error(errMessage)
    })
  } else {
    return Promise.resolve()
  }
}

/**
 * Called every bufferFlushInterval to flush any buffer that is around
 */
IntervalBuffer.prototype.onBufferFlushInterval = function () {
  var self = this
  return self.flush()
}

/**
 * Close the underlying operation and stop listening for data on it.
 */
IntervalBuffer.prototype.close = function () {
  var self = this
  if (self.intervalHandle) {
    clearInterval(this.intervalHandle)
  }
  return self.flush()
    .then(function () {
      if (self.closeHandler) {
        return self.closeHandler()
      }
    })
    .catch(function (err) {
      err = err.error || err
      var errMessage = 'Error closing the operation: ' + err
      throw new Error(errMessage)
    })
}

module.exports = IntervalBuffer
