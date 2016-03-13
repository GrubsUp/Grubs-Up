angular.module("grubsup", [
  "ngRoute",
  "grubsup.controllers",
  "grubsup.services"
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
    ).when(
      "/signup",
      {
        templateUrl:"/partials/signup",
        controller: "SignUpCtrl"
      }
    );

    $locationProvider.html5Mode(true);
  }
]);

angular.module("grubsup.controllers", [
  "grubsup.services"
]);

angular.module("grubsup.services", []);
