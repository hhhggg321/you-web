'use strict';

angular.module('concordyaApp')
        .factory('UtilityService', [function () {
            return {
              // get diff between obj1 and obj2
              // obj1 is original obj, obj2 is new obj
              getDiff: function (obj1, obj2) {
                var self = this, diff = null, ret = {};

                // if obj1 and obj2 are different type, return null
                if (typeof obj1 !== typeof obj2) {
                  return null;
                }

                // if they are array
                if (_.isArray(obj1)) {
                  ret = [];
                  for (var i = 0; i < obj2.length; i++) {
                    // first guess they are different
                    var isDiff = true;

                    for (var j = 0; j < obj1.length; j++) {
                      // if they are array or object, get the diff
                      if (_.isObject(obj2[i]) || _.isArray(obj2[i])) {
                        diff = self.getDiff(obj1[j], obj2[i]);
                        // if the diff is empty, return false
                        if (_.isEmpty(diff)) {
                          isDiff = false;
                        }
                      } else {
                        if (obj1[j] === obj2[i]) {
                          isDiff = false;
                        }
                      }
                      // break loop, if they are same
                      if (!isDiff) {
                        break;
                      }
                    }
                    if (isDiff) {
                      ret.push(obj2[i]);
                    }
                  }
                }
                // if they are object
                else if (_.isObject(obj1)) {
                  for (var key in obj2) {
                    if (key.indexOf('$') !== 0) {
                      if (!obj1.hasOwnProperty(key)) {
                        ret[key] = obj2[key];
                      } else {
                        if (obj1[key] !== obj2[key]) {
                          var val = obj2[key];

                          if (_.isArray(val) || _.isObject(val)) {
                            diff = self.getDiff(obj1[key], obj2[key]);
                            if (!_.isEmpty(diff)) {
                              ret[key] = diff;
                            }
                          } else {
                            ret[key] = val;
                          }
                        }
                      }
                    }
                  }
                }
                // else, return null
                else {
                  return null;
                }

                return ret;
              },
              // check params
              checkParams: function ($scope, params) {
                if (!params) {
                  $scope.page.index = 1;
                  params = {
                    'pageIndex': $scope.page.index,
                    'pageSize': $scope.page.size
                  };
                }
                return params;
              },
              map: function (list) {
                return _.map(list, function (item) {
                  return {
                    'id': item,
                    'name': item
                  };
                });
              },
              // watch page.index
              watchPageIndex: function ($scope, fn) {
                var cancelWatchPageIndex = $scope.$watch('page.index', function (newVal, oldVal) {
                  if (newVal !== oldVal) {
                    if (fn) {
                      fn(newVal);
                    }
                  }
                });
                // cancel watch events
                $scope.$on('$stateChangeStart', function () {
                  cancelWatchPageIndex();
                });
              },
              // get selected item
              getSelectedItem: function (list, attr) {
                if (!attr) {
                  attr = 'selected';
                }
                return _.filter(list, function (item) {
                  return item[attr] === true;
                });
              },
              // get selected item
              getSelectedIds: function (list) {
                var ids = [];
                _.forEach(this.getSelectedItem(list), function (item) {
                  ids.push(item.id);
                });
                return ids;
              },
              // trigger selected status
              triggerSelect: function (item, list, attr) {
                if (!attr) {
                  attr = 'selected';
                }
                if (list) {
                  var selectedItems = this.getSelectedItem(list, attr);
                  if (selectedItems.length < list.length) {
                    if (item) {
                      list[attr] = false;
                    } else {
                      _.forEach(list, function (item) {
                        item[attr] = true;
                      });
                    }
                  } else {
                    if (item) {
                      list[attr] = true;
                    } else {
                      _.forEach(list, function (item) {
                        item[attr] = false;
                      });
                    }
                  }
                  if (item) {
                    list.count = selectedItems.length;
                  } else {
                    list.count = list[attr] ? list.length : 0;
                  }
                }
              },
              // add error class for invalid form
              addErrorClass: function (form) {
                $('form[name=' + form.$name + ']').addClass('error-form');
                if (form && form.$setUntouched) {
                  form.$setUntouched();
                }
              },
              // remove error class for invalid form
              removeErrorClass: function (form) {
                $('form[name=' + form.$name + ']').removeClass('error-form');
                if (form && form.$setPristine) {
                  form.$setPristine();
                }
              },
              toDecimal: function(num) {
                return Math.round(num * 100) / 100;
              },
              // add float num, fix js float num precision bug
              floatNumAdd: function() {
                var result = arguments[0],
                  len = arguments.length,
                  i;
                for (i = 1; i < len; i++) {
                  result = ((parseFloat(result) || 0) * 100 + (parseFloat(arguments[i]) || 0) * 100) / 100;
                }
                return Math.round(result*100)/100;
              },
              // subtract float num, fix js float num precision bug
              floatNumSubtract: function() {
                var result = arguments[0],
                  len = arguments.length,
                  i;
                for (i = 1; i < len; i++) {
                  result = ((parseFloat(result) || 0) * 100 - (parseFloat(arguments[i]) || 0) * 100) / 100;
                }
                return Math.round(result * 100 )/100;
              }
            };
          }]);
