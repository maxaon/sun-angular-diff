(function (angular) {
    'use strict';
    var module=angular.module("templateCache");
    module.run(['$templateCache', function($templateCache) {
		$templateCache.put('sun.diff.components.messageBox/message-box.tpl.html','<div class="modal-header" ng-class="view.headerClass">\n    <h3 class="modal-title">{{ caption }}</h3>\n</div>\n<div class="modal-body" ng-bind-html="message">\n</div>\n<div class="modal-footer">\n    <div class="btn-group">\n        <button ng-repeat="button in buttons"\n                class="btn " ng-click="pressed(button)"\n                ng-class="button==defaultButton && \'btn-primary\'"\n                >\n            {{ button | translate }}\n        </button>\n    </div>\n</div>');
    }]);
}(window.angular));
