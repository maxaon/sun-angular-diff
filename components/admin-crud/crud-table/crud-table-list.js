/**
 * Created by Maxaon on 6/2/2014.
 */
(function (angular, undefined) {
  var module = angular.module('sun.diff.components.adminCrud');
  module.controller('CrudTableListController', function ($scope, $state, CrudControllerGenerator, crud, config, resource, CrudTableHelpers, MessageBox) {
    var schema = crud.resource.schema;
    var listConfig = config.list;
    var columns = CrudTableHelpers.uniteConfig(listConfig.columns, _.cloneDeep(schema.properties), listConfig.columns['$only'] === true);
    columns = CrudTableHelpers.normalize(columns);

    $scope.schema = schema;
    $scope.tableParams = crud.tableParams;
    $scope.displayColumns = columns;

    $scope.edit = function (row) {
      $state.goResolve($state.current.relatedStates.edit, {row: row}, {id: row.id});
    };
    $scope.remove = function (row) {
      var msg;
      if (row.toString !== Object.prototype.toString)
        msg = row.toString();
      else
        msg = "object " + (row.name || row.id || "");
      MessageBox.show("Are you sure want to delete " + msg, "Delete confirmation", ['Yes', 'No'], 'No').yes(function () {
        row.mngr.remove().then(function () {
          $scope.tableParams.reload();
        });
      });
    };
    $scope.createObject = function () {
      $state.goResolve($state.current.relatedStates.create);
    };
  });
}(angular));