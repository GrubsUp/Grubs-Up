angular.module("grubsup.directives")
  .directive('imageOnload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
              element.hide();
              element.on('load', function() {
                element.show();
              })
            }
        };
    });
