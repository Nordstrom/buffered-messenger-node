# buffered-messenger-node
[![Build Status](https://travis-ci.org/Nordstrom/buffered-messenger-node.svg?branch=master)](https://travis-ci.org/Nordstrom/buffered-messenger-node)[![Coverage Status](https://coveralls.io/repos/github/Nordstrom/buffered-messenger-node/badge.svg?branch=master)](https://coveralls.io/github/Nordstrom/buffered-messenger-node?branch=master)[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Buffers the messages in certain interval as the buffer size allowed; and send through the function either user-implemented or provided.

## Install
Install with
```
npm install buffered-messenger-node --save
```

### Usage
To get started, initialize a new instance with a messageHandler, which will be used to flush the messages after certain interval or when the buffer is full.
```js
const Messenger = require('buffered-messenger-node')
const messenger = new Messenger({
    handler: (message) => {
        messages.forEach((message) => {
           console.log(JSON.stringify(message))
        }
    }
})
```
Or to use the provided messageHandler
```js
const rp = require('request-promise')  // or any other library needed to send the messages
const Messenger = require('buffered-messenger-node')
const messenger = new Messenger({
    maxBufferSize: 5,  // defaults to 10 items in the buffer array
    flushInterval: 1000,      // milliseconds - defaults to 10000 or 10 secs
    handler: (messages) => {
       // return promise from request-promise
       return rp({
          method: 'POST',
          uri: 'http://api.posttestserver.com/post',
          body: JSON.stringify(messages)
       })
    }
})
```

To pass a message to the buffered messenger

```js
client.send('sample message')
```

Or pass a message object
```js
client.send({ message: 'test-message', trace: 'my-trace' })
```