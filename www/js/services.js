angular.module('emmersive.services', [])

.factory('Ref', function(FIREBASE_URL) {
   return new Firebase(FIREBASE_URL);
})

.factory('UserLookup', function($firebaseObject, Ref){
  return function(id) {
    return $firebaseObject(Ref.child('users').child(id));
  }
})

.factory('Projects', function($firebaseArray, Ref) {
   return $firebaseArray(Ref.child('projects'));
})

.factory('Project', function($firebaseObject, Ref){
  return function(id) {
    return $firebaseObject(Ref.child('projects').child(id));
  }
})

.factory('ProjectMeetups', function($firebaseArray, Ref){
  return function(id){
    return $firebaseArray(Ref.child('projects').child(id).child('meetups'));
  }
})

.factory('localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.service('SessionService', ['$log', 'localstorage', function($log, localstorage){

  this._authData = JSON.parse(localStorage.getItem('session.authData'));

  this.getAuthData = function(){
    return this._authData;
  };

  this.setAuthData = function(authData){
    this._authData = authData;
    localStorage.setItem('session.authData', JSON.stringify(authData));
    return this;
  };

  this.destroy = function destroy(){
    this.setAuthData(null);
  };

}])

.service('AuthService', ['$q', '$firebaseAuth', 'SessionService', 'Ref', function($q, $firebaseAuth, session, Ref){

  var authObj = $firebaseAuth(Ref);

  this.isLoggedIn = function isLoggedIn(){
    return session.getAuthData() !== null;
  };

  this.logInBasicAuth = function(username, password) {
    ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData){

    });
  };

  this.logOut = function(){
    authObj.unauth();
    session.destroy();
  };

}]);
