angular.module("grubsup", [
  "ngRoute",
  "grubsup.controllers"
]).config([
  "$routeProvider",
  "$locationProvider",
  function($routeProvider, $locationProvider) {
    $routeProvider.when(
      "/",
      {
        templateUrl:"/partials/index",
        controller: "IndexCtrl"
      }
    );

    $locationProvider.html5Mode(true);
  }
]);

angular.module("grubsup.controllers", []);

angular.module("grubsup.controllers").
  controller("IndexCtrl", [
    "$scope",
    function ($scope) {
      $scope.title = "Grub's Up!";
    }
  ]);
