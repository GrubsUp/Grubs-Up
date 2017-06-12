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
