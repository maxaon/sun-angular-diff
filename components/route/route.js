/**
 * Created by Maxaon on 4/11/2014.
 */
(function (angular) {
  'use strict';
  var module = angular.module('sun.diff.components.route', ['ui.router']);
  module.config(function ($provide, $stateProvider) {
    if ($stateProvider.$states === undefined) {
      throw  new Error('ui.router.$stateProvider is not patched!');
    }
    $provide.decorator('$state', ['$delegate', function ($delegate) {
      $delegate.addState = $stateProvider.state.bind($stateProvider);
      $delegate.getNative = function (stateName) {
        if (stateName.indexOf('.') === 0 || stateName.indexOf('^') === 0) {
          throw new Error('Relative to not supported');
        }
        return $stateProvider.$states[stateName];

      };
      $delegate.goResolve = function goResolve(to, resolve, params, options) {
        var state = $delegate.getNative(to);
        if (!state) {
          throw new Error('State "' + to + '" not found');
        }
        var resolveBackup = _.cloneDeep(state.resolve);
        state.resolve = _.assign(state.resolve, resolve, function (a, b) {
          return function () {
            return b;
          };
        });
        return $delegate.go(to, params, options).then(function (pubState) {
          state.resolve = resolveBackup;
          return pubState;
        });
      };
      return $delegate;
    }]);
  });


}(angular));