/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 13.10.2013
 * Time: 6:10 PM
 */
(function (angular) {
    'use strict';
    var module = angular.module('general.directives.with', []);
    module.directive('with', ['$parse', '$timeout', function ($parse, $timeout) {
        return{
            transclude: true,
            template: "<div ng-transclude> </div>",
            replace: true,
            scope: true,
            link: function (scope, element, attrs) {
                var match = attrs.with.match(/^\s*(.+)\s*as\s*(.+)\s*$/);
                if (!match)
                    throw Error("Expected expression in form of '_expression_ as name' but got '" + attrs.with + "'.")

                var expr = match[1], name = match[2];
                var object = $parse(expr)(scope);
                if ('promise' in object) {
                    object.promise.then(function (response) {
                        scope.$$nextSibling[name] = stringJsonParser(attrs.path, response);
                    });
                }
                else {
                    // using timeout, because transcluded scope is not accessible during link phase
                    $timeout(function () {
                        scope.$$nextSibling[name] = stringJsonParser(attrs.path, object);
                    });
                }
            }
        }
    }])
}(window.angular));