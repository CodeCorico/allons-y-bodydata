'use strict';

var path = require('path');

require(path.resolve(__dirname, 'models/bodydata-service.js'))();

module.exports = function($done) {
  $done();
};
