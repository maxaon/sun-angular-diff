/**
 * Created by Maxaon on 4/7/2014.
 */
(function (angular) {
  'use strict';
  var module = angular.module('sun.diff.components.adminCrud');
  module.config(function ($stateProvider) {
    module.$stateProvider = $stateProvider;
  });
  module.directive('crudTable', function factory() {
    return {
      scope: {
        crud: '=crudTable',
        crudColumns: '=?columns',
        crudOnlyColumns: '=?onlyColumns',
        formConfig: '='
      },
      template: '<div ui-view="viewContent" class="row">View content</div>'
    };
  });


}(angular));