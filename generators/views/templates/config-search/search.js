/*@ngInject*/
module.exports = function SearchCtrl($state, config, invoicingApi) {
  var ctrl = this;

  // ========================================
  // interface
  // ========================================
  ctrl.api = invoicingApi;
  ctrl.items = [];
  ctrl.params = {};
  ctrl.go = go;

  // ========================================
  // implementation
  // ========================================
  function go(row) {
    var navState = $state.current.name;
    row.entity.invoicingId = row.entity[config.idName];

    if(navState == config.module.name){
      navState = config.module.name + '.detail.' + config.initialState;
    }

    $state.go(navState, row.entity);
  }
};
