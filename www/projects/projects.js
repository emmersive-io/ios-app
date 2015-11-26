angular.module('emmersive.projects', ['ionic', 'firebase', 'emmersive.projects.meetups'])
// Config/Routes
.config(function($stateProvider) {
  $stateProvider
  .state('app.project_new', {
    url: '/projects/new',
    views: {
      'menuContent': {
        templateUrl: 'projects/project_new.html',
        controller: 'ProjectsController'
      }
    }
  })
  .state('app.projects_all', {
    url: '/projects/all',
    views: {
      'menuContent': {
        templateUrl: 'projects/projects_all.html',
        controller: 'ProjectsController'
      }
    }
  })
  .state('app.projects', {
    url: '/projects',
    views: {
      'menuContent': {
        templateUrl: 'projects/projects.html',
        controller: 'ProjectsController'
      }
    }
  })
  .state('app.project_view', {
    url: '/projects/:id',
    views: {
      'menuContent': {
        templateUrl: 'projects/project.html',
        controller: 'ProjectController'
      }
    }
  })
  .state('app.project_edit', {
    url: '/projects/:id/edit',
    views: {
      'menuContent': {
        templateUrl: 'projects/project_edit.html',
        controller: 'ProjectController'
      }
    }
  })
  .state('app.your_projects', {
    url: '/users/:user_id/projects',
    views: {
      'menuContent': {
        templateUrl: 'projects/your_projects.html',
        controller: 'ProjectsController'
      }
    }
  });
})

.run(function($rootScope) {
  $rootScope.categories = [
    'Art', 'Comics', 'Crafts', 'Dance', 'Design', 'Fashion', 'Film & Video', 'Food', 'Games',
    'Journalism', 'Music', 'Photography', 'Publishing', 'Technology', 'Theater'
  ];
})

// Services/Factories
.factory('Project', function($firebaseObject, Ref) {
  return function(id) {
    return $firebaseObject(Ref.child('projects').child(id));
  };
})

.factory('ProjectMeetups', function($firebaseArray, Ref) {
  return function(id) {
    return $firebaseArray(Ref.child('projects').child(id).child('meetups'));
  };
})

.factory('Projects', function($firebaseArray, Ref) {
   return $firebaseArray(Ref.child('projects'));
})

// Controllers/Directives
.controller('ProjectsController', function($scope, Projects, Project, $location, Ref) {
  $scope.projects = [];

  $scope.all_projects = Projects;

  if(Ref.getAuth()) {
    Ref.child('projects')
    .startAt(Ref.getAuth().uid)
    .endAt(Ref.getAuth().uid)
    .once('value', function(snap) {
       data = snap.val();
       if(data) {
         angular.forEach(Object.keys(data), function(value, key) {
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
    Projects.$add($scope.project).then(function(ref) {
      $location.path("/app/projects/" + ref.key());
    });
  };

  $scope.already_joined = function(people) {
    if(people && $scope.is_logged_in()) {
      return people.indexOf(Ref.getAuth().uid) > -1;
    } else {
      return false;
    }
  };

  $scope.load_project = function(id) {
    $location.path("/app/projects/" + id);
  };

  $scope.stop_searching = function() { $scope.searching = false; };
  $scope.start_searching = function() { $scope.searching = true; };
})


/* Project Controller */
.controller('ProjectController',
function($scope, $stateParams, $location, Project, Projects, Ref, ProjectMeetups) {
  $scope.loaded = false;
  Project($stateParams.id).$loaded(function(project) {
    $scope.project = project;
    $scope.loaded = true;
  });

  $scope.meetup = {};

  $scope.delete_project = function() {
    Project($scope.project.$id).$remove().then(function(ref) {
      $location.path('/app/projects');
    });
  };

  $scope.leave_project = function() {
    index = $scope.project.people.indexOf(Ref.getAuth().uid);
    $scope.project.people.splice(index, 1);
    $scope.project.$save();
  };

  $scope.join_project = function() {
    $scope.project.people = ($scope.project.people) ? $scope.project.people : [];
    $scope.project.people.push(Ref.getAuth().uid);
    $scope.project.$save();
  };

  $scope.joined = function() {
    if($scope.loaded) {
      $scope.project.people = ($scope.project.people) ? $scope.project.people : [];
      return $scope.project.people.indexOf(Ref.getAuth().uid) > -1;
    }
  };

  $scope.update_project = function() {
    $scope.project.$save().then(function(ref) {
      $location.path("/app/projects/" + $scope.project.$id);
    });
  };

  $scope.load_meetup_form = function() {
    $location.path("/app/projects/" + $scope.project.$id + "/meetups/new");
  };

  $scope.load_meetup = function(key) {
    $location.path("/app/projects/" + $scope.project.$id + "/meetups/" + key);
  };

  $scope.create_meetup = function() {
    $scope.meetup.project_id = $scope.project.$id;
    $scope.meetup.created_by = Ref.getAuth().uid;
    $scope.meetup.people = [];
    $scope.meetup.people.push(Ref.getAuth().uid);

    ProjectMeetups($scope.project.$id).$add($scope.meetup).then(function() {
      $location.path("/app/projects/" + $scope.project.$id);
    });
  };
})
;
