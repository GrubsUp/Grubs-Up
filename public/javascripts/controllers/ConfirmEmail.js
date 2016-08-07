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
