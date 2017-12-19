# harmonyhubjs-discover
[![Build Status](https://travis-ci.org/swissmanu/harmonyhubjs-discover.svg)](https://travis-ci.org/swissmanu/harmonyhubjs-discover) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![npm version](https://badge.fury.io/js/harmonyhubjs-discover.svg)](http://badge.fury.io/js/harmonyhubjs-discover) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

`harmonyhubjs-discover` is a Node.JS library which lookups available Logitech Harmony hubs in the local network.


## Installation

```bash
npm install harmonyhubjs-discover --save
```

## Usage

```javascript
var HarmonyHubDiscover = require('harmonyhub-discover')
var discover = new HarmonyHubDiscover(61991)

discover.on('online', function(hub) {
	// Triggered when a new hub was found
	console.log('discovered ' + hub.ip)
})

discover.on('offline', function(hub) {
	// Triggered when a hub disappeared
	console.log('lost ' + hub.ip)
})

discover.on('update', function(hubs) {
	// Combines the online & update events by returning an array with all known
	// hubs for ease of use.
	var knownHubIps = hubs.reduce(function(prev, hub) {
			return prev + (prev.length > 0 ? ', ' : '') + hub.ip
		}, '')

	console.log('known ips: ' + knownHubIps)
})

// Look for hubs:
discover.start()

// Stop looking for hubs:
// discover.stop()
```

## Control your hub

After looking up your Harmony hub, use [harmonyhubjs-client](https://github.com/swissmanu/harmonyhubjs-client) to control it.


## Debug Traces

`harmonyhubjs-discover` uses [debug](https://github.com/visionmedia/debug) for generating traces throughout its execution time. Activate them by setting the `DEBUG` environment variable:

	$ DEBUG=harmonyhubjs:discover:* node myharmonyjsapp.js

## Contribution

The `master` branch contains the latest stable release of the application.
Development efforts are integrated with the `develop` branch first. Changes get then merged into `master` as soon as a new release should be published.

When opening a new Pull Request make sure you point them to `develop`. Further ensure that your code follows [standard-js](http://standardjs.com/) style guidelines and you make use of proper commit messages. `harmonyhubjs-discover` loves [Commitizen](http://commitizen.github.io/cz-cli/), so take a look there and use `git cz` for the most simple workflow :-)

Thank you for your contribution!

## License

Copyright (c) 2014 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
