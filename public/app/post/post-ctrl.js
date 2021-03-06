'use strict';

//Post Index Controller
angular.module('Yote')

  // default resource controller generated by the CLI
  .controller('PostCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log('PostCtrl loaded...');
  }])

  /********************** 
  *  Custom Controllers 
  ***********************/

  .controller('PostListCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log('PostListCtrl loaded....');

    PostFactory.list()
      .then(function(data) {
        $scope.posts = data.posts;
        console.log(data);
      }, function(data){
        alert(data);
      });

    //list example with pagintion:
    // PostFactory.list({'page': 2, 'per': 2}).then(function(data) { console.log(data); });
    //searching example:
    // PostFactory.search({'featured': true}).then(function(data) { console.log(data); });
    //searching example with pagination:
    PostFactory.search({'featured': false}, {page: 2, per: 3}).then(function(data) { console.log(data); });
  }])

  .controller('PostShowCtrl', ['$scope', '$stateParams', '$state', 'PostFactory', function($scope, $stateParams, $state, PostFactory){
    console.log('PostShowCtrl loaded...');

    //load post from state params
    PostFactory.getAndPopulate($stateParams.postId)
      .then(function(data){
        $scope.post = data.post;
      }, function(data){
        alert(data);
      });

  }])

  .controller('PostCreateCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'PostFactory', function($scope, $stateParams, $state, $rootScope, PostFactory) {
    console.log('PostCreateCtrl loaded');
    //create action
    $scope.createAction = function(postData) {
      //set author to current user
      postData.author = $scope.currentUser._id;
      console.log("create action initiated");
      PostFactory.create(postData)
        .then(function(data) {
          if(data.success) {
            //go to post page
            $state.go('post.show', { slug: data.post.slug });
          } else {
            alert(data.message + " Please try again.");
          }
        });
    }
  }])

  .controller('PostUpdateCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'PostFactory', function($scope, $stateParams, $state, $rootScope, PostFactory) {
    console.log('PostUpdateCtrl loaded');
    
    //load post from state params
    PostFactory.getAndPopulate($stateParams.postId)
      .then(function(data){
        $scope.post = data.post;
      }, function(data){
        alert(data);
      });
    
    $scope.updateAction = function(postData) {
      console.log("udpate action initiated");
      PostFactory.update(postData)
        .then(function(data) {
          if(data.success) {
            //go to post page
            $state.go('post.show', { slug: data.post.slug });
          } else {
            alert(data.message + " Please try again.");
          }
        });
    }
  }])

// end of file
;