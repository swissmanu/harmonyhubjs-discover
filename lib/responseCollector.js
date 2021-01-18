var debug = require('debug')('harmonyhubjs:discover:responsecollector')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var net = require('net')

function ResponseCollector (port) {
  debug('ResponseCollector(' + port + ')')

  var self = this
  this.port = port
  EventEmitter.call(self)
}
util.inherits(ResponseCollector, EventEmitter)

ResponseCollector.prototype.start = function start () {
  debug('start()')

  var self = this
  self.server = net.createServer(function (socket) {
    debug('handle new connection')

    var buffer = ''

    socket.on('data', function (data) {
      debug('received data chunk')
      buffer += data.toString()
    })

    // Listen for potential errors, because otherwise errors are thrown.
    // (They appear to be harmless in practice for our use.)
    this.socket.on('error', function (err) {
      debug('error during socket bind: ' + err)
    })

    socket.on('end', function () {
      debug('connection closed. emitting data.')
      self.emit('response', buffer)
    })
  }).listen(self.port)
}

ResponseCollector.prototype.stop = function stop () {
  debug('stop()')

  if (this.server) {
    this.server.close()
  } else {
    debug('not running')
  }
}

module.exports = ResponseCollector
