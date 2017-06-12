angular.module("grubsup.controllers").
  controller("CalendarMainCtrl", [
    "$scope",
    "api",
    function ($scope, api) {
      $scope.menu = {
        items: [
          {name: "Overview"},
          {name: "Calendar", active: true},
          {name: "Shopping List"},
          {name: "Recipes"},
          {name: "Settings"}
        ]
      };
      api.getUserInfo(
        function (user){
          $scope.user = user;
          api.get("Calendar", [user["_id"]],
            function (calendar) {
            }
          );
        }
      );
    }
  ]);
