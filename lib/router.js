var Redis = require('redis');

var Router = function(opts){
  this.redis = false;
  this.routes = opts.routes;
  this.topics = Object.keys(this.routes);

  this.lkeys = Object.keys(this.routes);
  this.lkeys.push(1);
  this.running = false;
  this.connect();
};

Router.prototype.connect = function(){
  this.redis = Redis.createClient();
  this.running = true;
};

Router.prototype.quit = function(done){
  this.running = false;
  this.redis.quit();
  return done();
};

Router.prototype.listen = function() {
  var self = this;

  if(!this.running){
    return;
  }

  this.redis.brpop(
    this.lkeys, 
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
      var topic = reply[0];
      if(!(topic in self.routes)){
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
        self.topics.forEach(function(topic){
          self.routes[topic].forEach(function(target){
            self.redis.lpush(
              topic + ':' + target,
              JSON.stringify(msg)
            );
          });
        });

        self.listen();
      }
    });
};

module.exports = Router;
