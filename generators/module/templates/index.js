module.exports = ui.module({
  name: '<%= appname %>',
  url: '/<%= url %>',
  breadcrumbItem: {
    label: '<%= titlename %>'
  },
  views: require('./views')<% if (!props.dynamicUrl) { %>,
  resolve: {
    data: /*@ngInject*/ function ($stateParams, api) {
      return {<%= appname %>Id: $stateParams.<%= appname %>Id};
    }
  },
  security: {
    //authorization: "CustomerActivities.menu.<%= appname %>"
    authorization: "anonymous"
  },
  menuItem: {
    label: '<%= titlename %>'
  },
  subModules: [
  ]<% } %>
});
