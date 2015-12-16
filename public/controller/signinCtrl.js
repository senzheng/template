angular.module('signin',[])
       .controller('signinCtrl', function ($scope, $http){
       	                 $scope.usernamenonvalid = true;
       	                 $scope.pnonvalid = true;
                         $scope.emailnonvalid = true;
       	      $scope.check = function (username){
       	      	//$scope.test = username;
                  if(username != null){
                    
                   $http.get("/check" + username).success(function (data){ 
                    /*
                       if the data return from the database which length is 0 then username is good to use
                       otherwise choose other one
                    */
                        if(data.length > 0){
                              $scope.success = undefined;
                              $scope.usernamenonvalid = true;
                              $scope.alert = "The username has existed";
                        }else if(data.length == 0){
                               $scope.alert = undefined;
                              $scope.usernamenonvalid = false;
                              $scope.success = "The username is good to use";
                        }
                    });
                  }
               };
              $scope.checkE = function (email){
                if(email != null){
                  $http.get("/validation" + email).success(function (data){
                       if(data.length > 0){
                              $scope.success = undefined;
                              $scope.emailnonvalid = true;
                              $scope.alert = "The email has been Registed";
                        }else if(data.length == 0){
                              $scope.alert = undefined;
                              $scope.emailnonvalid = false;
                              $scope.success = "The email is good to use";
                        }
                  });
                }

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