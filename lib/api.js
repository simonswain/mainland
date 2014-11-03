"use strict";

var _ = require('underscore');
var async = require('async');
var Redis = require('redis');

module.exports = function(opts){

  opts = opts || {};

  var TIMEOUT = 50;

  var env = process.env.NODE_ENV || 'development';

  if(!opts.redis){
    opts.redis = {
      host: '127.0.0.1',
      port: 6379,
    };
  }

  if(!opts.prefix){
    opts.prefix = 'mb:' + env;
  }

  var redis = Redis.createClient(
    opts.redis.port,
    opts.redis.host
  );

  var makeKey = function(topic){
    return opts.prefix + ':' + topic;
  };

  var api = {};

  // cleanup for exit
  api.quit = function(next) {
    redis.quit();
    next();
  };

  // clear all messages from all queues
  api.reset = function(done) {

    var clearQueues = function(next){

      // get all tokens and delete
      var key = opts.prefix + ':*';

      redis.keys(
        key, 
        function(err, list){

          if(err){
            return next(err);
          }

          if(!list) {
            return next();
          }

          var delQueue = function(queue, cb){
            redis.del(queue, function(err) {
              return cb();
            });
          };

          async.eachSeries(list, delQueue, next);
        });

    };

    async.series(
      [clearQueues],
      done
    );

  };

  // clear all messages from a given topic
  api.purge = function(topic, done) {
    var key = makeKey(topic);  
    redis.del(
      key, 
      done
    );
  };


  // inject a message in to the queue
  api.send = function(topic, data, done){

    if(!done){
      done = function(){};
    }

    var message = {
      topic: topic,
      at: new Date().getTime(),
      data: data
    };

    var key = makeKey(topic);

    redis.lpush(
      key,
      JSON.stringify(message),
      function(err){
        return done();
      });

  };


  // take one message (if any) off topic queue
  api.take = function(topic, done){

    var key = makeKey(topic);

    redis.rpop(
      key,
      function(err, reply){

        var msg;

        if(err){
          return done(err);
        }

        if(!reply){
          return done(err);
        }

        try {
          msg = JSON.parse(reply);
        } catch (e) {
          return done(e);
        }

        return done(null, msg.data);
      });

  };


  api.listener = function(topic, handler) {

    var stopped, onStop;

    var stop = function(cb){
      stopped = true;
      if(!cb){
        cb = function(){};
      }
      onStop = cb;
    };

    var key = makeKey(topic);

    var listen = function(){

      if(stopped){
        return onStop();
      }

      redis.brpop(
        [key, 1], 
        function(err, reply){
          var msg;

          if(err){
            setTimeout(listen, opts.timeout);
            return;
          }

          if (!reply){
            // brpop timed out
            listen();
            return;
          }

          try {
            msg = JSON.parse(reply[1]);
          } catch (e) {
            // bad json
            listen();
            return;
          }

          handler(msg.data, function(){
            listen();
          });

        });
    };

    process.nextTick(listen);

    return {
      stop: stop
    };

  };



  api.router = function(routes) {

    var topics = Object.keys(routes);
    var lkeys = _.map(topics, function(topic){
      return makeKey(topic);
    });
    lkeys.push(1);

    var stopped, onStop;

    var stop = function(cb){
      stopped = true;
      if(!cb){
        cb = function(){};
      }
      onStop = cb;
    };

    var listen = function(){

      if(stopped){
        return onStop();
      }

      redis.brpop(
        lkeys, 
        function(err, reply){
          var topic, msg;

          if(err){
            setTimeout(listen, opts.timeout);
            return;
          }

          if (!reply){
            // brpop timed out
            listen();
            return;
          }

          try {
            msg = JSON.parse(reply[1]);
          } catch (e) {
            // bad json
            listen();
            return;
          }

          topic = msg.topic;

          routes[topic].forEach(function(target){
            // need to makeKey and direct inject to the list so the
            // at: gets preserved. Note that here we're lpushing the
            // msg, not data

            var key = makeKey(target);

            msg.topic = target;
            
            redis.lpush(
              key,
              JSON.stringify(msg)
            );
          });

          listen();

        });
    };

    process.nextTick(listen);

    return {
      stop: stop
    };

  };



  return api;

};
