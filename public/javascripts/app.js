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
