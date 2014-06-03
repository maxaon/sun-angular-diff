/**
 * Created by Maxaon on 4/8/2014.
 */
(function (angular) {
  'use strict';
  var module = angular.module('sun.diff.filters.textFormatter', []);
  module.filter('toHuman', function ($filter) {
    return function (input, type) {
      if (!input) {
        return input;
      }
      if (_.isNumber(input)) {
        input = '' + input;
      }
      if (!type) {
        if (input.indexOf('_') > -1) {
          type = 'underscore';
        }
        else {
          type = 'camelCase';
        }
      }
      return $filter(type + 'ToHuman')(input);
    };
  });
  module.filter('underscoreToHuman', function () {
    return function (input) {
      if (!input) {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substr(1).replace(/_/g, ' ');
    };
  });
  module.filter('camelCaseToHuman', function () {
    return function (input) {
      if (!input) {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&').toLowerCase();
    };
  });

}(angular));