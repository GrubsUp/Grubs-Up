angular.module("grubsup.controllers").
  controller("AccountSetupCtrl", [
    "$scope",
    "api",
    function ($scope, api) {
      api.getUserInfo(
        function (user){
          $scope.user = user;
        }
      );
    }
  ]);
