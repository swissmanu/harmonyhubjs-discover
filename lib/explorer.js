var debug = require('debug')('harmonyhubjs:discover:explorer')
	, util = require('util')
	, EventEmitter = require('events').EventEmitter
	, Ping = require('./ping')
	, ResponseCollector = require('./responseCollector');

function deserializeResponse(response) {
	var pairs = {};

	response.split(';')
		.forEach(function(rawPair) {
			var splitted = rawPair.split(':');
			pairs[splitted[0]] = splitted[1];
		});

	return pairs;
}

function Explorer(port) {
	debug('Explorer(' + port + ')');

	var self = this;
	self.port = port;
	self.ping = new Ping(self.port);
	self.responseCollector = new ResponseCollector(self.port);
	self.knownHubs = {};

	self.responseCollector.on('response', function(data) {
		var hub = deserializeResponse(data);

		if(self.knownHubs[hub.uuid] === undefined) {
			debug('discovered new hub ' + hub.friendlyName);
			self.knownHubs[hub.uuid] = hub;
		} else {
			self.knownHubs[hub.uuid].lastSeen = new Date();
		}
	});
}

Explorer.prototype.start = function start() {
	debug('start()');
	this.ping.start();
};

Explorer.prototype.stop = function stop() {
	debug('stop()');
	this.ping.stop();
};

//util.inherits(Explorer, EventEmitter);
module.exports = Explorer;
