//This is template that can 
angular.module('tempOne',[])
       .controller('tempOneCtrl',function ($scope, $http, $interval){
             //when you click the send then the message will save in the database. 
             //for the real application the database will be unined by database user.

               
               loadMessage();
               $interval(function(){
               	 loadMessage();
               	 //changeStatus();
               },3000)
                function loadMessage(){
                	$http.get("/getMessage" + "sen_zheng").success(function (data){ 
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
                          
                          $scope.read() = function (date){

                          }

                	});
                      $http.put("/marknew" + "sen_zheng").success(function (data){
                        
                   });

                }

                function MarkRead() {
                	$http.put("/markread" + "sen_zheng").success(function (data){
                          
                	});
                }

       });