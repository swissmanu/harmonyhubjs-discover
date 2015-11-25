var debug = require('debug')('harmonyhubjs:discover:ping')
	, dgram = require('dgram');

function Ping(portToAnnounce) {
	debug('Ping(' + portToAnnounce + ')');

	this.socket = dgram.createSocket('udp4');
	this.port = 5224;
	this.address = '255.255.255.255';
	this.interval = 1000;
	this.message = '_logitech-reverse-bonjour._tcp.local.\n' + portToAnnounce;
	this.messageBuffer = new Buffer(this.message);

	// Prepare the socket so it can emit broadcasts:
	this.socket.bind(this.port, function() {
		this.setBroadcast(true);
	});
}

function emit() {
	debug('emit()');
	var self = this;

	self.socket.send(self.messageBuffer, 0, self.message.length, self.port, self.address
		, function(err) {
			if(err) {
				debug('error emitting ping. stopping now :( (' + err + ')');
				self.stop();
			}
		});
}

Ping.prototype.start = function start() {
	debug('start()');
	this.intervalToken = setInterval(emit.bind(this), this.interval);
};

Ping.prototype.stop = function stop() {
	debug('stop()');
	clearTimeout(this.intervalToken);
	this.intervalToken = undefined;
	this.socket.close();
};

Ping.prototype.isRunning = function isRunning() {
	debug('isRunning()');
	return (this.intervalToken !== undefined);
};

module.exports = Ping;
