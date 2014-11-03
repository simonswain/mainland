"use strict";

var api;
var topic;
var msg;

exports.api = {

  'boot': function(test) {
    test.expect(1);
    var config = require( '../config.sample.js')(process.env.NODE_ENV);
    api = require('../lib/api.js')(config);
    test.equal(api.hasOwnProperty('quit'), true);
    test.done();
    },

  'reset': function(test) {
    api.reset(function(){
      test.done();
    });
  },

  'prep': function(test) {
    topic = 'my-topic';
    msg = {foo: 'bar'};
    test.done();
  },

  // 'take-none': function(test) {
  //   test.expect(1);
  //   api.take(
  //     topic,
  //     function(err, res){
  //       test.equal(typeof res, 'undefined');
  //       test.done();
  //     });
  // },

  // 'send': function(test) {
  //   topic = 'my-topic';
  //   msg = {foo: 'bar'};
  //   api.send(
  //     topic,
  //     msg,
  //     function(){
  //       test.done();
  //     });
  // },

  // 'take-one': function(test) {
  //   test.expect(1);
  //   api.take(
  //     topic,
  //     function(err, res){
  //       test.deepEqual(msg, res);
  //       test.done();
  //     });
  // },

  // 'listen-one': function(test) {
  //   test.expect(1);

  //   msg = {'listen-to':'my-data'};

  //   var listener;

  //   var stopped = function(){
  //     test.done();
  //   };

  //   var handler = function(res, done){
  //     test.deepEqual(msg, res);
  //     listener.stop(stopped);
  //     done();
  //   };

  //   listener = api.listener(topic, handler);
  //   api.send(topic, msg);

  // },

  'route-one-to-two': function(test) {

    //test.expect(1);

    msg = {
      'listen-to': 'my-data'
    };

    var listener1, listener2, router;

    var stopped = function(){
      test.done();
    };

    var count = 0;

    var handler = function(res, done){
      count ++;
      //test.deepEqual(msg, res);
      if(count === 2){
        listener1.stop();
        listener2.stop();
        router.stop(stopped);
      }
      done();
    };

    listener1 = api.listener('topic-one', handler);
    listener2 = api.listener('topic-two', handler);

    router = api.router({
      'source-topic': [
        'topic-one',
        'topic-two'
      ]
    });

    api.send('source-topic', msg);

  },

  'quit': function(test) {
    api.quit(function(){
      test.done();
    });
  }

};
