angular.module('emmersive.projects.meetups', [])

.config(function($stateProvider) {
  $stateProvider
  .state('app.meetup_new', {
    url: '/projects/:id/meetups/new',
    views: {
      'menuContent': {
        templateUrl: 'projects/meetups/meetup_new.html',
        controller: 'ProjectController'
      }
    }
  })
  .state('app.meetup', {
    url: '/projects/:project_id/meetups/:id',
    views: {
      'menuContent': {
        templateUrl: 'projects/meetups/meetup.html',
        controller: 'MeetupController'
      }
    }
  })
  ;
})

.controller('MeetupController', function($scope, $stateParams, Project, $location, Ref) {
  Project($stateParams.project_id).$loaded(function(project) {
    $scope.project = project;
    $scope.meetup = $scope.project.meetups[$stateParams.id];
    $scope.meetup_key = $stateParams.id;
  });

  $scope.update_meetup = function() {
    $scope.project.$save();
    $scope.editing = false;
  };

  $scope.joined_meetup = function() {
    if($scope.meetup) {
      $scope.meetup.people = ($scope.meetup.people) ? $scope.meetup.people : [];
      return $scope.meetup.people.indexOf(Ref.getAuth().uid) > -1;
    }
  };

  $scope.count_me_out = function() {
    index = $scope.meetup.people.indexOf(Ref.getAuth().uid);
    $scope.meetup.people.splice(index, 1);
    $scope.project.$save();
  };

  $scope.count_me_in = function() {
    $scope.meetup.people = ($scope.meetup.people) ? $scope.meetup.people : [];
    if(!$scope.joined) {
      $scope.meetup.people.push(Ref.getAuth().uid);
    }
    $scope.project.$save();
  };

  $scope.delete_meetup = function() {
    $scope.project.meetups[$scope.meetup_key] = null;
    $scope.project.$save().then(function() {
      $location.path("/app/projects/" + $scope.project.$id);
    });
  };

  $scope.stop_editing = function() { $scope.editing = false; };
  $scope.start_editing = function() { $scope.editing = true; };
})
;
