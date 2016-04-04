'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');

var Generator = module.exports = yeoman.generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.appname = "moduleName";
    if (this.fs.exists('./index.js')) {
      this.config = this.fs.read('./index.js');
      var re = new RegExp(/\bname\W+'\b\w+/g).exec(this.config);
      if (re) {
        this.appname = re.toString().match(/'([^']+)/)[1];
      }
    }

    // And you can then access it later on this way; e.g. CamelCased
    this.appname = _.camelCase(this.appname);
    this.dashname = _s.dasherize(this.appname);
    this.titlename = _s.titleize(_s.humanize(this.appname));
    this.url = this.dashname;
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wonderful ' + chalk.red('generator-ui') + ' generator!'
    ));

    var prompts = [{
      type: 'checkbox',
      name: 'views',
      message: 'Select views:',
      choices: [{name: 'content', checked: true}, 'ribbon', 'search', 'sidenav'],
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one view.';
        }
        return true;
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.views;

      done();
    }.bind(this));
  },

  writing: function () {
    this.config = (this.fs.exists('./config.js') ? 1: 0);

    for (var i = 0, len = this.props.views.length; i < len; i++) {
      this.fs.copyTpl(
        this.templatePath('./' + this.props.views[i]),
        this.destinationPath('./views/' + this.props.views[i]),
        {
          appname: this.appname,
          titlename: this.titlename,
          config: this.config
        }
      );
    }

    if (this.fs.exists('./views/index.js')) {
      var views = this.props.views
        , content = this.fs.read('./views/index.js').toString()
        , lines = content.split('\n')
        , needle = "/* end */"
        , splicable = [];

      var otherwiseLineIndex = 0;
      lines.forEach(function (line, i) {
        for (var j = 0, len = views.length; j < len; j++) {
          if (line.indexOf(views[j]) !== -1) {
            views.splice(j, 1);
          }
        }
        if (line.indexOf(needle) !== -1) {
          otherwiseLineIndex = i;
        }
      });

      if (!views.length < 1) {
        for (var i = 0, len = views.length; i < len; i++) {
          splicable.push(views[i] + ": require('./" + views[i] + "')" + (i + 1 < len ? ',' : ''));
        }

        var spaces = 0;
        while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
          spaces += 1;
        }

        var spaceStr = '';
        while ((spaces -= 1) >= 0) {
          spaceStr += ' ';
        }

        var line = lines[otherwiseLineIndex - 1];
        if (line.charAt(line.length - 1) === ")") {
          lines[otherwiseLineIndex - 1] = line + ",";
        }
        ;

        lines.splice(otherwiseLineIndex, 0, splicable.map(function (line) {
          return spaceStr + line;
        }).join('\n'));
        content = lines.join('\n');
      }
      this.fs.write(this.destinationPath('./views/index.js'), content);

    } else {
      this.fs.copyTpl(
        this.templatePath('./index.js'),
        this.destinationPath('./views/index.js'),
        {views: this.props.views}
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
