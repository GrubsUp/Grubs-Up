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
            if (result != "NotLoggedIn") {
              if($scope.recipe.author == $scope.user._id){
                $scope.recipe.author = $scope.user.name;
              }
              else{
                api.get("Users", [$scope.recipe.author], function (user) {
                  $scope.recipe.author = user[0].name;
                  $(".deleteRecipe, .editRecipe").hide();
                });
              }
            }
            else{
              api.get("Users", [$scope.recipe.author], function (user) {
                $scope.recipe.author = user[0].name;
                $(".deleteRecipe, .editRecipe").hide();
              });
            }
          });
        }, false
      );

      $(".deleteRecipeModal").click(function () {
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
      });
    }
  ]);
