(function (angular) {
    'use strict';
    var module=angular.module("templateCache");
    module.run(['$templateCache', function($templateCache) {
		$templateCache.put('general.directives.advancedInput/template.tpl.html','<div class="form-group">\n    <label class="control-label col-md-3" for="[[id]]">[[label]]</label>\n\n    <div class="col-md-9" ng-transclude>\n    </div>\n</div>');
    }]);
}(window.angular));
