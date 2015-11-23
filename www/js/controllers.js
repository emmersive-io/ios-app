angular.module('emmersive.controllers', [])

.run(function($rootScope, Ref, $location){
  $rootScope.categories = ['Art', 'Comics', 'Crafts', 'Dance', 'Design', 'Fashion',
                           'Film & Video', 'Food', 'Games', 'Journalism', 'Music',
                           'Photography', 'Publishing', 'Technology', 'Theater'];

  $rootScope.log_out = function(){ Ref.unauth();}
  $rootScope.is_logged_in = function() { return (Ref.getAuth()) ? true : false; }

  $rootScope.edit_user_profile = function(){
    $location.path("/app/profile/" + Ref.getAuth().uid)
  }

})

/* Login Controller */
.controller('LoginController', function($scope, $firebaseAuth, AuthService, SessionService, $location, Ref) {
  var auth = $firebaseAuth(Ref);
  $scope.user = {};

  $scope.log_in = function(){
    auth.$authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(authData) {
      SessionService.setAuthData(authData);
      $location.path("/app/projects");
    }).catch(function(error) {
      alert("Authentication failed:", error);
    });
  }
})

/* Account Controller */
.controller("AccountController", function($rootScope, $scope, $location, Ref){
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
  }
})

/* Projects Controller */
.controller('ProjectsController', function($scope, Projects, Project, $location, Ref) {
  $scope.projects = [];

  $scope.all_projects = Projects;

  if(Ref.getAuth()){
    Ref.child('projects').startAt(Ref.getAuth().uid)
                         .endAt(Ref.getAuth().uid)
                         .once('value', function(snap){
                           data = snap.val();
                           if(data){
                             angular.forEach( Object.keys(data), function(value, key){
                               var project = data[value];
                               project.$id = value;
                               $scope.projects.push(project);
                             });
                           } else {
                             if($location.path() != "/app/projects/new") {
                                $location.path("/app/projects/all");
                             }
                           }
                         });
  } 

  $scope.project = {};

  $scope.save_project = function() {
    $scope.project.people = [Ref.getAuth().uid];
    $scope.project.$priority = Ref.getAuth().uid;
    Projects.$add($scope.project).then(function(ref){
       $location.path("/app/projects/" + ref.key());
    })
  };

  $scope.already_joined = function(people){
    if(people && $scope.is_logged_in()){
      return people.indexOf(Ref.getAuth().uid) > -1;
    } else {
      return false;
    }
  }

  $scope.load_project = function(id){
    $location.path("/app/projects/" + id);
  };

  $scope.stop_searching = function(){ $scope.searching = false; }
  $scope.start_searching = function(){ $scope.searching = true; }
})


/* Project Controller */
.controller('ProjectController', function($scope, $stateParams, $location, Project, Projects, Ref, ProjectMeetups) {

  $scope.loaded = false;
  Project($stateParams.id).$loaded(function(project){
    $scope.project = project;
    $scope.loaded = true;
  });

  $scope.meetup = {};

  $scope.delete_project = function(){
    Project($scope.project.$id).$remove().then(function(ref){
      $location.path('/app/projects');
    });
  }

  $scope.leave_project = function(){
    index = $scope.project.people.indexOf(Ref.getAuth().uid);
    $scope.project.people.splice(index, 1);
    $scope.project.$save();
  }

  $scope.join_project = function(){
    $scope.project.people = ($scope.project.people) ? $scope.project.people : [];
    $scope.project.people.push(Ref.getAuth().uid);
    $scope.project.$save();
  }

  $scope.joined = function(){
    if($scope.loaded){
      $scope.project.people = ($scope.project.people) ? $scope.project.people : [];
      return $scope.project.people.indexOf(Ref.getAuth().uid) > -1;
    }
  }

  $scope.update_project = function() {
    $scope.project.$save().then(function(ref){
      $location.path("/app/projects/" + $scope.project.$id)
    });
  }

  $scope.load_meetup_form = function(){
    $location.path("/app/projects/" + $scope.project.$id + "/meetups/new");
  };

  $scope.load_meetup = function(key){
    $location.path("/app/projects/" + $scope.project.$id + "/meetups/" + key);
  }

  $scope.create_meetup = function() {
    $scope.meetup.project_id = $scope.project.$id;
    $scope.meetup.created_by = Ref.getAuth().uid;
    $scope.meetup.people = [];
    $scope.meetup.people.push(Ref.getAuth().uid)

    ProjectMeetups($scope.project.$id).$add($scope.meetup).then(function(){
      $location.path("/app/projects/" + $scope.project.$id);
    })
  }

})


/* Meeting Controller */
.controller('MeetupController', function($scope, $stateParams, Project, $location, Ref) {

  Project($stateParams.project_id).$loaded(function(project){
    $scope.project = project;
    $scope.meetup = $scope.project.meetups[$stateParams.id];
    $scope.meetup_key = $stateParams.id;
  });

  $scope.update_meetup = function(){
    $scope.project.$save();
    $scope.editing = false;
  }

  $scope.joined_meetup = function(){
    if($scope.meetup){
      $scope.meetup.people = ($scope.meetup.people) ? $scope.meetup.people : [];
      return $scope.meetup.people.indexOf(Ref.getAuth().uid) > -1;
    }
  }

  $scope.count_me_out = function(){
    index = $scope.meetup.people.indexOf(Ref.getAuth().uid);
    $scope.meetup.people.splice(index, 1);
    $scope.project.$save();
  }

  $scope.count_me_in = function(){
    $scope.meetup.people = ($scope.meetup.people) ? $scope.meetup.people : [];
    if(!$scope.joined) {
      $scope.meetup.people.push(Ref.getAuth().uid);
    }
    $scope.project.$save();
  }

  $scope.delete_meetup = function(){
    $scope.project.meetups[$scope.meetup_key] = null;
    $scope.project.$save().then(function(){
      $location.path("/app/projects/" + $scope.project.$id);
    });
  };

  $scope.stop_editing = function() { $scope.editing = false };
  $scope.start_editing = function() { $scope.editing = true };
})


/* Profile Controller */

.controller('ProfileController', function($scope, Ref) {
  $scope.user = Ref.getAuth();
})
