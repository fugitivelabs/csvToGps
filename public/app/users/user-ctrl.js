'use strict'

angular.module('Yote')

  .controller('UserCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserCtrl loaded');
  }])

  .controller('UserLoginCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserLoginCtrl loaded');
    $scope.loginAction = function(username, password) {
      console.log("login action initiated");
      UserFactory.login(username, password)
        .then(function(data) {
          if(data.success) {
            //change state programmatically
            //set root scope to user
            $rootScope.currentUser = data.user;

            if($stateParams.next) {
              $state.go($stateParams.next, $rootScope.next.toParams);
            } else {
              $state.go('static.home');
            }
          } else {
            alert(data.message + " Please try again.");
          }
        });
    }
  }])

  .controller('UserLogoutCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserLogoutCtrl loaded');
    UserFactory.logout()
      .then(function(data) {
        if(data.success) {
          //change state programmatically
          //set root scope to user
          $rootScope.currentUser = {};
          console.log("Logged out");
          $state.go('static.home');
        } else {
          alert(data.message + " Please try again.");
        }
      });
  }])

  .controller('UserRegisterCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserRegisterCtrl loaded');
    $scope.registerAction = function(userData) {
      console.log("register action initiated");
      UserFactory.register(userData)
        .then(function(data) {
          if(data.success) {
            //NOW LOGIN
            $rootScope.currentUser = data.user;
            if($stateParams.next) {
              $state.go($stateParams.next, $rootScope.next.toParams);
            } else {
              $state.go('static.home');
            }
          } else {
            alert(data.message + " Please try again.");
          }
        });
    }
  }])


  .controller('UserProfileCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserProfileCtrl loaded');
    //get user profile
    $scope.user = $rootScope.currentUser;
    console.log($scope.user);

    $scope.updateProfile = function(userData) {
      //any validation neede?
      UserFactory.update(userData)
        .then(function(data) {
          if(data.success) {
            console.log("User profile was updated in db");
          } else {
            console.log("failed to update user profile");
          }
        });
    }


  }])

  .controller('UserPasswordCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserPasswordCtrl loaded');
    //get user profile
    $scope.user = $rootScope.currentUser;
    $scope.changePassword = function(passwordData) {
      UserFactory.changePassword(passwordData)
        .then(function(data) {
            UserFactory.logout()
            .then(function(data) {
              if(data.success) {
                $rootScope.currentUser = {};
                console.log("Logged out");
                $state.go('user.login');
              } else {
                alert(data.message + " Please try again.");
              }
            });
        });
    }

  }])

  .controller('UserForgotPasswordCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserForgotPasswordCtrl loaded');
    $scope.requestReset = function(email) {
      UserFactory.requestPasswordReset(email)
        .then(function(data) {
          //does not actually check if the call was successful or not. 
          alert("A password reset request has been sent to your email.");
        });
    }

  }])

  .controller('UserResetPasswordCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'UserFactory', function($scope, $stateParams, $state, $rootScope, UserFactory) {
    console.log('UserResetPasswordCtrl loaded');
    UserFactory.checkResetRequest($stateParams.resetHex)
      .then(function(data) {
        if(data.success) {
          console.log("valid");
          $scope.isRequestValid = true;
          $scope.userId = data.userId;
        } else {
          console.log("invalid");
          $scope.isRequestValid = false;
        }
      });

    $scope.resetPassword = function(password) {
      if(password.newPass !== password.newPassConfirm) {
        console.log("PASSWORDS DO NOT MATCH");
        return false;
      } else {
        password.userId = $scope.userId;
        UserFactory.resetPassword(password)
          .then(function(data) {
            if(data.success) {
              $rootScope.currentUser = {};
              console.log("Logged out");
              $state.go('user.login');
            } else {
              alert(data.message + " Please try again.");
            }
          });
      }
    }

  }])
// end file
;

