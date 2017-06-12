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
    ).when(
      "/recipes/new",
      {
        templateUrl:"/partials/recipesNew",
        controller: "RecipesNewCtrl"
      }
    ).when(
      "/recipes/view/:recipeId",
      {
        templateUrl:"/partials/recipesView",
        controller: "RecipesViewCtrl"
      }
    ).when(
      "/recipes/edit/:recipeId",
      {
        templateUrl:"/partials/recipesNew",
        controller: "RecipesEditCtrl"
      }
    ).when(
      "/calendar",
      {
        templateUrl:"/partials/calendarMain",
        controller: "CalendarMainCtrl"
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
        var redirect = redirect == false ? redirect : true;
        $http.get("/api/user").then(function (res) {
          if(res.data.valid == false && redirect){
            $location.url("login?tokenExp=1&redirectTo=" +  $location.path());
          }
          else if(res.data.notLoggedIn && redirect){
            $location.url("login?&redirectTo=" +  $location.path());
          }
          else if(res.data.valid == false && !redirect || res.data.notLoggedIn && !redirect){
            cb("NotLoggedIn");
          }
          else{
            cb(res.data);
          }
        });
      },
      get: function (getType, getIds, cb) {
        if (getIds.length > 0) {
          $http.post("/api/get"+getType, getIds).then(function (res) {
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
          if(user != "NotLoggedIn"){
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
  controller("RecipesEditCtrl", [
    "$scope",
    "api",
    "$routeParams",
    "$http",
    "$window",
    "$location",
    function ($scope, api, $routeParams, $http, $window, $location) {
      $scope.form = {
        ingredients: [{
          name: "",
          amount: "",
          measurement: ""
        }],
        instructions: [""]
      };

      $(".newIngredient").click(function () {
        $scope.form.ingredients.push({
          name: "",
          amount: "",
          measurement: ""
        });
        $scope.$apply();
      });

      $(".newInstruction").click(function () {
        $scope.form.instructions.push("");
        $scope.$apply();
      });

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
          api.get("Recipes", [$routeParams.recipeId], function (recipe) {
            if($scope.user["_id"] == recipe[0].author){
              $scope.form = recipe[0];
            }
            else{
              $window.open("/recipes", "_self");
            }
          });
        }
      );

      $(".submit").click(function () {
        $http.post("/api/updateRecipe", {
          recipe: $scope.form
        }).then(function (result) {
          if(result.data.valid == false){
            $location.url("login?tokenExp=1&redirectTo=" +  $location.path());
          }
          else{
            $window.open("/recipes", "_self");
          }
        });
      });
    }
  ]);

angular.module("grubsup.controllers").
  controller("RecipesMainCtrl", [
    "$scope",
    "api",
    "$window",
    "$location",
    function ($scope, api, $window, $location) {
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
          api.get("Recipes", user.recipes,
            function (recipes) {
              $scope.recipes = recipes;
              if ($scope.recipesShown >= $scope.recipes.length) {
                $(".loadMore").hide();
              }
            }
          );
        }
      );

      $scope.recipesShown = 25;
      $scope.loadMore = function () {
        $scope.recipesShown += 25;
        if($scope.recipesShown >= $scope.recipes.length){
          $(".loadMore").hide();
        }
      }

      $scope.openRecipe = function (recipeId) {
        $window.open('/recipes/view/' + recipeId, "_self");
      };

      $scope.queryString = $location.search();
    }
  ]);

angular.module("grubsup.controllers").
  controller("RecipesNewCtrl", [
    "$scope",
    "api",
    "$http",
    "$window",
    function ($scope, api, $http, $window) {
      $scope.form = {
        public: false,
        ingredients: [{
          name: "",
          amount: "",
          measurement: ""
        }],
        instructions: [""]
      };

      $(".newIngredient").click(function () {
        $scope.form.ingredients.push({
          name: "",
          amount: "",
          measurement: ""
        });
        $scope.$apply();
      });

      $(".newInstruction").click(function () {
        $scope.form.instructions.push("");
        $scope.$apply();
      });

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
        }
      );

      $(".submit").click(function () {
        $http.post("/api/createRecipe", $scope.form).then(function (res) {
          $window.open("/recipes", "_self");
        });
      });
    }
  ]);

angular.module("grubsup.controllers").
  controller("RecipesViewCtrl", [
    "$scope",
    "api",
    "$routeParams",
    "$http",
    "$window",
    "$location",
    function ($scope, api, $routeParams, $http, $window, $location) {
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
        function (result){
          if (result != "NotLoggedIn") {
            $scope.user = result;
          }
          api.get("Recipes", [$routeParams.recipeId], function (recipe) {
            $scope.recipe = recipe[0];
            if ($scope.user != "NotLoggedIn" && $scope.recipe.author == $scope.user._id) {
              $scope.recipe.author = $scope.user.name;
            }
            else if($scope.recipe == "private"){
              $(".recipeInfo").hide();
              $(".recipePrivate").show();
            }
            else if($scope.recipe == "notFound"){
              $(".recipeInfo").hide();
              $(".recipeNotFound").show();
            }
            else {
              api.get("Users", [$scope.recipe.author], function (user) {
                $scope.recipe.author = user[0].name;
                $(".deleteRecipe, .editRecipe").hide();
              });
            }
          });
        }, false
      );

      $(".deleteRecipe").click(function () {
        if ($scope.user != "NotLoggedIn" && $scope.recipe.author == $scope.user.name) {
          $http.post("/api/deleteRecipe", {
            recipeId: $scope.recipe._id
          }).then(function (result) {
            if(result.data.valid == false){
              $location.url("login?tokenExp=1&redirectTo=" +  $location.path());
            }
            else{
              $window.open("/recipes?deleted="+result.data.deleteResult, "_self");
            }
          });
        }
      });
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
