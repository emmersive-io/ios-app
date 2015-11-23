angular.module('emmersive.directives', [])

.directive('userCard', ['UserLookup', function(UserLookup){
  return {
    templateUrl: 'templates/user_card.html',
    restrict: 'E',
    scope: {
      id: '@'
    },
    replace: true,
    link: function($scope, $element, $attrs){
      UserLookup($attrs.id).$loaded(function(user){
        console.log(user);
        $scope.user = user;
      });
    }
  }
}]);
