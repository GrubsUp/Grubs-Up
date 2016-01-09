angular.module("grubsup", [
  "ngRoute"
]).config([
  "$routeProvider",
  "$locationProvider",
  function($routeProvider, $locationProvider) {
    $routeProvider.when(
      "/",
      {
        templateUrl:"/partials/index",
        controller: function(){
          
        }
      }
    );

    $locationProvider.html5Mode(true);
  }
]);
