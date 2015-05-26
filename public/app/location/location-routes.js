angular.module('Yote')

.config(function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider){
  console.log('configure ui router for location');
  
  $locationProvider.html5Mode(true);

  $stateProvider

    /********************** 
    *  Location Routes
    ***********************/
    
    // parent state of location.  
    .state('location', {
      abstract: true
      , url: '/locations'
      , templateUrl: '/html/static/templates/default-layout'
      , controller: 'LocationCtrl'
    })

    // list of all posts.  url: 's' signifies /locations
    .state('location.list', {
      url: ''
      , views: {
        '' : {
          templateUrl: '/html/location/templates/list'
        }
      } 
    })

    .state('location.show', {
      url: '/:locationId/show'
      , views: {
        '' : {
          templateUrl: '/html/location/templates/show'
          , controller: 'LocationShowCtrl'
        }
      }
    })

    .state('location.new', {
      url: '/new'
      , views: {
        '' : {
          templateUrl: '/html/location/templates/create'
          , controller: 'LocationCreateCtrl'
        }
      }
    })

    .state('location.edit', {
      url: '/:locationId/edit'
      , views: {
        '': {
          templateUrl: '/html/location/templates/edit'
          , controller: 'LocationUpdateCtrl'
        }
      }
      , data: { role: 'login' } // this protects the client route 
    })

// ==> end state config
})

// end file
;