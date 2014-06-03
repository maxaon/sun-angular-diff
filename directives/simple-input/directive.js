/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 13.10.2013
 * Time: 6:09 PM
 */
(function (angular) {
  'use strict';
  var module = angular.module('general.directives.simpleInput', ['pascalprecht.translate', 'general.filter.underscoreToWords']);
  module.directive('simpleInput', ['$filter', '$translate', function ($filter, $translate) {
    var labelFilter = $filter('underscoreToWords');
    return {
      templateUrl: "general.directives.simpleInput/template.tpl.html",
      restrict: "E",
      scope: {
        ngModel: "="
      },
      compile: function compile(tElement, tAttrs, transclude) {
        var el = tElement[0];
        var attrs = el.attributes, attr;
        var res_attr = {};
        for (var i = 0; i < attrs.length; i++) {
          attr = attrs[i];
          if (attr.name.indexOf('in-') == 0)
            res_attr[attr.name] = attr.value;
        }

        var destEl;
        var inputContainer = el.getElementsByTagName('div')[1];
        var types = {
          select: inputContainer.getElementsByTagName('select')[0],
          input: inputContainer.getElementsByTagName('input')[0]
        };
        destEl = types.input;
        if (tAttrs.type && tAttrs.type === 'select') {
          destEl = types.select;
          if (tAttrs['objectOptions']) {
            destEl.setAttribute('ng-options', 'key as value for (key,value) in $parent.' + tAttrs['objectOptions'])
          }
          if (tAttrs['flatOptions']) {
            destEl.setAttribute('ng-options', 'kv.0 as kv.1 for kv in $parent.' + tAttrs['flatOptions'])
          }
        }
        for (var name in types) {
          if (!types.hasOwnProperty(name) || destEl === types[name])
            continue;
          types[name].parentNode.removeChild(types[name]);
        }
        _.forEach(res_attr, function (val, key) {
          el.removeAttribute(key);
          destEl.setAttribute(key.slice(3), val);
        });
        return function (scope, element, attrs) {
          scope.allowEmpty = (typeof scope.allowEmpty !== 'undefined' ? scope.allowEmpty : true);
          scope.emptyLabel = attrs.emptyLabel || "--------";
          scope.label = attrs.label || $translate(labelFilter(attrs.ngModel.slice(attrs.ngModel.lastIndexOf(".") + 1)));
          scope.type = attrs.type || 'text';
          scope.name = attrs.name || attrs.ngModel;
          scope.id = attrs.inputId || (attrs.id && "input-" + attrs.id) || "input-" + scope.label;
          scope.noLabel = attrs.noLabel !== undefined;
          var opts = [
            ['True', 'Hidden'],
            ['False', 'Not hidden']
          ]
        }

      }
    }
  }
  ])
}(window.angular));