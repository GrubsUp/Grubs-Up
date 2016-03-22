angular.module("grubsup.controllers").
  controller("SignUpCtrl", [
    "$scope",
    "$location",
    "$window",
    function ($scope, $location, api) {
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
