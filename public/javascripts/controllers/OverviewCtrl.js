angular.module("grubsup.controllers").
  controller("OverviewCtrl", [
    "$scope",
    "api",
    function ($scope, api) {
      $scope.menu = {
        items: [
          {name: "Overview", active: true},
          {name: "Calendar"},
          {name: "Shopping List"},
          {name: "Recipes"},
          {name: "Settings"}
        ],

      };
      api.getUserInfo(
        function (user){
          $scope.user = user;
        }
      );
    }
  ]);
