# buffered-messenger-node
[![Build Status](https://travis-ci.org/Nordstrom/buffered-messenger-node.svg?branch=master)](https://travis-ci.org/Nordstrom/buffered-messenger-node)[![Coverage Status](https://coveralls.io/repos/github/Nordstrom/buffered-messenger-node/badge.svg?branch=master)](https://coveralls.io/github/Nordstrom/buffered-messenger-node?branch=master)[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Buffers the messages in certain interval as the buffer size allowed; and send through the function either user-implemented or provided.

## Install
Install with
```
npm install git+https://github.com/Nordstrom/buffered-messenger-node.git --save
```

### Usage
To get started, initialize a new instance with a messageHandler, which will be used to flush the messages after certain interval or when the buffer is full.
```js
var BufferMessenger = require('../index.js').BufferMessenger
var  client = new BufferMessenger({
          messageHandler: log,
          maxBufferSize: 126,
          bufferFlushInterval: 500
        })
```
Or to use the provided messageHandler
```js
var bufferMessenger = require('buffered-messenger-node')
var client = new bufferMessenger.BufferMessenger({
        messageHandler: bufferMessenger.handlerInfluxLines({
          host: 'localhost',
          port: 8186,
          database: 'influxdb'

        }),
        maxBufferSize: 1024
        bufferFlushInterval: 15000,
        bufferType: 'object'
  })
```

To pass a message with string type to the buffer messenger

```js
client.send('sample message')
```

Or pass a message with object
```js
client.send({ message: 'test-message', trace: 'my-trace' })
```