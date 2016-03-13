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


angular.module("grubsup.controllers").
  controller("SignUpCtrl", [
    "$scope",
    "$location",
    "$window",
    function ($scope, $location, api) {
      $scope.form = {};

      var queryString = $location.search();
      if(queryString.error){
        $scope.form.email = queryString.prevEmail || "";
        $scope.form.username = queryString.prevUsername || "";
      }
      if(queryString.error == "invU"){
        $("[name=username]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.usernameError = "Usernames can only contain letters, numbers, underscores and periods.";
      }
      if(queryString.error == "invE"){
        $("[name=email]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.emailError = "Email is not valid.";
      }
      if(queryString.error == "invP"){
        $("[name=password], [name=confirm]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.passwordError = "Both password fields do not match.";
      }
      if(queryString.error == "takenU"){
        $("[name=username]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.usernameError = "Username is taken. Please try another one.";
      }
      if(queryString.error == "takenE"){
        $("[name=email]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.emailError = "Email is taken. Please try another one.";
      }
    }
  ]);

angular.module("grubsup.services").
factory('api', [
  "$http",
  function ($http){
    return {

    }
  }
]);
