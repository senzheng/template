//In friendListCtrl controller we have to define one method: getThe userlist

angular.module('friendList', [])
       .factory('friends',['http', function ($http){
       	  var baseurl = '/getFriends';
          var friends = {};

          friends.getFriendList = function () {
             return	$http.get(baseurl);
          }
       }])
       .controller('friendListCtrl', function ($scope, $http){
             
       })
  