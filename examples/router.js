var argv = require('optimist').argv;

var config = require( '../config.sample.js')(process.env.NODE_ENV);
var api = require('../lib/api.js')(config);

var args = argv._;
var topic = args[0] || 'example';

var routes = {   
 "example": ["left","middle","right"]
}

var router = api.router(routes);
