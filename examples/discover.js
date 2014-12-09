var Explorer = require('../lib/explorer')
	, explorer = new Explorer(61991);

explorer.on('online', function(hub) {
	console.log('discovered ' + hub.ip);
});

explorer.on('offline', function(hub) {
	console.log('lost ' + hub.ip);
});

explorer.start();