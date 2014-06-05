/**
 * Created by Maxaon on 6/2/2014.
 */
(function (angular, undefined) {
  var module = angular.module('sun.diff.components.adminCrud');

  var CREATE = 'create', EDIT = 'edit';

  function CreateController(type) {
    return ["$scope", "$state", "CrudTableHelpers", "crud", "config", "resource", "row",
      function ($scope, $state, CrudTableHelpers, crud, config, resource, row) {
        var schema = crud.resource.schema;
        var formConfig = config[type];
        var fields = CrudTableHelpers.uniteConfig(formConfig.fields, _.cloneDeep(schema.properties), formConfig['$only'] === true);
        fields = CrudTableHelpers.normalize(fields);

        $scope.currentRow = row;
        $scope.fields = fields;
        $scope.dtopened = false;


        $state.current.pageTitle = substituteTags(formConfig.pageTitle);
        $state.current.breadcrumbTitle = substituteTags(formConfig.breadcrumbTitle);

        $scope.saveObject = function () {
          row.mngr.save()
            .then(function () {
              if (type === CREATE) {
                $state.go($state.current.relatedStates.list);
              }
              else {
                $state.go($state.current.relatedStates.list);
              }
            })
            .catch(function (resp) {
              if (resp.status === 400)
                $scope.errors = resp.data;
            });
        };
        $scope.cancelEdit = function () {
          $state.go($state.current.relatedStates.list);
        };
        $scope.resetObject = function () {
          row.mngr.reset();
        };

        function substituteTags(str) {
          return str && str.replace(/{{\s*(.*)\s*}}/, function (match, key) {
            if (key.indexOf(".") > -1) {
              throw Error("Not implemented");
            }
            else {
              return row[key];
            }
          })
        }
      }
    ]
  }

  module.controller('CrudTableCreateController', CreateController(CREATE));
  module.controller('CrudTableEditController', CreateController(EDIT));
  module.controller('testController', ['$scope', function ($scope) {
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };
  }]);

}(angular));