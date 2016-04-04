/*@ngInject*/
module.exports = function SearchCtrl($state, <% if (config) { %>config, <%= appname %>Api<% } else { %>api, data<% } %>) {
  var ctrl = this;

  // ========================================
  // interface
  // ========================================
  ctrl.api = <% if (config) { %><%= appname %>Api<% } else { %>api<% } %>;
  ctrl.items = [];
  ctrl.params = {};
  ctrl.go = go;

  // ========================================
  // implementation
  // ========================================
<% if (!config) { %>
  // temporarily provide a findAll method for search
  api.findAll = function findAll() {
    return api.helper.mock(data);
  };<% } %>


  function go(row) {
    var navState = $state.current.name;
    row.entity.<%= appname %>Id = row.entity['id'];

    if(navState.indexOf('detail') === -1) {
      navState = navState + '.detail.<% if (config) { %>' + config.initialState<% } else { %>info'<% } %>;
    }

    $state.go(navState, row.entity);
  }
};
