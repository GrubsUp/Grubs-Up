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
