/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 15.10.2013
 * Time: 5:39 PM
 */
(function (angular) {
    'use strict';
    var module = angular.module('general.directives.eatClick', []);
    /**
     * @ngdoc overview
     * @name general.directives.eatClick
     */
    module.directive('eatClick', function () {
        return function (scope, element) {
            $(element).click(function (event) {
                event.stopPropagation();
            });
        }
    });
}(window.angular));