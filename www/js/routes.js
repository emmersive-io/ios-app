angular.module('emmersive.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginController'
        }
      }
    })

    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html',
        }
      }
    })

    .state('app.new_account', {
      url: '/accounts/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/accounts_new.html',
          controller: 'AccountController'
        }
      }
    })

    .state('app.project_new', {
      url: '/projects/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/project_new.html',
          controller: 'ProjectsController'
        }
      }
    })

    .state('app.projects_all', {
      url: '/projects/all',
      views: {
        'menuContent': {
          templateUrl: 'templates/projects_all.html',
          controller: 'ProjectsController'
        }
      }
    })

    .state('app.projects', {
      url: '/projects',
      views: {
        'menuContent': {
          templateUrl: 'templates/projects.html',
          controller: 'ProjectsController'
        }
      }
    })

    .state('app.project_view', {
      url: '/projects/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/project.html',
          controller: 'ProjectController'
        }
      }
    })


    .state('app.project_edit', {
      url: '/projects/:id/edit',
      views: {
        'menuContent': {
          templateUrl: 'templates/project_edit.html',
          controller: 'ProjectController'
        }
      }
    })


    .state('app.meetup_new', {
      url: '/projects/:id/meetups/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/meetup_new.html',
          controller: 'ProjectController'
        }
      }
    })

    .state('app.meetup', {
      url: '/projects/:project_id/meetups/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/meetup.html',
          controller: 'MeetupController'
        }
      }
    })

    .state('app.your_profile', {
      url: '/profile/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/your_profile.html',
          controller: 'ProfileController'
        }
      }
    })

    .state('app.your_projects', {
      url: '/users/:user_id/projects',
      views: {
        'menuContent': {
          templateUrl: 'templates/your_projects.html',
          controller: 'ProjectsController'
        }
      }
    })


    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/projects');

});
