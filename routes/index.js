var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/tempOne', function(req, res, next){
   res.render('tempOne');
});

router.get('/getMessage:receiver',function(req,res,next){
   var db = req.db;
    var collection = db.get('message');
    collection.find({"receiver" : req.params.receiver},{},function(e,doc){
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
	    "sender" : sender,
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


router.put('/marknew:receiver', function(req, res, next){
     var db = req.db;
    var collection = db.get('message');

    if(!req.body) { return res.send(400); } // 6

    collection.find({"receiver" : req.params.receiver }, {}, function(e,data){  
        if(e) { return res.send(500, e); } // 1, 2

        if(!data) { return res.send(404); } // 3

        var update = {$set:{"new" : false} }; // 4

        collection.update({"receiver" : req.params.receiver}, update,{ multi:true }, function(err) { // 5
            if(err) {
                return res.send(500, err);
            }

            res.json(data);
        });
    });
 });
module.exports = router;
