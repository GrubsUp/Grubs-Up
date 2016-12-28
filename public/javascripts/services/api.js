angular.module("grubsup.services").
factory('api', [
  "$http",
  "$cookies",
  "$location",
  function ($http, $cookies, $location){
    return {
      getUserInfo: function (cb, redirect) {
        var redirect = redirect == false ? redirect : true;
        $http.get("/api/user").then(function (res) {
          if(res.data.valid == false && redirect){
            $location.url("login?tokenExp=1&redirectTo=" +  $location.path());
          }
          else if(res.data.notLoggedIn && redirect){
            $location.url("login?&redirectTo=" +  $location.path());
          }
          else if(res.data.valid == false && !redirect || res.data.notLoggedIn && !redirect){
            cb("NotLoggedIn");
          }
          else{
            cb(res.data);
          }
        });
      },
      get: function (getType, getIds, cb) {
        if (getIds.length > 0) {
          $http.post("/api/get"+getType, getIds).then(function (res) {
            cb(res.data);
          });
        }
      },
      confirmEmail: function (user, token, cb) {
        $http.post("/api/confirmEmail", {
          userId: user._id,
          token: token
        }).then(function (res) {
          cb(res.data)
        });
      },
      resendConfirmation: function (user, cb) {
        $http.post("/api/resendConfirmation", {
          userId: user._id,
          email: user.email
        }).then(function (res) {
          cb(res.data);
        });
      }
    }
  }
]);
