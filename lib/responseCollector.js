var debug = require('debug')('harmonyhubjs:discover:responsecollector')
	, util = require('util')
	, EventEmitter = require('events').EventEmitter
	, net = require('net');

function ResponseCollector(port) {
	debug('ResponseCollector(' + port + ')');

	var self = this;

	self.server = net.createServer(function(socket) {
		debug('handle new connection');

		var buffer = '';

		socket.on('data', function(data) {
			debug('received data chunk');
			buffer += data.toString();
		});

		socket.on('end', function() {
			debug('connection closed. emitting data.');
			self.emit('response', buffer);
		});
	}).listen(port);
}

util.inherits(ResponseCollector, EventEmitter);
module.exports = ResponseCollector;
