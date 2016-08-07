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
