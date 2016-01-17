angular.module('emmersive.auth', ['ionic', 'firebase'])

// Configuration/Routes
.config(function($stateProvider) {
  $stateProvider
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'auth/login.html',
        controller: 'LoginController'
      }
    }
  })
  .state('app.new_account', {
    url: '/accounts/new',
    views: {
      'menuContent': {
        templateUrl: 'auth/accounts_new.html',
        controller: 'AccountController'
      }
    }
  })
  .state('app.your_profile', {
    url: '/profile/:id',
    views: {
      'menuContent': {
        templateUrl: 'auth/your_profile.html',
        controller: 'ProfileController'
      }
    }
  });
})

.run(function($rootScope, Ref, $location) {
  $rootScope.log_out = function() {
    Ref.unauth();
  };

  $rootScope.is_logged_in = function() {
    return (Ref.getAuth()) ? true : false;
  };

  $rootScope.edit_user_profile = function() {
    $location.path("/app/profile/" + Ref.getAuth().uid);
  };
})

// Services/Factories
.service('AuthService', function($q, $firebaseAuth, SessionService, Ref) {
  var authObj = $firebaseAuth(Ref);

  this.isLoggedIn = function isLoggedIn() {
    return SessionService.getAuthData() !== null;
  };

  this.logInBasicAuth = function(username, password) {
    ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData){

    });
  };

  this.logOut = function() {
    authObj.unauth();
    SessionService.destroy();
  };
})

.service('SessionService', function($log, localstorage) {
  this._authData = JSON.parse(localStorage.getItem('session.authData'));

  this.getAuthData = function() {
    return this._authData;
  };

  this.setAuthData = function(authData) {
    this._authData = authData;
    localStorage.setItem('session.authData', JSON.stringify(authData));
    return this;
  };

  this.destroy = function destroy() {
    this.setAuthData(null);
  };

})

.factory('UserLookup', function($firebaseObject, Ref) {
  return function(id) {
    return $firebaseObject(Ref.child('users').child(id));
  };
})

// Controllers/Directives
.controller("AccountController", function($rootScope, $scope, $location, Ref) {
  $scope.user = {};
  $scope.createUser = function() {
    Ref.createUser($scope.user, function(error, userData){
      Ref.child("users").child(userData.uid).set({
       provider: "password",
       name: $scope.user.name,
       email: $scope.user.email
      });

      $rootScope.$apply(function() {
        $location.path("/app/welcome");
      });
    });
  };
})

.controller('LoginController',
function($scope, $firebaseAuth, AuthService, SessionService, $location, Ref) {
  var auth = $firebaseAuth(Ref);
  $scope.user = {};

  $scope.log_in = function() {
    auth.$authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(authData) {
      SessionService.setAuthData(authData);
      $location.path("/app/projects");
    }).catch(function(error) {
      alert("Authentication failed:", error);
    });
  };
})

.controller('ProfileController', function($scope, Ref, UserLookup, $stateParams) {
  user = Ref.getAuth();

  $scope.isUser = function(){
    return ($stateParams.id == user.uid)
  }

  if($scope.isUser()){
    $scope.title = "Your Profile"
    UserLookup(user.uid).$loaded(function(user) {
      $scope.user = user;
    });
  } else {
    UserLookup($stateParams.id).$loaded(function(user) {
      $scope.user = user;
      $scope.title = user.name;
    });
  }

  $scope.change_password = function(){
    if($scope.isUser()){

      Ref.changePassword({
        email: $scope.user.email,
        oldPassword: $scope.user.existing_password,
        newPassword: $scope.user.new_password
      }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error changing password:", error);
            }
          } else {
            alert("User password changed successfully!");
          }
        });
    }
  }

  $scope.update_profile = function(){
    if($scope.isUser()){
      $scope.user.$save()
      alert("updated username");
    }
  }

})

.directive('principal', function(UserLookup){
  return {
    template: "<span>{{user.name}}</span>",
    restrict: 'E',
    scope: {
      id: '@'
    },
    replace: true,
    link: function($scope, $element, $attrs) {
      UserLookup($attrs.id).$loaded(function(user) {
        $scope.user = user;
      });
    }
  }
})

.directive('activityCard', function(UserLookup) {
  return {
    templateUrl: 'projects/activity_card.html',
    restrict: 'E',
    scope: {
      id: '@',
      activity: '=activity'
    },
    replace: true,
    link: function($scope, $element, $attrs) {
      UserLookup($attrs.id).$loaded(function(user) {
        $scope.user = user;
      });
    }
  };
})

.directive('userCard', function(UserLookup) {
  return {
    templateUrl: 'auth/user_card.html',
    restrict: 'E',
    scope: {
      id: '@'
    },
    replace: true,
    link: function($scope, $element, $attrs) {
      UserLookup($attrs.id).$loaded(function(user) {
        $scope.user = user;
      });
    }
  };
});
