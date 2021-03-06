'use strict';

/* USER FACTORY */

angular.module('Yote')

/*******************************************************************************************
* By default, Yote uses Angular factories as the services model. 
* 
* Using factories vs services vs provider is mostly a matter of preference, though 
* there are some fundamental advantages to each. 
* 
* A starting point for further documentation and discussion on the matter can be found at 
* http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/
*
* If services or providers are preferred for this specific resource, this is still the  
* place to put them.
*******************************************************************************************/

.factory('UserFactory', ['$http', '$q', function($http, $q) {
  console.log("user factory initiated");
  var urlBase = "/api/users";
  var UserFactory = {};

  UserFactory.login = function(username, password) {
    console.log("user login action called");
    var deferred = $q.defer();

    $http.post(urlBase + "/login", { 'username': username, 'password': password, 'next': '/' })
      .success(function(user) {
        if(user.success) { //intermediate if statement is unnecessary after dev is done
          console.log('LOGIN SUCCESSFUL');
          deferred.resolve(user);
        } else {
          console.log('LOGIN FAILURE');
          deferred.resolve(user);
        }
      })
      .error(function(err, user) {
        console.log('LOGIN FAILURE - error');
        deferred.resolve(err);
      });
      return deferred.promise;
  }

  UserFactory.logout = function() {
    console.log("user logout option called");
    var deferred = $q.defer();

    $http.post(urlBase + "/logout")
      .success(function(err) {
        if(!err) {
          console.log('LOGOUT SUCCESSFUL');
          deferred.resolve({"success": true});
        } else {
          console.log('LOGOUT FAILURE');
          deferred.resolve({"success": false, "error": err});
        }
      })
      .error(function(err, user) {
        console.log('LOGOUT FAILURE - error');
        deferred.resolve({"success": false, "error": err});
      });
    return deferred.promise;
  }

  UserFactory.register = function(userData) {
    console.log("user register option called");
    var deferred = $q.defer();

    $http.post(urlBase, userData)
      .success(function(user) {
        if(user.success) {
          console.log('REGISTER SUCCESS');
          deferred.resolve(user);
        } else {
          console.log('REGISTER FAILURE');
          // console.log(user);
          deferred.resolve(user);
        }
      })
      .error(function(err, user) {
        console.log('REGISTER FAILURE - err');
        deferred.resolve(err);
      });
    return deferred.promise;
  }


  UserFactory.list = function(pagination) {
    console.log("user list called in factory");
    var pageQuery = "";
    if(pagination) {
      pageQuery += "?page=" + pagination.page;
      pageQuery += "&per=" + pagination.per;
    }
    var deferred = $q.defer();

    $http.get(urlBase + pageQuery)
      .success(function(data){
        deferred.resolve(data.users);
      }).error(function() {
        deferred.reject("Error. Please try logging in as an admin");
      });
    return deferred.promise;
  }

  UserFactory.update = function(userData) {
    console.log("user update called in factory");
    var deferred = $q.defer();
    $http.put(urlBase + "/" + userData._id, userData)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function() {
        deferred.reject("Error. Please try again.");
      });
      return deferred.promise;
  }

  UserFactory.changePassword = function(password) {
    console.log("change password called in factory");
    var deferred = $q.defer();
    $http.post(urlBase + "/password", password)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function() {
        deferred.reject("Error. Please try again.");
      });
      return deferred.promise;
  }

  UserFactory.requestPasswordReset = function(email) {
    console.log("request password reset called in factory");
    var deferred = $q.defer();
    $http.post(urlBase + "/requestpasswordreset", { email: email })
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function() {
        deferred.reject("Error. Please try again.");
      });
      return deferred.promise;
  }

  UserFactory.checkResetRequest = function(resetHex) {
    console.log("checking for validity of reset request in factory");
    var deferred = $q.defer();
    $http.get(urlBase + "/checkresetrequest/" + resetHex)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function() {
        deferred.reject("Error. Please try again.");
      });
      return deferred.promise;
  }

  UserFactory.resetPassword = function(passwordReset) {
    console.log("password reset called in factory");
    var deferred = $q.defer();
    $http.post(urlBase + "/resetpassword", passwordReset)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function() {
        deferred.reject("Error. Please try again.");
      });
      return deferred.promise;
  }

  return UserFactory;

}])

// end of file
;