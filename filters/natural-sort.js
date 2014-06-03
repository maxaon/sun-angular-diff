(function (angular) {
  'use strict';
  var module = angular.module('sun.diff.filters.naturalSort', []);

  module.filter('natSort', function ($parse) {
    return function (array, sortPredicate, reverseOrder) {
      var strCache = {};
      if (!angular.isArray(array)) return array;
      if (!sortPredicate) return array;
      sortPredicate = angular.isArray(sortPredicate) ? sortPredicate : [sortPredicate];
      sortPredicate = _.map(sortPredicate, function (predicate) {
        var descending = false, get = predicate || identity;
        if (angular.isString(predicate)) {
          if ((predicate.charAt(0) === '+' || predicate.charAt(0) === '-')) {
            descending = predicate.charAt(0) === '-';
            predicate = predicate.substring(1);
          }
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            return reverseComparator(function (a, b) {
              return compare(a[key], b[key]);
            }, descending);
          }
        }
        return reverseComparator(function (a, b) {
          return compare(get(a), get(b));
        }, descending);
      });
      var arrayCopy = [];
      for (var i = 0; i < array.length; i++) {
        arrayCopy.push(array[i]);
      }
      var sorted = arrayCopy.sort(reverseComparator(comparator, reverseOrder));
      return sorted;

      function parseStr(str) {
        if (typeof  str !== 'string')
          return [str];
        if (strCache[str] === undefined) {
          strCache[str] = _.map(str.match(/\d+[.,]\d+|\d+|([^\d]{1,})/g), function (value) {
            var number = Number(value);
            return isNaN(number) ? value : number;
          });
        }
        return strCache[str];
      }


      function comparator(o1, o2) {
        for (var i = 0; i < sortPredicate.length; i++) {
          var comp = sortPredicate[i](o1, o2);
          if (comp !== 0) return comp;
        }
        return 0;
      }

      function reverseComparator(comp, descending) {
        return !toBoolean(descending) ?
            comp :
            function (a, b) {
              return comp(b, a);
            };
      }


      function compareArrays(a1, a2) {
        var n1 = a1.length;
        var n2 = a2.length;
        for (var i = 0, n = n1 > n2 ? n1 : n2; i < n; i++) {
          if (a1[i] === a2[i]) {
            continue;
          }
          return a1[i] < a2[i] ? -1 : 1;

        }
        return 0;
      }


      function compare(v1, v2) {
        var t1 = typeof v1;
        var t2 = typeof v2;
        if (t1 === t2) {
          if (t1 === 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          if (v1 === v2) {
            return 0;
          }
          return compareArrays(parseStr(v1), parseStr(v2));
        } else {
          return t1 < t2 ? -1 : 1;
        }
      }

      function lowercase(string) {
        return typeof string === 'string' ? string.toLowerCase() : string;
      }

      function toBoolean(value) {
        if (typeof value === 'function') {
          value = true;
        } else if (value && value.length !== 0) {
          var v = lowercase('' + value);
          value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
        } else {
          value = false;
        }
        return value;
      }


    };

  })
}(angular));