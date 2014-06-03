/**
 * Created by Maxaon on 6/2/2014.
 */
(function (angular, undefined) {
  var module = angular.module('sun.diff.components.adminCrud');
  module.factory('CrudTableHelpers', [function () {
    var CrudTableHelpers = {};
    CrudTableHelpers.filterColumns = function (spec) {
      var include, exclude,
        columns;
      _.forEach(_.pluck(spec, 'show'), function (v) {
        if (v === true) {
          include = true;
        }
        else if (v === false) {
          exclude = true;
        }
      });
      if (include) {
        columns = _.filter(spec, {show: true});
      }
      else if (exclude) {
        columns = _.filter(spec, function (v) {
          return v.show !== false;
        });
      }
      else {
        columns = spec;
      }
      return columns;
    };

    CrudTableHelpers.sortObjectsByPropertyValue = function (objectList, propertyName) {
      var nextIndex;
      var sortedProperties;
      var length;
      var unorderedObjects;
      propertyName = propertyName || 'position';
      sortedProperties = [];
      length = _.keys(objectList).length;
      // Position properties if they have position property and find unordered objects
      unorderedObjects = _.filter(_.map(objectList, function (v) {
        var position;
        if (angular.isDefined(v[propertyName])) {
          position = v[propertyName] < 0 ? v[propertyName] + length : v[propertyName];
          sortedProperties[position] = v;
          sortedProperties[propertyName] = position;
        }
        else {
          return v;
        }
      }));
      // Function to find next empty index
      nextIndex = (function (listOfEmpties) {
        var i = 0;
        return function () {
          while (true) {
            if (!listOfEmpties[i]) {
              return i++;
            }
            i++;
            if (i > listOfEmpties.length) {
              throw new Error('Index out of bounds');
            }
          }
        };
      }(_.map(sortedProperties, angular.isDefined)));
      _.forEach(unorderedObjects, function (el) {
        el[propertyName] = nextIndex();
        sortedProperties[el[propertyName]] = el;
      });
      return sortedProperties;
    };

    CrudTableHelpers.normalizeColumnName = function (columns) {
      return _.map(columns, function (value, key) {
        if (_.isString(value)) {
          value = {name: value};
        }
        if (_.isString(key)) {
          value.name = key;
        }
        return value;
      });
    };

    // Function to make configuration
    CrudTableHelpers.uniteConfig = function (partial, defaults, condition) {
      if (condition) {
        _.forEach(partial, function (v, k) {
          partial[k] = _.defaults(v, defaults[k]);
        });
        return partial;
      }
      else {
        return angular.extend({}, defaults, partial);
      }
    };

    CrudTableHelpers.normalize = function (obj) {
      return CrudTableHelpers.sortObjectsByPropertyValue(CrudTableHelpers.filterColumns(CrudTableHelpers.normalizeColumnName(obj)));
    };

    return CrudTableHelpers;
  }]);
}(angular));