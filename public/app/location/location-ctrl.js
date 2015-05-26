'use strict';

/* LOCATION CONTROLLERS */

angular.module('Yote')

  /********************************* 
  *
  *  Yote-cli Generated Controllers 
  *
  **********************************/

  .controller('LocationCtrl', ['$scope', '$stateParams', '$state', 'LocationFactory', function($scope, $stateParams, $state, LocationFactory) {
    console.log("LocationCtrl loaded...");
    
    LocationFactory.list()
      .then(function(data) {
        $scope.locations = data.locations;
      }, function(err) {
        console.log(err);
      });

  }])

  .controller('LocationShowCtrl', ['$scope', '$stateParams', '$state', 'LocationFactory', function($scope, $stateParams, $state, LocationFactory) {
    console.log('LocationShowCtrl loaded...');

    LocationFactory.show($stateParams.locationId)
      .then(function(data) {
        $scope.location = data.location;
      }, function(err) {
        console.log(err);
      });

  }])

  .controller('LocationCreateCtrl', ['$scope', '$stateParams', '$state', 'LocationFactory', function($scope, $stateParams, $state, LocationFactory) {
    console.log('LocationCreateCtrl loaded...');

    var CSVForm = new FormData();

    $scope.attachFile = function(files) {
      console.log("attach file called");
      console.log(files[0]);
      CSVForm = new FormData();
      CSVForm.append("file", files[0]);
      console.log("CSV file added to formdata object");
    }

    $scope.createAction = function() {
      console.log('createAction initiated...');
      LocationFactory.create(CSVForm)
        .then(function(data) {
          if(data.success) {
            // go to location show page
            console.log("SUCCESSFULLY BACK TO CONTROLLER");
            // $state.go('location.show', { locationId: data.location._id });
          } else {
            alert(data.message + " Please try again");
          }
        });
    }
  }])

  .controller('LocationUpdateCtrl', ['$scope', '$stateParams', '$state', 'LocationFactory', function($scope, $stateParams, $state, LocationFactory) {
    console.log('LocationUpdateCtrl loaded...');
    
    LocationFactory.show($stateParams.locationId)
      .then(function(data) {
        $scope.location = data.location;
        console.log(data);
      }, function(err) {
        console.log(err);
      });

    $scope.updateAction = function(locationData) {
      LocationFactory.update(locationData)
        .then(function(data) {
          if(data.success) {
            // go to location show page
            $state.go('location.show', { locationId: data.location._id });
          } else {
            alert(data.message + " Please try again");
          }
        });
    }

    // Think about this before implementing
    // $scope.deleteAction = function(locationData) {
    //   LocationFactory.delete(locationData)
    //     .then(function(data) {
    //       if(data.success) {
    //         // go to location show page
    //         $state.go('location.show', { locationId: data.location.id});
    //       } else {
    //         alert(data.message + " Please try again");
    //       }
    //     });
    // }

  }])


// end of file
;