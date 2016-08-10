angular.module("grubsup.controllers").
  controller("RecipesNewCtrl", [
    "$scope",
    "api",
    function ($scope, api) {
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
        }
      );
    }
  ]);
