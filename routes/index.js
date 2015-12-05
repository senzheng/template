var express = require('express');
var router = express.Router();


//check the user dupulication

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


router.get('/signin', function(req, res, next){
     if(req.session.username){
      res.render('tempOne');
   }
     res.redirect('/signin');
     
});
/* put the new user's info into database*/
router.post('/resgister',function(req, res, next){
    var db = req.db;
    var username = req.body.username;
    var password = req.body.password;

    var collection = db.get('user');

    collection.insert({
      "username" : username,
      "password" : password
    },function (err, doc){
      if(err){
        res.send("There was a problem to connect to the database! Please try later!");
      }else{
        res.redirect('/login');
      }
    });
});


router.get('/', function (req, res, next){
   if(req.session.username){
     res.redirect('/tempOne');
   }
     res.render('login');
 });

router.get('/loginB/:username/:password', function (req, res, next){
   var db = req.db;
   var collection = db.get('user');
   
   collection.find({"username" : req.params.username , "password" : req.params.password},{},function (err, data){
      if(data.length == 1){
        req.session.username = req.params.username;
        res.redirect('/tempOne');
      }else if(data.length != 1){
        res.send("Please check you username and password");
      }
       
       //console.log(username);
       //res.end(JSON.stringify(data));

   });
});

router.get('/logout', function (req, res, next){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
