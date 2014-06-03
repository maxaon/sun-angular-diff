/**
 * Created by Maxaon on 6/2/2014.
 */
(function (angular, undefined) {
  var module = angular.module('sun.diff.components.messageBox', [
    'ui.bootstrap.modal',
    "template/modal/backdrop.html",
    "template/modal/window.html"
  ]);
  module.factory("MessageBox", function ($modal, $q) {
    function show(message, caption, buttons, defaultButton, view) {
      function normalizeName(button) {
        return button.toLocaleLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
      }

      if (_.isArray(buttons) && buttons.length < 1)
        throw new Error("At least one button must be provided");
      buttons = buttons || ['Ok'];
      defaultButton = defaultButton || buttons[0];
      var modal = $modal.open({
        templateUrl: "sun.diff.components.messageBox/message-box.tpl.html",
        controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
          $scope.message = message;
          $scope.caption = caption;
          $scope.buttons = buttons;
          $scope.defaultButton = defaultButton;
          $scope.view = view;
          $scope.pressed = function (button) {
            $modalInstance.close(button);

          }
        }]
      });
      var deffereds = {};
      _.forEach(buttons, function (button) {
        var name = normalizeName(button);
        var deferred = $q.defer();
        modal[name] = deferred.promise.then;
        deffereds[name] = deferred;
      });
      modal.result.then(function (pressedButton) {
        var name = normalizeName(pressedButton);
        deffereds[name].resolve(pressedButton);
        return pressedButton;
      });
      return modal;
    }

    return {
      show: show,
      error: function (message, caption, buttons, defaultButton, view) {
        return show(message, caption || "Error!", buttons || ['Ok'], defaultButton, {headerClass: "bg-red"})
      },
      warning: function (message, caption, buttons, defaultButton, view) {
        return show(message, caption || "Error!", buttons || ['Ok'], defaultButton, {headerClass: "bg-orange"})
      },
      critical: function (message, caption, buttons, defaultButton, view) {
        return show(message, caption || "Error!", buttons || ['Ok'], defaultButton, {headerClass: "bg-red"})
      }

    };
  });
}(angular));