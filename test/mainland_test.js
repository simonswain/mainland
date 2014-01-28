"use strict";

var mainland = require('../index.js');

exports['mainland'] = {
  setUp: function(callback) {
    this.__log = console.log;
    console.log = function(){};
    callback();
  },
  tearDown: function(callback) {
    console.log = this.__log;
    callback();
  },
  'exports': function(test) {
    test.expect(1);
    test.equal( typeof mainland, 'object');
    test.done();
  }
};
