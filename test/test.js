'use strict'

const Promise = require('bluebird')
const _ = require('lodash')
// var should = require('should')
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const util = require('util')
const BufferMessenger = require('../index.js').BufferMessenger

function log (message) {
  if (message.length > 0) {
    console.log('log function: ', message)
    return Promise.resolve({})
  }
  throw new Error('empty message')
}

describe('basic interval buffer', function () {
  var client

  beforeEach(function () {
    client = new BufferMessenger({
      messageHandler: log,
      maxBufferSize: 126,
      bufferFlushInterval: 500
    })
  })

  it('test max buffer with string', function () {
    var message = 'test buffer for round %s '
    var messages = []
    for (var i = 0; i < 10; i++) {
      messages.push(util.format(message, i))
    }
    return Promise.each(messages, function (message) {
      return client.send(message)
        .then(function () {
          console.log('loop through %s', message)
        })
    })
      .then(function () {
        return client.close()
      })
  })

  it('test interval with string', function () {
    var message = 'test buffer for round %s '
    return client.send(util.format(message, 0))
      .then(function () {
        console.log('loop 0')
      })
      .delay(600)
      .then(function () {
        return client.send(util.format(message, 1))
      })
      // .delay(100)
      .then(function () {
        return client.send(util.format(message, 3))
      })
      .then(function () {
        console.log('loop 1')
      })
      .delay(500)
      .then(function () {
        console.log('loop 2')
      })
      .then(function () {
        return client.close()
      })
  })

  it('test formatter', () => {
    function messageFormatter (message) {
      var formatted = ''
      _.forEach(message, (value, key) => {
        formatted += key + '=' + value + ';'
      })
      return formatted
    }

    client = new BufferMessenger({
      messageFormatter: messageFormatter,
      messageHandler: log,
      maxBufferSize: 126,
      bufferFlushInterval: 500
    })

    var msg = {client: 'test-client'}
    for (var i = 0; i < 10; i++) {
      msg['message' + i] = 'test-message-' + i
    }

    return client.send(msg)
      .then(function () {
        return client.close()
      })
  })

  it('test max buffer with object', function () {
    client = new BufferMessenger({
      messageHandler: log,
      maxBufferSize: 126,
      bufferFlushInterval: 500,
      bufferType: 'object'
    })

    var messages = []
    for (var i = 0; i < 10; i++) {
      messages.push({ client: 'test-client-' + i, message: 'test-meassge-' + i })
    }
    return Promise.each(messages, function (message) {
      return client.send(message)
        .then(function () {
          console.log('loop through %s', message)
        })
    })
      .then(function () {
        return client.close()
      })
  })
})
