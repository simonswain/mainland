var argv = require('optimist').argv;

var config = require( '../config.sample.js')(process.env.NODE_ENV);
var api = require('../lib/api.js')(config);

var args = argv._;
var topic = args[0] || 'example';

setInterval(function(){

  var message = {
    at: new Date().getTime(),
    value: Math.floor(Math.random() * 100)
  };

  api.send(
    topic,
    message, 
    function(err){
      console.log('>', topic, message);
    });

}, 10);
