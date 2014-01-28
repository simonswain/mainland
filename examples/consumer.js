var argv = require('optimist').argv;

var Consumer = require('../index').Consumer;

var topic = argv.topic || 'samples';

var consumer = new Consumer(
  topic, 
  function(msg, done){
    console.log(topic, msg);
    done();
  });

consumer.listen();
