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
