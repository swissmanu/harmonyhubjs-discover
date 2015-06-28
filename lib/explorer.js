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

function arrayOfKnownHubs(knownHubs) {
	return Object.keys(knownHubs).map(function(hubUuid) {
		return knownHubs[hubUuid]
	});
}

function handleResponse(data) {
	var hub = deserializeResponse(data);

	if(this.knownHubs[hub.uuid] === undefined) {
		debug('discovered new hub ' + hub.friendlyName);
		this.knownHubs[hub.uuid] = hub;
		this.emit('online', hub);
		this.emit('update', arrayOfKnownHubs(this.knownHubs));
	} else {
		this.knownHubs[hub.uuid].lastSeen = new Date();
	}
}

function executeCleanUp() {
	debug('executeCleanUp()');

	var self = this
		, now = new Date();

	Object.keys(self.knownHubs).forEach(function(hubUuid) {
		var hub = self.knownHubs[hubUuid]
			, diff = now - hub.lastSeen;

		if(diff > 5000) {
			debug('hub at ' + hub.ip + ' seen last ' + diff +'ms ago. clean up and tell subscribers that we lost that one.');
			delete self.knownHubs[hubUuid];
			self.emit('offline', hub);
			self.emit('update', arrayOfKnownHubs(self.knownHubs));
		}
	});
}


function Explorer(port) {
	debug('Explorer(' + port + ')');
	EventEmitter.call(this);

	this.knownHubs = {};
	this.port = port;
	this.ping = new Ping(this.port);
}
util.inherits(Explorer, EventEmitter);

Explorer.prototype.start = function start() {
	debug('start()');

	this.responseCollector = new ResponseCollector(this.port);
	this.responseCollector.on('response', handleResponse.bind(this));
	this.cleanUpIntervalToken = setInterval(executeCleanUp.bind(this), 5000);

	this.responseCollector.start();
	this.ping.start();
};

Explorer.prototype.stop = function stop() {
	debug('stop()');

	this.ping.stop();
	this.responseCollector.stop();
	clearInterval(this.cleanUpIntervalToken);
};

module.exports = Explorer;
