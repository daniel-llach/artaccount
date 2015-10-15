var express = require('express')
var bodyParser = require('body-parser')
var UserModel = require('../models/user')
var jwt = require('jwt-simple');
var moment = require('moment')

module.exports.set = function(app) {

	app.get('/token', function(req, res){
		if (req.headers.username && req.headers.password) {

		  // Fetch the appropriate user, if they exist
	    UserModel.findOne({ username: req.headers.username }, function(err, user) {

				if (err) {
					// user cannot be found; may wish to log that fact here. For simplicity, just return a 401
					res.status(401).send('Authentication error: user cannot be found')
				}

				// check if the user exist
				if (!user) {
						res.status(401).send('Authentication error: No username exist')
						return;
        }

	      user.comparePassword(req.headers.password, function(err, isMatch) {
	      	if (err) {
	      		// an error has occured checking the password. For simplicity, just return a 401
	      		res.status(401).send('Authentication error: an error has occured checking the password')
	      	}
					if (isMatch) {

						// Great, user has successfully authenticated, so we can generate and send them a token.
						var expires = moment().add('days', 7).valueOf()
						var token = jwt.encode(
							{
								iss: user.id,
								exp: expires
							},
							app.get('jwtTokenSecret')
						);
						res.json({
							token : token,
							expires : expires
							// user : user.toJSON()
						});
					} else {
						// The password is wrong...
						res.status(401).send('Authentication error: password is wrong')
					}
				});



	    });
		} else {
			// No username provided, or invalid POST request. For simplicity, just return a 401
			res.status(401).send('Authentication error: No username provided, or invalid POST request')
		}
	})

}
