'use strict';
var hyperstream = require('hyperstream');

module.exports = function () {
  return hyperstream({
    head: {
      _appendHtml: '<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:600,400,300,200|Droid+Sans|PT+Sans+Narrow|Gravitas+One|Droid+Sans+Mono|Droid+Serif|Raleway|Old+Standard+TT"/>'
    }
  });
}
