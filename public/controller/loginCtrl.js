angular.module('login',[])
       .controller('loginCtrl',function ($scope, $http){
             $scope.login = function (user){
             	$http.get("/loginB/" + user.username + "/" +user.password).success(function (data){ 
       	      	   	
                	      
       	            });
             }
       });