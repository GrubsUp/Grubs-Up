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
