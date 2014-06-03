/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 25.11.2013
 * Time: 2:27 PM
 */
(function (angular) {
    'use strict';
    var module = angular.module('general.directives.srefActive', []);
    module.directive("srefActive", ["$rootScope", function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                var state = element.find("[ui-sref]").attr("ui-sref"),
                    className = attrs.srefActive || "active";
                state = state && state.match(/^(.*?)(?:\((.*?)\))?$/);
                if (!state)
                    throw Error("ui sref not found");
                var stateName = state[1],
                    stateParams = state[2] && scope.$eval(state[2]);
                if (stateParams)
                    throw  new Error("State params not implemented");

                scope.$on("$stateChangeSuccess", function (event, toState, toParams) {
                    if (toState.name == stateName)
                        element.addClass(className);
                    else
                        element.removeClass(className);
                })

            }
        }
    }])
}(window.angular));