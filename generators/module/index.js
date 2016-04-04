'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('appname', {type: String, required: true});
    // And you can then access it later on this way; e.g. CamelCased
    this.appname = _.camelCase(this.appname);
    this.dashname = _s.dasherize(this.appname);
    this.titlename = _s.titleize(_s.humanize(this.appname));
    this.url = this.dashname;
    // This method adds support for a `--config` flag
    this.option('config');
    // And you can then access it later on this way; e.g.
    this.config = (this.options.config ? 1: 0);
    this.parentConfig = this.fs.exists('./config.js');

    if (this.fs.exists('./index.js')) {
      this.parentIndex = this.fs.read('./index.js');
      var re = new RegExp(/\bname\W+'\b\w+/g).exec(this.parentIndex);
      if (re) {
        this.parentAppname = re.toString().match(/'([^']+)/)[1];
      }
    }

  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the bee\'s knees ' + chalk.red('generator-ui') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'dynamicUrl',
      message: 'Would you like to enable a parameter "id"?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.dynamicUrl;

      done();
    }.bind(this));
  },

  writing: function () {
    if (this.props.dynamicUrl) {
      if(this.appname === 'detail'){
        this.url = '{' + this.parentAppname + 'Id:int}';
      } else {
        this.url = '{' + this.appname + 'Id:int}';
      }
    }
    if (this.config) {
      this.fs.copyTpl(
        this.templatePath('./config.js'),
        this.destinationPath('./' + this.dashname + '/config.js'),
        {
          appname: this.appname
        }
      );
      this.fs.copyTpl(
        this.templatePath('./services.js'),
        this.destinationPath('./' + this.dashname + '/services/index.js'),
        {
          dashname: this.dashname
        }
      );
      this.fs.copyTpl(
        this.templatePath('./service'),
        this.destinationPath('./' + this.dashname + '/services/' + this.dashname),
        {
          appname: this.appname,
          dashname: this.dashname
        }
      );
      this.fs.copyTpl(
        this.templatePath('./service.js'),
        this.destinationPath('./' + this.dashname + '/services/' + this.dashname + '/' + this.dashname + '.js'),
        {
          appname: this.appname
        }
      );
    } else {
      this.fs.copy(
        this.templatePath('./data.json'),
        this.destinationPath('./' + this.dashname + '/data.json')
      );
    }
    this.fs.copyTpl(
      this.templatePath('./index.js'),
      this.destinationPath('./' + this.dashname + '/index.js'),
      {
        appname: this.appname,
        url: this.url,
        props: this.props,
        titlename: this.titlename,
        config: this.config,
        parentAppname: this.parentAppname,
        parentConfig: this.parentConfig
      }
    );
    this.fs.copy(
      this.templatePath('./views/index.js'),
      this.destinationPath('./' + this.dashname + '/views/index.js')
    );
    if (this.fs.exists('./index.js')) {
      var content = this.fs.read('./index.js').toString()
        , lines = content.split('\n')
        , needle = "  ]"
        , splicable = ['require(\'./' + this.dashname + '\')'];

      var otherwiseLineIndex = 0;
      lines.forEach(function (line, i) {
        if (line.indexOf(needle) !== -1) {
          otherwiseLineIndex = i;
        }
      });

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

      this.fs.write(this.destinationPath('./index.js'), content);

    }
  },

  install: function () {
    this.installDependencies();
  }
});
