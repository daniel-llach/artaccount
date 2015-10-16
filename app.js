/**
 * Load up the project dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var mongoose = require('mongoose');
var url = require('url'); // req.body
var jwt = require('jwt-simple');
var config = require('./config');

/**
 * Import the model(s)
 */
var UserModel = require('./models/user')

/**
 * THe JWT middleware
 */
var jwtauth = require('./lib/jwtauth')

/**
 * Connect to the database
 */
mongoose.connect('mongodb://' + config.db_user + ':' + config.db_password + '@' + config.db_host + '/' + config.db_database);

/**
 * Create the express app
 * NOTE: purposely not using var so that app is accesible in modules.
 */
app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Set the secret for encoding/decoding JWT tokens
 */
app.set('jwtTokenSecret', 'artechileno')

/**
 * A simple middleware to restrict access to authenticated users.
 */
var requireAuth = function(req, res, next) {
	if (!req.user) {
		res.end('Not authorized', 401)
	}	else {
		next()
	}
}

/**
 * Load up the controllers
 */
var controllers = require('./controllers')
controllers.set(app)

/*
 * Start listening
 */
var server = app.listen(process.env.PORT || 5000, function() {
	console.log('Caldearte account listening on port %d'.green, server.address().port)
});

/**
 * Protected routes
 */
app.get('/secret', jwtauth, requireAuth, function(req, res){
	res.json(req.user); // pass the user data
})

/**
 * Unprotected routes
 */
app.post('/register', function(req, res){
  var user = new UserModel();
  user.username = req.param('username');
  user.password = req.param('password');
  user.plan = req.param('plan');
  console.log("user: ", user);

  user.save(function(err){
  	if (err) {
  		console.log('Could not save user.'.red);
      res.status(400).send('Could not save user');
  	} else {
  		console.log('Database seeded'.green)
      // show new user info
      res.json({
        user: user.toJSON()
      })
  	}
  	// process.exit()
  })
});
