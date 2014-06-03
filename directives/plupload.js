/**
 * Created with PyCharm.
 * Author: Peter Kicenko
 * Date: 13.10.2013
 * Time: 6:09 PM
 */
(function (angular) {
    'use strict';
    var module = angular.module('general.directives.plupload', []);
    module.directive('plupload', ['$log', '$q', function ($log, $q) {
        return {
            transclude: true,
            template: "<div ng-transclude></div>",
            scope: {
                plupload: '=plupload',
                configuration: "=",
                broseButtonId: "@",
                eventSuffix: "@"
            },
            link: function pluploadDirectiveLink(scope, element, attrs) {
                if (scope.configuration.promise != undefined) {
                    scope.configuration.promise.then(function (response) {
                        scope.configuration = response.data;
                        pluploadDirectiveLink(scope, element, attrs);
                    }, function () {
                        throw new Error("Error in configuration getter")
                    });
                    return;
                }
                scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof(fn) === 'function')) {
                            fn(this);
                        }
                    } else {
                        this.$apply(fn);
                    }
                };


                var uploader_conf = scope.configuration['PLUPLOAD_CFG'];
                var suff = scope.eventSuffix || "";
                uploader_conf['browse_button'] = scope.broseButtonId;
                uploader_conf['container'] = undefined;

                var uploader = new plupload.Uploader(uploader_conf);
                uploader.bind("Init", function (up, params) {
                    $log.debug("Current plupload runtime: " + params.runtime);
                });
                uploader.bind("FilesAdded", function (uploader, files) {
                    scope.safeApply(function (scope) {
                        scope.$emit('files-add' + suff, files);
                    });
                });
                uploader.bind("UploadProgress", function (uploader, file) {
                    scope.safeApply(function (scope) {
                        scope.$emit('upload-progress' + suff, {file: file, files: uploader.files, total: uploader.total});
                    });
                });
                uploader.bind("QueueChanged", function (uploader) {
                    scope.safeApply(function (scope) {
                        scope.$emit('queue-changed' + suff, { files: uploader.files, total: uploader.total});
                    });
                });
                var uploadDeferred;
                uploader.bind("UploadComplete", function (uploader, files) {
                    scope.safeApply(function (scope) {
                        uploadDeferred && uploadDeferred.resolve({ files: uploader.files, total: uploader.total});
                        uploadDeferred = null;
                        scope.$emit('upload-complete' + suff, { files: uploader.files, total: uploader.total});
                    });
                });
                scope.plupload = scope.plupload || {};
                scope.plupload['upload'] = function () {
                    uploadDeferred = uploadDeferred || $q.defer();
                    var promise = uploadDeferred.promise;
                    if (uploader.files.length && uploader.state != plupload.STARTED)
                        uploader.start();
                    else if (uploader.state == plupload.DONE || uploader.state == plupload.STOPPED) {
                        uploadDeferred.resolve();
                        uploadDeferred = null;
                    }
                    return promise;
                };
                scope.plupload['removeFile'] = function (file) {
                    return uploader.removeFile(file);
                };

                uploader.init();

            }
        }
    }])
}(window.angular));