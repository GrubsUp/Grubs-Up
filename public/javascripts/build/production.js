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
    "$location",
    "$window",
    function ($scope, $location, $window) {
      $("#login-signup-tabs .nav-item .nav-link").on("mouseup", function () {
        if($(this).hasClass("signup-tab")){
          $(".signup-tab").addClass("active");
          $(".login-tab").removeClass("active");
        }
        else if($(this).hasClass("login-tab")){
          $(".login-tab").addClass("active");
          $(".signup-tab").removeClass("active");
        }
      });

      $(".top").on("mouseup", function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600)
      });
    }
  ]);
