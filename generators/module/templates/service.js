/*@ngInject*/
module.exports = function <%= appname %>Api(apiHelper, apiCache, config, $q) {
  var self = this;

  // ========================================
  // interface
  // ========================================

  self.getById = getById;
  self.find = find;
  self.findAll = findAll;
  self.save = save;

  // ========================================
  // implementation
  // ========================================

  function getById(id) {
    var map = {};
    map[config.idName] = id;

    return self.find(map);
  }

  function find(params) {
    // return apiHelper.http(apiHelper.url(self.itemConfig.endpoint, params));
    return $q.resolve( require('./find.json') );
  }

  function findAll(params) {
    // return apiHelper.http(apiHelper.url(self.itemConfig.endpoint) + '/filter', {data: params});
    return $q.resolve( require('./findAll.json') );
  }

  function save(item) {
    if (item[self.itemConfig.primaryKey]) {
      return apiHelper.http(apiHelper.url(self.itemConfig.endpoint, item), {data: item});
    } else {
      return apiHelper.http(apiHelper.url(self.itemConfig.endpoint), {method: 'PUT', data: item});
    }
  }
};
