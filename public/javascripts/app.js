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
