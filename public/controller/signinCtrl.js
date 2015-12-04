angular.module('signin',[])
       .controller('signinCtrl', function ($scope, $http){
       	                 $scope.nonvalid = true;
       	                 $scope.pnonvalid = true;
       	      $scope.check = function (username){
       	      	//$scope.test = username;
       	      	   $http.get("/check" + username).success(function (data){ 
       	      	   	/*
                       if the data return from the database which length is 0 then username is good to use
                       otherwise choose other one
                    */
                	      if(data.length > 0){
                              $scope.nonvalid = true;
                              $scope.test = "The username has existed";
                	      }else if(data.length == 0){
                              $scope.nonvalid = false;
                              $scope.test = "The username is good to use";
                	      }
       	            });
       	      };

              /*Test the password is valid or not*/
              $scope.checkP = function (password){
              	if(password.length > 5){
                      $scope.pnonvalid = false;

              	}else{
                      $scope.test = "The length of password should be no less than 6"
                      $scope.pnonvalid = true;
              	}
              }
                  
       	           

       });