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
        controller: "IndexCtrl",
      }
    ).when(
      "/signup",
      {
        templateUrl:"/partials/signup",
        controller: "SignUpCtrl"
      }
    ).when(
      "/login",
      {
        templateUrl:"/partials/login",
        controller: "LogInCtrl"
      }
    ).when(
      "/confirmemail/:token",
      {
        templateUrl:"/partials/confirmemail",
        controller: "ConfirmEmailCtrl"
      }
    ).when(
      "/accountsetup",
      {
        templateUrl:"/partials/accountsetup",
        controller: "AccountSetupCtrl"
      }
    ).when(
      "/overview",
      {
        templateUrl:"/partials/overview",
        controller: "OverviewCtrl"
      }
    ).when(
      "/recipes",
      {
        templateUrl:"/partials/recipesMain",
        controller: "RecipesMainCtrl"
      }
    );

    $locationProvider.html5Mode(true);
  }
]);

angular.module("grubsup.services", [
  "ngCookies"
]);

angular.module("grubsup.filters", []);

angular.module("grubsup.directives", []);

angular.module("grubsup.controllers", [
  "grubsup.services",
  "grubsup.filters",
  "grubsup.directives"
]);

angular.module("grubsup.services").
factory('api', [
  "$http",
  "$cookies",
  "$location",
  function ($http, $cookies, $location){
    return {
      getUserInfo: function (cb, redirect) {
        var redirect = redirect || true;
        $http.get("/api/user").then(function (res) {
          if(res.data.valid == false && redirect){
            $location.url("login?tokenExp=1&redirectTo=" +  $location.path());
          }
          else if(res.data.notLoggedIn && redirect){
            $location.url("login?&redirectTo=" +  $location.path());
          }
          else{
            cb(res.data);
          }
        });
      },
      getRecipes: function (recipeIds, cb) {
        if (recipeIds.length > 0) {
          $http.post("/api/getRecipes", recipeIds).then(function (res) {
            cb(res.data);
          });
        }
      },
      confirmEmail: function (user, token, cb) {
        $http.post("/api/confirmEmail", {
          userId: user._id,
          token: token
        }).then(function (res) {
          cb(res.data)
        });
      },
      resendConfirmation: function (user, cb) {
        $http.post("/api/resendConfirmation", {
          userId: user._id,
          email: user.email
        }).then(function (res) {
          cb(res.data);
        });
      }
    }
  }
]);

angular.module("grubsup.filters").
  filter('removeSpaces', [function() {
      return function(string) {
          if (!angular.isString(string)) {
              return string;
          }
          return string.replace(/[\s]/g, '');
      };
  }]);

angular.module("grubsup.directives")
  .directive('imageOnload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              element.hide();
              element.on('load', function() {
                element.show();
              })
            }
        };
    });

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

angular.module("grubsup.controllers").
  controller("ConfirmEmailCtrl", [
    "$scope",
    "$routeParams",
    "api",
    function ($scope, $routeParams, api) {
      $scope.message = "Wait a minute... Don't close this page just yet!";
      api.getUserInfo(
        function (user){
          $scope.user = user;
          api.confirmEmail(user, $routeParams.token, function (res) {
            if(res.err){
              if(res.name == "EmailAlreadyConfirmed"){
                $scope.homeBtn = true;
                $scope.message = res.message;
              }
              else{
                $scope.err = true;
                $scope.message = res.message;
              }
            }
            else if(res.confirmed){
              $scope.homeBtn = true;
              $scope.confirmed = true;
              $scope.message = "Your email has been confirmed successfully";
            }
          });
        }
      );
      $scope.resendConfirmation = function () {
        $(".resendConfirmation").addClass("disabled");
        api.resendConfirmation($scope.user, function (res) {
          if(res.sent){
            $scope.message = "Confirmation email sent.";
            $scope.err = false;
            $scope.homeBtn = true;
          }
          else{
            $scope.message = "There was an error sending the email. Try again.";
            $(".resendConfirmation").removeClass("disabled");
          }
        });
      }
    }
  ]);

angular.module("grubsup.controllers").
  controller("IndexCtrl", [
    "$scope",
    "$location",
    "$window",
    "api",
    function ($scope, $location, $window, api) {
      api.getUserInfo(
        function (user){
          if(!user.notLoggedIn && user.valid != false){
            $location.url("/overview");
          }
        }, false
      );

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
  controller("LogInCtrl", [
    "$scope",
    "$location",
    function ($scope, $location) {
      var queryString = $location.search();

      $scope.form = {
        redirectTo: queryString.redirectTo ? queryString.redirectTo : "/overview"
      };

      if(queryString.tokenExp){
        $(".tokenExpModal").modal();
      }

      if(queryString.error){
        $scope.form.username = queryString.prevUsername || "";
        $scope.form.stayLoggedIn = queryString.stayLoggedIn || false;
      }
      if(queryString.error == "invU"){
        $("[name=username]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.usernameError = "Usernames can only contain letters, numbers, underscores and periods.";
      }
      if(queryString.error == "noUFound"){
        $("[name=username]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.usernameError = "Username does not exist.";
      }
      if(queryString.error == "invCombo"){
        $("[name=password]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.passwordError = "Username and password fields do not match.";
      }
    }
  ]);

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

angular.module("grubsup.controllers").
  controller("RecipesMainCtrl", [
    "$scope",
    "api",
    function ($scope, api) {
      $scope.menu = {
        items: [
          {name: "Overview"},
          {name: "Calendar"},
          {name: "Shopping List"},
          {name: "Recipes", active: true},
          {name: "Settings"}
        ]
      };
      api.getUserInfo(
        function (user){
          $scope.user = user;
          api.getRecipes(
            user.recipes,
            function (recipes) {
              $scope.recipes = recipes;
            }
          );
        }
      );
      
      $scope.recipesShown = 25;
      $scope.loadMore = function () {
        $scope.recipesShown += 25;
        if(recipesShown >= recipes.length){
          $(".loadMore").hide();
        }
      }
    }
  ]);

angular.module("grubsup.controllers").
  controller("SignUpCtrl", [
    "$scope",
    "$location",
    function ($scope, $location) {
      $scope.form = {};

      var queryString = $location.search();
      if(queryString.error){
        $scope.form.email = queryString.prevEmail || "";
        $scope.form.username = queryString.prevUsername || "";
      }
      if(queryString.error == "takenE"){
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
      if(queryString.error == "invU"){
        $("[name=email]").addClass("form-control-danger").parent().addClass("has-danger");
        $scope.emailError = "Email is taken. Please try another one.";
        $scope.emailTaken = true;
      }
    }
  ]);
