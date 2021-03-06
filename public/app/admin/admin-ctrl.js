'use strict';

/* ADMIN CONTROLLER */

angular.module('Yote')

  // default resource controller generated by the CLI
  .controller('AdminCtrl', ['$scope', '$stateParams', '$state', 'UserFactory', 'PostFactory', function($scope, $stateParams, $state, UserFactory, PostFactory){
    console.log("AdminCtrl loaded...");
    UserFactory.list()
      .then(function(data) {
        $scope.users = data;
      }, function(data){
        alert(data);
      });

    $scope.actions = {};

    $scope.userRoles = ["admin"]

    $scope.removeRole = function(user, role) {
      var roleIndex = user.roles.indexOf(role);
      user.roles.splice(roleIndex, 1);
      UserFactory.update(user)
        .then(function(data){
          console.log(data);
        }, function(err){
          console.log(err);
        });

    }

    $scope.addRole = function(users, role) {
      console.log(role);
      angular.forEach(users, function(user) {
        console.log(user.roles.indexOf(role));
        if(user.doAction) {
          if(user.roles.indexOf(role) < 0) {
            user.roles.push(role);
            UserFactory.update(user)
              .then(function(data){
                console.log(data);
              }, function(err){
                console.log(err);
              });
          }
        }
      });
      console.log(users);
    }

    $scope.fontSizes = [
        { name:'micro', value:'.1rem'}
      , { name:'smallest', value:'.3rem'}
      , { name:'smaller', value:'.5rem'}
      , { name:'small', value:'.7rem'}
      , { name:'base', value:'1rem'}
      , { name:'large', value:'1.3rem'}
      , { name:'larger', value:'1.5rem'}
      , { name:'largest', value:'1.7rem'}
      , { name:'jumbo', value:'3rem'}
    ];
    $scope.theFontSize = $scope.fontSizes[4];

    $scope.lineHeights = [
        { name:'tightest', value:'.5'}
      , { name:'tighter', value:'.7'}
      , { name:'tight', value:'.8'}
      , { name:'base', value:'1'}
      , { name:'loose', value:'1.2'}
      , { name:'looser', value:'1.5'}
    ];
    $scope.theLineHeight = $scope.lineHeights[3];

    $scope.letterSpacings = [
        { name:'tightest', value:'-3px'}
      , { name:'tighter', value:'-2px'}
      , { name:'tight', value:'-1px'}
      , { name:'base', value:'0px'}
      , { name:'loose', value:'1px'}
      , { name:'looser', value:'2px'}
    ];
    $scope.theLetterSpacing = $scope.letterSpacings[3];

  }])

  .controller('DocsCtrl', ['$scope', '$stateParams', '$state', 'UserFactory', 'PostFactory', function($scope, $stateParams, $state, UserFactory, PostFactory){
    console.log("DocsCtrl loaded...");





  }])


  /**********************
  *  Custom Controllers
  ***********************/

// end of file
;
