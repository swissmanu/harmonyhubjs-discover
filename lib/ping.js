var debug = require('debug')('harmonyhubjs:discover:ping')
var dgram = require('dgram')

function Ping (portToAnnounce, options) {
  options = options || {}
  debug('Ping(' + portToAnnounce + ', ' + JSON.stringify(options) + ')')

  this.socket = dgram.createSocket('udp4')
  this.port = options.port || 5224
  this.address = options.address || '255.255.255.255'
  this.interval = options.interval || 1000
  this.message = '_logitech-reverse-bonjour._tcp.local.\n' + portToAnnounce
  this.messageBuffer = new Buffer(this.message)

  // Prepare the socket so it can emit broadcasts:
  this.socket.bind(this.port, function () {
    this.setBroadcast(true)
  })
  // Listen for potential errors, because otherwise errors are thrown.
  // (They appear to be harmless in practice for our use.)
  this.socket.on('error', function (err) {
    debug('error during socket bind: ' + err)
  })
}

function emit () {
  debug('emit()')
  var self = this

  self.socket.send(self.messageBuffer, 0, self.message.length, self.port, self.address
    , function (err) {
      if (err) {
        debug('error emitting ping. stopping now :( (' + err + ')')
        self.stop()
      }
    })
}

Ping.prototype.start = function start () {
  debug('start()')
  this.intervalToken = setInterval(emit.bind(this), this.interval)
}

Ping.prototype.stop = function stop () {
  debug('stop()')
  clearInterval(this.intervalToken)
  this.intervalToken = undefined
  this.socket.close()
}

Ping.prototype.isRunning = function isRunning () {
  debug('isRunning()')
  return (this.intervalToken !== undefined)
}

module.exports = Ping
