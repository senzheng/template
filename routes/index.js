var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  if(req.session.username){
     res.render('index');
   }
   res.redirect('/');
  
});

router.get('/tempOne', function(req, res, next){
  if(req.session.username){
     res.render('tempOne', {"user" : req.session.username});
   }
   res.redirect('/');
});
//socket

router.get('/getMessage',function(req,res,next){
   var db = req.db;
    var collection = db.get('message');
    collection.find({"receiver" : req.session.username},{},function(e,doc){
        res.end(JSON.stringify(doc));
   });
});


router.post('/sendMessage', function(req, res, next){
	var db = req.db;
	var sender = req.body.sender;
	var receiver = req.body.receiver;
	var content = req.body.contents;

	var collection = db.get('message');
    var d = new Date();
    var n = d.toISOString();
    var MessageDate = n;
	collection.insert({
	    "sender" : req.session.username,
	    "receiver" : receiver,
	    "content": content,
	    "messageDate" : MessageDate,
	    "read" : false,
	    "new" : true
	},function (err, doc){
		if(err){
			res.send("There was a problem to send the message to" + receiver + "!");
		}else{
		  res.redirect('tempOne');
		}
	});

});


router.put('/marknew', function(req, res, next){
     var db = req.db;
    var collection = db.get('message');

    if(!req.body) { return res.send(400); } // 6

    collection.find({"receiver" : req.session.username }, {}, function(e,data){  
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404); } // 3

        var update = {$set:{"new" : false} }; // 4

        collection.update({"receiver" : req.session.username}, update,{ multi:true }, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
 });

router.get('/check:username', function (req, res, next){
    var db = req.db;
    var collection = db.get('user');
    collection.find({"username" : req.params.username},{},function (e,doc){
        res.end(JSON.stringify(doc));
   });
});

router.get('/validation:email', function (req, res, next){
    var db = req.db;
    var collection = db.get('user');
    collection.find({"email" : req.params.email},{}, function (e, doc){
         res.end(JSON.stringify(doc));
    });
});

router.get('/signup' , function (req, res, next){
  if(req.session.username){
      res.redirect('index');
  }

  res.render('signup');
});


/* put the new user's info into database*/
router.post('/resgister',function(req, res, next){
    var db = req.db;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var collection = db.get('user');

    collection.insert({
      "username" : username,
      "password" : password,
      "email" : email
    },function (err, doc){
      if(err){
        res.send("There was a problem to connect to the database! Please try later!");
      }else{
        res.redirect('/');
      }
    });
});

router.get('/login', function(req, res, next){
    if(req.session.username){
       res.redirect('/index');
    }

    res.render('login');
});


router.get('/', function (req, res, next){
   if(req.session.username){
     res.redirect('/index');
   }
     res.render('login');
 });

router.get('/loginB/:email/:password', function (req, res, next){
   var db = req.db;
   var collection = db.get('user');
   
   collection.find({"email" : req.params.email , "password" : req.params.password},{},function (err, data){
      if(data.length == 1){
        req.session.username = data[0].username;
        res.redirect('/index');
      }else if(data.length != 1){
        res.send("Please check you username and password");
      }
       
       //console.log(username);
       //res.end(JSON.stringify(data));

   });
});

//chat part begin
router.get('/getFriends', function (req, res, next){
  var db = req.db;
  var collection = db.get('user');
  collection.find({"username" : req.session.username},{}, function (err, data){
      res.end(JSON.stringify(data));
  });
});

//add a new friends into user's friends's list
router.put('/addfriends/:fname', function (req, res, next){
   var db = req.db;
    var collection = db.get('user');
    //var username = req.body.username;
    if(!req.body) { return res.send(400); } // 6

    collection.find({"username" : req.session.username }, {}, function(e,data){  
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404);} // 3

        var update = {$push:{"friends" : {"name" : req.params.fname, "Alias" : ""}} }; // 4

        collection.update({"username" : req.session.username}, update,{ multi:true }, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
});
//delete a friend from friends list
router.put('/DeleteFriend/:fname', function (req, res, next){
     var db = req.db;
    var collection = db.get('user');
    //var username = req.body.username;
    if(!req.body) { return res.send(400); } // 6

    collection.find({"username" : req.session.username }, {}, function(e,data){  
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404);} // 3

        var update = {$pull:{"friends" : {"name" : req.params.fname, "Alias" : ""}} }; // 4

        collection.update({"username" : req.session.username}, update,{ multi:true }, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
});

//chat part ends
router.get('/logout', function (req, res, next){
  req.session.destroy();
  res.redirect('/');
});

//template for trip
router.get('/tripitems', function (req, res, next){
  res.render('tripitems');
});

router.put('/markDone:itemname', function (req, res, next){
    var db = req.db;
    var collection = db.get('trip');
    //var username = req.body.username;
    if(!req.body) { return res.send(400); } // 6

    collection.find({"name" : req.params.itemname}, {}, function(e,data){  
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404);} // 3
         
        var update = {$set:{"Done" : !data[0].Done}}; // 4
         console.log(!data[0].Done);
        collection.update({"name" : req.params.itemname}, update,{ multi:true }, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
});

router.post('/insertNew' , function (req, res, next){
  var db = req.db;
    var name = req.body.name;
    var amount = req.body.amount;

    var collection = db.get('trip');

    collection.insert({
      "name" : name,
      "amount" : amount,
      "Done" : false
    },function (err, doc){
      if(err){
        res.send("There was a problem to connect to the database! Please try later!");
      }else{
        res.redirect('/tripitems');
      }
    });
})

router.get('/getitems', function (req, res, next){
  var db = req.db;
  var collection = db.get('trip');
  collection.find({},{}, function (err, data){
      res.end(JSON.stringify(data));
  });
});
  

  

module.exports = router;
