angular.module("grubsup.filters").
  filter('removeSpaces', [function() {
      return function(string) {
          if (!angular.isString(string)) {
              return string;
          }
          return string.replace(/[\s]/g, '');
      };
  }]);
