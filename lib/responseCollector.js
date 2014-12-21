var debug = require('debug')('harmonyhubjs:discover:responsecollector')
	, util = require('util')
	, EventEmitter = require('events').EventEmitter
	, net = require('net');

function ResponseCollector(port) {
	debug('ResponseCollector(' + port + ')');

	var self = this;
	this.port = port;
	EventEmitter.call(self);
}
util.inherits(ResponseCollector, EventEmitter);

ResponseCollector.prototype.start = function start() {
	debug('start()');

	var self  = this;
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
	}).listen(self.port);
};

ResponseCollector.prototype.stop = function stop() {
	debug('stop()');

	if(this.server) {
		this.server.close();
	} else {
		debug('not running');
	}
};

module.exports = ResponseCollector;
