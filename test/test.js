'use strict'

const Promise = require('bluebird')
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const util = require('util')
// const BufferMessenger = require('../index.js').BufferMessenger
const BufferMessenger = require('../index.js')

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
      handler: log,
      maxBufferSize: 5,
      flushInterval: 500
    })
  })

  it('test max buffer', function () {
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

  it('test interval', function () {
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

  it('test max buffer with object', function () {
    client = new BufferMessenger({
      handler: log,
      maxBufferSize: 5,
      flushInterval: 500
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
