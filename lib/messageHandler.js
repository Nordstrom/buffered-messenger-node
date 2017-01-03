'use strict'

var influx = require('influx')

module.exports = function (options) {
  return function (message) {
    var url = 'http://' + (options.host || 'localhost') + ':' + (options.port || 8186) + '/' + options.database
    var InfluxClient = new influx.InfluxDB(url)
    return InfluxClient.writePoints(message)
      .then(function () {
        console.log('Written points')
      })
      .catch(function (err) {
        console.error('ERROR sending the metrics: ', (err.error || err))
      })
  }
}

