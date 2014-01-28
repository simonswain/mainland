var Producer = require('../index').Producer;

var topic = 'samples'
var producer = new Producer(topic);

setInterval(function(){

  var message = {
    "foo" :  "bar " + new Date()
  };

  producer.send(
    message, 
    function(err){
      console.log(topic, message);
    });

}, 1000);
