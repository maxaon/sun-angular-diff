(function (angular) {
    'use strict';
    var module=angular.module("templateCache");
    module.run(['$templateCache', function($templateCache) {
		$templateCache.put('sun.diff.components.adminCrud/crud-table-list.tpl.html','<!-- name="sun.diff.components.adminCrud/crud-table-list.tpl.html" -->\n<div class="col-md-10  col-md-offset-1">\n    <table ng-table="tableParams" show-filter="true" class="table ng-table-rowselected ng-table ">\n        <thead>\n        <tr>\n            <td colspan="{{ displayColumns.length + 2 }}">\n                <button class="btn btn-primary pull-right" ng-click="createObject()">Add new</button>\n            </td>\n        </tr>\n        <tr>\n\n            <th ng-repeat="column in displayColumns"\n                class="text-center sortable"\n                ng-class="{ \'sort-asc\': tableParams.isSortBy(column.name, \'asc\'),\n                                 \'sort-desc\': tableParams.isSortBy(column.name, \'desc\')\n                              }"\n                ng-click="tableParams.sorting(column.name, tableParams.isSortBy(column.name, \'asc\') ? \'desc\' : \'asc\')">\n                {{ column.name | toHuman }}\n            </th>\n            <th width="1%">\n                <span><i class="fa fa-trash-o fa-lg"> </i></span>\n            </th>\n            <th width="1%">\n                <span><i class="fa fa-edit fa-lg"> </i></span>\n            </th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat="row in $data"\n            ng-click="row.$selected = !row.$selected; changeSelection(row)"\n            ng-class="{\'active\': row.$selected}">\n\n\n            <td ng-repeat="column in displayColumns" sortable="column.field" ng-switch="column.inputType">\n                <span ng-switch-when="date">\n                    {{ row[column.name]|date:\'dd.MM.yyyy\' }}\n                </span>\n                <span ng-switch-default="">\n                    {{ row[column.name] }}\n                </span>\n            </td>\n            <td>\n                <a ng-click="remove(row)"><span class="fa fa-trash-o"></span></a>\n            </td>\n            <td>\n                <a ng-click="edit(row)"><span class="fa fa-edit"></span></a>\n            </td>\n        </tr>\n        </tbody>\n        <tfoot>\n        <tr>\n            <td colspan="{{ displayColumns.length +1 }}">\n                <div class="ng-cloak ng-table-pager">\n                    <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right">\n                        <button ng-repeat="count in params.settings().counts" type="button"\n                                ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)"\n                                class="btn btn-default"><span ng-bind="count"></span></button>\n                    </div>\n                    <ul class="pagination ng-table-pagination">\n                        <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"><a\n                                ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a\n                                ng-switch-when="first" ng-click="params.page(page.number)" href=""><span\n                                ng-bind="page.number"></span></a> <a ng-switch-when="page"\n                                                                     ng-click="params.page(page.number)"\n                                                                     href=""><span\n                                ng-bind="page.number"></span></a> <a ng-switch-when="more"\n                                                                     ng-click="params.page(page.number)" href="">\n                            &#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span\n                                ng-bind="page.number"></span></a> <a ng-switch-when="next"\n                                                                     ng-click="params.page(page.number)"\n                                                                     href="">&raquo;</a></li>\n                    </ul>\n                </div>\n            </td>\n        </tr>\n        </tfoot>\n    </table>\n</div>\n<!--</div>-->\n<!--<div ng-show="showEdit" class="row">-->\n<!---->\n<!--</div>-->');
    }]);
}(window.angular));
