'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-ui:module', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/module'))
      .withArguments(['moduleName'])
      .withOptions({dynamicUrl: false})
      .withPrompts({dynamicUrl: false})
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'module-name/index.js'
    ]);
  });
});
