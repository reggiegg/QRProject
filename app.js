var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var models = require('./models');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var swig = require('swig');
var app = express();

var PostModel = models.PostModel;

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/public', express.static(path.join(__dirname + '/public')));
app.use('/public/assets/images/', express.static(path.join(__dirname, '/public/assets/images')));7

app.engine('html', swig.renderFile);


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

mongoose.connect('mongodb://admin:qrproject@ds031647.mongolab.com:31647/heroku_app34770203', function (error) { //Local
    if (error) {
      console.log("Cant Connect to mongoDB: "+ error);
    }
});


app.route('/')
	.get( function(req, res) {
		console.log(req.params.uid);	
		res.sendFile(__dirname+"/public/index.html");
	})
	.post(function(req, res, next) {
        var post;
        var uid = req.body.uid;
		console.log("POST: ");
		console.log("From Page: " + uid);
		console.log("Content: " + req.body.message);

		var clean = sanitizeHtml(req.body.message, {
		  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'img', 'u', 'strike'],
		  allowedAttributes: {
		    'img': [ 'src' ]
		  }
		});
		if (clean != ""){
			post = new PostModel({
				uid : uid,
				message: clean,
			});

			post.save(function (err) {
				if (!err) {
					console.log("SUCCESS: Post created");
					res.render(__dirname+"/public/index_template.html", {
							path : "/public/",
							uid : uid,
						});
				} else {
					return console.log("ERROR:" + err);
				}
			});     
		}else {
			res.render(__dirname+"/public/index_template.html", {
							path : "/public/",
							uid : uid,
						});
		}});


app.route('/p/:uid')
	.get( function(req, res) {
		uid = req.params.uid;
		res.render(__dirname+"/public/index_template.html", {
			path : "/public/",
			uid : uid,
		});	

	});
	// .post(function(req, res, next) {
	// 	uid = req.body.uid;
 //        var post;
	// 	console.log("POST: ");
	// 	console.log(req.body.uid);
	// 	console.log(req.body.message);

	// 	var clean = sanitizeHtml(req.param('message'), {
	// 	  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'img', 'u', 'strike'],
	// 	  allowedAttributes: {
	// 	    'img': [ 'src' ]
	// 	  }
	// 	});
	// 	if (clean != ""){
	// 		post = new PostModel({
	// 			uid:uid,
	// 			message: clean,
	// 		});

	// 		post.save(function (err) {
	// 			if (!err) {
	// 			  console.log("Post created");
	// 			  return res.sendFile(__dirname+"/public/index.html");
	// 			} else {
	// 			  return console.log(err);
	// 			}
	// 		});     
	// 	}else {
	// 		return res.sendFile(__dirname+"/public/index.html");
	// 	}});

app.route('/post/:uid')
    .get(function(req, res, next) {
    	if (req.params.uid){
        	PostModel.find({ uid : req.params.uid }, function (err, docs) {
            	res.json(docs);
        	});
        } else {
        	PostModel.find({}, function (err, docs) {
            	res.json(docs);
        	});	
    	}});
//     .post(function(req, res, next) {
//         var post;
// 		console.log("POST: ");
// 		console.log(req.param('message'));

// 		var clean = sanitizeHtml(req.param('message'), {
// 		  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'img'],
// 		  allowedAttributes: {
// 		    'img': [ 'src' ]
// 		  }
// 		});
// 		if (clean != ""){
// 			post = new PostModel({
// 				message: clean,
// 			});

// 			post.save(function (err) {
// 				if (!err) {
// 				  console.log("Post created");
// 				  return res.sendFile(__dirname+"/public/index.html");
// 				} else {
// 				  return console.log(err);
// 				}
// 			});     
// 		}else {
// 			return res.sendFile(__dirname+"/public/index.html");
// 		}
		
		    
// });
