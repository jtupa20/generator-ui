module.exports = ui.module({
  name: '<%= appname %>',
  url: '/<%= url %>',
  views: require('./views'),<% if (appname === 'detail') { %>
  abstract: true,<% } else { %>
  breadcrumbItem: {
    label: '<%= titlename %>'
  },<% if (config) { %>
  services: require('./services'),<% } %><% } %><% if (parentAppname !== 'detail') { %><% if (appname !== 'detail') { %>
  security: {
    //authorization: "CustomerActivities.menu.<%= appname %>"
    authorization: "anonymous"
  },
  menuItem: {
    label: '<%= titlename %>'
  },<% } %>
  resolve: {<% if (config) { %>
    <%= appname %>Api: /*@ngInject*/ function (<%= appname %>Api) {
      return <%= appname %>Api;
    },
    config: function() {
        return require('./config.js');
    },<% } %><% if (parentConfig) { %>
    data: /*@ngInject*/ function ($stateParams, <%= parentAppname %>Api) {
      return <%= parentAppname %>Api.getById($stateParams.<%= parentAppname %>Id);
    }<% } else { %>
    data: /*@ngInject*/ function (api) {
      return <% if (config) { %>{}<% } else { %>api.helper.mock(require('./data.json'))<% } %>;
    }<% } %>
  },<% } %>
  subModules: [
  ]
});
