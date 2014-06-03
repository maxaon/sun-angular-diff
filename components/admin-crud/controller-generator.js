/**
 * Created by Maxaon on 4/7/2014.
 */
(function (angular) {
  'use strict';
  var adminCrud = angular.module('sun.diff.components.adminCrud', [
    'ngTable',
    'sun.diff.filters.textFormatter',
    'sun.diff.filters.naturalSort',
    'sun.diff.components.route',
    'ui.router',
    'ui.bootstrap.buttons',
    'ui.bootstrap.modal',
    'sun.diff.components.messageBox'
  ]);
  adminCrud.provider('CrudControllerGenerator', function ($stateProvider) {
    function genName(state) {
      var name = _.isString(state) ? state : state.name;
      return {
        list: name + 'List',
        edit: name + 'Edit',
        create: name + 'Create'
      };
    }

    this.genName = genName;
    this.register = function (parentState, config) {
      var resourceName = config.resourceName;
      if (!resourceName) {
        throw new Error('Resource name is not supplied');
      }
      var states = {base: parentState};
      var names = genName(parentState);
      var baseResolve = {
        crud: function (CrudControllerGenerator) {
          return CrudControllerGenerator.get(resourceName);
        },
        config: function () {
          return config;
        },
        resource: resourceName
      };

      parentState.abstract = true;
      states.list = {
        name: names.list,
        relatedStates: names,
        parent: parentState.name,
        url: '',
        resolve: baseResolve,
        views: {
          viewContent: {
            templateUrl: 'sun.diff.components.adminCrud/crud-table-list.tpl.html',
            controller: 'CrudTableListController'
          }
        }
      };
      states.create = {
        name: names.create,
        url: '/create',
        relatedStates: names,
        parent: parentState.name,
        resolve: _.extend({}, baseResolve, {
          row: function ($stateParams, $injector) {
            var resource = $injector.get(resourceName);
            return new resource.model();
          }
        }),
        views: {
          viewContent: {
            templateUrl: 'sun.diff.components.adminCrud/crud-table-object.tpl.html',
            controller: 'CrudTableCreateController'
          }
        }
      };
      states.edit = {
        name: names.edit,
        url: '/:id',
        relatedStates: names,
        parent: parentState.name,
        resolve: _.extend({}, baseResolve, {
          row: function ($stateParams, $injector) {
            var resource = $injector.get(resourceName);
            return resource.find($stateParams.id).$promise.then(function (respond) {
                return respond.resource;
              }
            );
          }
        }),
        views: {
          viewContent: {
            templateUrl: 'sun.diff.components.adminCrud/crud-table-object.tpl.html',
            controller: 'CrudTableEditController'
          }
        }
      };
      _.forEach(states, function (value) {
        value.merge = function (ex) {
          _.merge(value, ex);
          return states;
        };
      });
      states.register = function () {
        $stateProvider
          .state(states.base)
          .state(states.list)
          .state(states.create) // Create route should be first
          .state(states.edit);
      };
      return states;
    };

    this.$get = function ($filter, $state, $injector, ngTableParams) {
      var cache = {};
      var Crud = function (resource) {
        this.resource = resource;
        var promise;


        this.tableParams = new ngTableParams(
          {
            page: 1,            // show first page
            count: 10          // count per page
          },
          {
            total: 0,           // length of data
            getData: function ($defer, params) {
              promise = resource.find().$promise;
              promise.then(function (response) {
                var filterBy, orderedData, data, orderBy;
                orderBy = params.orderBy();
                filterBy = params.filter();

                data = response.resource;
                orderedData = !_.isEmpty(params.sorting()) ?
                  $filter('natSort')(data, orderBy) :
                  data;
                orderedData = !_.isEmpty(filterBy) ?
                  $filter('filter')(orderedData, filterBy) :
                  orderedData;

                params.total(orderedData.length); // set total for recalc pagination

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          }
        );

      };
      Crud.get = function (resourceName) {
        if (!cache[resourceName]) {
          var resource = $injector.get(resourceName);
          cache[resourceName] = new Crud(resource);
        }
        return cache[resourceName];
      };

      Crud.genName = genName;
      return Crud;
    };
  });
}(angular));