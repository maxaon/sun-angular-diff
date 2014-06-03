/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 13.10.2013
 * Time: 6:10 PM
 */
(function (angular) {
    'use strict';
    var module = angular.module('general.directives.advancedInput', []);
    module.directive('advancedInput', [function () {
        return {
            transclude: true,
            restrict: "E",
            templateUrl: "general.directives.advancedInput/template.tpl.html",
            scope: {
                id: "@inputId",
                label: "@"
            }
        };
    }
    ]);
}(window.angular));