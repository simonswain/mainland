var Redis = require('redis');

var Producer = function(topic, opts){
  this.topic = topic;
  opts = opts || {};
  this.redis = false;
  this.connect();
};

Producer.prototype.connect = function(){
  this.redis = Redis.createClient();
};

Producer.prototype.quit = function(done){
  this.redis.quit();
  if(done){
    done();
  }
};

Producer.prototype.send = function(message, next){

  var self = this;

  this.redis.lpush(
    this.topic, 
    JSON.stringify(message),
    function(err){
      if(err){
        console.log(err);
      }
      // console.log(
      //   'send: ' + self.topic, 
      //   JSON.stringify(message)
      // );
      next();
    });
  

};

module.exports = Producer;

