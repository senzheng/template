//This is template that can 

angular.module('tempOne',[])
       .controller('tempOneCtrl',function ($scope, $http, $interval){
             //when you click the send then the message will save in the database. 
             //for the real application the database will be unined by database user.

               
              //$scope.test = user;
               loadMessage();
               $interval(function(){
               	 loadMessage();
               	 //changeStatus();
               },3000)
                function loadMessage(){
                  
                	$http.get("/getMessage").success(function (data){ 
                	      for(var i = 0; i < data.length; i++){
                               if(data[i].new){

                                if (!("Notification" in window)) {
							    alert("This browser does not support desktop notification");
							  }
							  else if (Notification.permission === "granted") {
							        var options = {
							                 body: data[i].content
							             };
							          var notification = new Notification("Hi there",options);
							  }
							  else if (Notification.permission !== 'denied') {
							    Notification.requestPermission(function (permission) {
							      if (!('permission' in Notification)) {
							        Notification.permission = permission;
							      }
							    
							      if (permission === "granted") {
							        var options = {
							              body: data[i].content
							          };
							        var notification = new Notification("Hi there",options);
							      }
							    });
							  }

							}
                	      }
                         
                          $scope.messagelist = data;
                          
                         

                	});
                      $http.put("/marknew").success(function (data){
                        
                   });

                }

                function MarkRead() {
                	$http.put("/markread").success(function (data){
                          
                	});
                }

       })
     .controller('navbarCtrl', function ($scope, $http){
                 $scope.city = "loading";
                 $scope.weather = "loading";

          if (navigator.geolocation) {
                                      navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
                                    }
                                    else{
                                      showError("Your browser does not support Geolocation!");
                                    }

           function locationSuccess(position) {
                     var lat = position.coords.latitude;
                     var lon = position.coords.longitude;
                     
                     //search the user's current location's weather info (by using the openweathermap API)
                     var cityinfo = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat+ "&lon=" + lon +"&cnt=0&mode=json&appid=2de143494c0b295cca9337e1e96b00e0";
                     $http.get(cityinfo).success(function (data){
                          $scope.city = data.city.name;
                          $scope.weather = data.list[0].weather[0].main;
                     });
                      
                  }

           function locationError(error){
                      switch(error.code) {
                      case error.TIMEOUT:
                      showError("A timeout occured! Please try again!");
                         break;
                      case error.POSITION_UNAVAILABLE:
                         showError('We can\'t detect your location. Sorry!');
                          break;
                      case error.PERMISSION_DENIED:
                           showError('Please allow geolocation access for this to work.');
                          break;
                       case error.UNKNOWN_ERROR:
                           showError('An unknown error occured!');
                          break;
                       }

              }

            function showError(msg){
                     weatherDiv.addClass('error').html(msg);
                  }

     });


