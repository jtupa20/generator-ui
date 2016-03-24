'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-ui:views', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/views'))
      .withOptions({views: ['content', 'ribbon', 'search', 'sidenav']})
      .withPrompts({views: ['content', 'ribbon', 'search', 'sidenav']})
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'views/index.js'
    ]);
  });
});
