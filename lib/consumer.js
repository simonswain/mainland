var Redis = require('redis');

var Consumer = function(topic, handler, opts){
  
  this.topic = topic;
  this.handler = handler;
  opts = opts || {};
  this.redis = false;
  this.running = false;
  this.connect();
};

Consumer.prototype.connect = function(){
  this.redis = Redis.createClient();
  this.running = true;
};

Consumer.prototype.quit = function(done){
  this.running = false;
  this.redis.quit();
  return done();
};

Consumer.prototype.listen = function() {
  var self = this;

  if(!this.running){
    return;
  }

  this.redis.brpop(
    [this.topic, 1], 
    function(err, reply){
      if(err){
        setTimeout(self.listen, 1000);
        return;
      }
      if (!reply){
        // brpop timed out
        self.listen();
        return;
      }
      var msg = false;
      if(!err){
        try {
          msg = JSON.parse(reply[1]);
        } catch (e) {
          // bad json
          self.listen();
          return;
        }
        self.handler(msg, function(err){
          self.listen();
        });
      }
    });
};

module.exports = Consumer;

