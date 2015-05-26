'use strict';

/* LOCATION FACTORY */

angular.module('Yote')

/*******************************************************************************************
* By default, Yote uses Angular factories with the $http and $q services as the provider model. 
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

.factory('LocationFactory', ['$http', '$q', function($http, $q) {


  var LocationFactory = {};


  /************************************************************************************
  * 
  * This hits the Yote api generated with the scaffold. 
  *
  *************************************************************************************/


  var urlBase = "/api/locations";

  LocationFactory.create = function(CSV) {
    console.log("attempting to upload CSV in factory");
    var deferred = $q.defer();
    var postOptions = {
      //angular $post WILL NOT include files without these options.
      withCredentials: true
      , headers: {'Content-Type': undefined}
      , transformRequest: angular.identity
    }
    $http.post(urlBase, CSV, postOptions)
      .success(function(data) {
        if(data.success) {
          console.log("upload action successful!");
          console.log(data);
          deferred.resolve(data);
        } else {
          console.log("upload action failed 2 :(");
          console.log(data);
          deferred.reject(data);
        }
      }).error(function(err) {
        console.log("upload action failed 1 :(");
        console.log(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  LocationFactory.list = function(pagination) {
    var pageQuery = "";
    if(pagination) {
      pageQuery += "?page=" + pagination.page;
      pageQuery += "&per=" + pagination.per;
    }
    console.log("getting a list of all Locations");
    var deferred = $q.defer();
    $http.get(urlBase + pageQuery)
      .success(function(data) {
        if(data.success) {
          console.log("it worked!");
          console.log(data);
          deferred.resolve(data);
        } else {
          console.log("something wrong");
          console.log(data);
          deferred.reject(data);
        }
      }).error(function(err) {
        console.log("it failed :( ");
        console.log(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  // /********************************************************
  // *  Think about it before implementing search...
  // ********************************************************/
  // LocationFactory.search = function(query, pagination) {
  //   console.log("search locations with factory");
  //   console.log(query);
  //   var queryString;
  //   // build the query string form query object
  //   for(var key in query) {
  //     if(query.hasOwnProperty(key)) {
  //       queryString = "?" + key + "=" + query[key];
  //     } else {
  //       queryString += "&" + key + "=" + query[key];
  //     }
  //   }
  //   console.log(queryString);
  //   var pageQuery = "";
  //   if(pagination) {
  //     pageQuery += "&page=" + pagination.page;
  //     pageQuery += "&per=" + pagination.per;
  //   }
  //   var deferred = $q.defer();
  //   $http.get(urlBase + "/search" + queryString + pageQuery)
  //     .success(function(data) {
  //       if(data.success) {
  //         console.log("Search results: ");
  //         console.log(data);
  //         deferred.resolve(data);
  //       } else {
  //         console.log("something wrong");
  //         console.log(data);
  //         deferred.reject(data);
  //       }
  //     }).error(function(err) {
  //       console.log("Factory failed");
  //       console.log(err);
  //       deferred.reject(err);
  //     });
  //   return deferred.promise;
  // }

  LocationFactory.getById = function(id) {
    console.log("get this location with id: " + id);
    var deferred = $q.defer();
    $http.get(urlBase + '/' + id)
      .success(function(data) {
        if(data.success) {
          console.log("it worked!");
          console.log(data);
          deferred.resolve(data);
        } else {
          console.log("something wrong");
          console.log(data);
          deferred.reject(data);
        }
      }).error(function(err) {
        console.log("it failed :( ");
        console.log(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  LocationFactory.getAndPopulate = function(id) {
    console.log("get and populate this location with id: " + id);
    var deferred = $q.defer();
    $http.get(urlBase + '/' + id + '/populate')
      .success(function(data) {
        if(data.success) {
          console.log("it worked!");
          console.log(data);
          deferred.resolve(data);
        } else {
          console.log("something wrong");
          console.log(data);
          deferred.reject(data);
        }
      }).error(function(err) {
        console.log("it failed :( ");
        console.log(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  // LocationFactory.create = function(locationData) {
  //   console.log("attempting to create a new location in factory");
  //   var deferred = $q.defer();
  //   $http.post(urlBase, locationData)
  //     .success(function(data) {
  //       if(data.success) {
  //         console.log("create action successful!");
  //         console.log(data);
  //         deferred.resolve(data);
  //       } else {
  //         console.log("create action failed 2 :(");
  //         console.log(data);
  //         deferred.reject(data);
  //       }
  //     }).error(function(err) {
  //       console.log("create action failed 1 :(");
  //       console.log(err);
  //       deferred.reject(err);
  //     })
  //   return deferred.promise;
  // }

  LocationFactory.update = function(locationData) {
    console.log("attempting to update location with id " + locationData._id + " in factory");
    var deferred = $q.defer();
    $http.put(urlBase + '/' + locationData._id, locationData)
      .success(function(data) {
        if(data.success) {
          console.log("update action successful!");
          console.log(data);
          deferred.resolve(data);
        } else {
          console.log("update action failed 2 :(");
          console.log(data);
          deferred.reject(data);
        }
      }).error(function(err) {
        console.log("update action failed 1 :(");
        console.log(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /*********************************************************
  *  Think about it before implementing delete...
  *********************************************************/

  // LocationFactory.delete = function(locationData) {
  //   console.log("attempting to delete location with id " + locationData._id + "in factory");
  //   var deferred = $q.defer();
  //   $http.delete(urlBase + '/' + locationData._id)
  //     .success(function(data) {
  //       if(data.success) {
  //         console.log("delete action successful :(");
  //         console.log(data);
  //         deferred.resolve(data);
  //       } else {
  //         console.log("delete action failed 2 :)");
  //         console.log(data);
  //         deferred.reject(data);
  //       }
  //     }).error(function(err) {
  //       console.log("delete action failed 1 :)");
  //       console.log(err);
  //       deferred.reject(err);
  //     });
  //   return deferred.promise;
  // }


  return LocationFactory;

}])

// end of file
;

