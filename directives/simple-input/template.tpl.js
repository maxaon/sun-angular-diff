(function (angular) {
    'use strict';
    var module=angular.module("templateCache");
    module.run(['$templateCache', function($templateCache) {
		$templateCache.put('general.directives.simpleInput/template.tpl.html','<div class="form-group" ng-class="formClass">\n\n    <label for="[[id]]"\n           ng-class="noLabel && \'sr-only\' "\n           class="control-label col-md-3"\n            >\n        [[label]]\n    </label>\n\n    <div ng-class="noLabel||\'col-md-9\'">\n\n        <select class="form-control"\n                name="[[name]]"\n                ng-model="ngModel"\n                ng-options="kv.0 as kv.1 for kv in flatOptions"\n                id="[[id]]"\n                >\n            <option value="" ng-if="allowEmpty">[[emptyLabel]]</option>\n        </select>\n        <input\n                name="[[name]]"\n                class="form-control" type="[[type]]" id="[[id]]" placeholder="[[label]]"\n                ng-model="ngModel">\n        \n        <span class="help-block">{{ helpText }}</span>\n    </div>\n</div>\n');
    }]);
}(window.angular));
