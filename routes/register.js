var bcrypt = require('bcrypt-nodejs'),
	db = require('../models/model');

exports.register = function(req, res) {
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}

	res.render('register', {
		title: 'Register',
		errors: req.session.regErrors,
		userExists: req.session.userExists,
		userInput: req.session.userInput,
		user: username
	});

	req.session.regErrors = null;
	req.session.userExists = null;
	req.session.userInput = null;
};

exports.add = function(req, res, next) {
	var body = req.body;

	req.assert('username', 'Enter a username. Only Alphanumeric characters allowed').notEmpty().isAlphanumeric();
	req.assert('email', 'Invalid email').isEmail();
	req.assert('password', 'Enter a password').notEmpty().len(6);
	req.assert('password', 'Password must contain 6 character or more').len(6);

	var regErrors = req.validationErrors(true);


	if (regErrors) {
		req.session.regErrors = regErrors;

		req.session.userInput = {
			username: body.username,
			email: body.email
		};

		res.redirect('/register');

		return;
	}

	db.User.findOne({username: body.username}, function(err, user) {
		if (err) {
			next(err);
			return;
		}

		if (user) {
			req.session.userExists = 'This username allready exists';
			req.session.userInput = {
				username: body.username,
				email: body.email
			};
			res.redirect('/register');
		}

		else {
			db.User.findOne({email: body.email}, function(err, user) {
				if (err) {
					next(err);
					return;
				}

				if (user) {
					req.session.userExists = 'This email allready exists';
					req.session.userInput = {
						username: body.username,
						email: body.email
					};
					res.redirect('/register');
				}

				else {
					bcrypt.hash(body.password, null, null, function(err, hash) {
						if (err) {
							next(err);
							return;
						}

						new db.User({
							username: body.username,
							email: body.email,
							password: hash
						}).save(function(err, docs) {
							if (err) {
								next(err);
								return;
							}

							req.session.user = {
								username: docs.username,
								_id: docs._id,
								email: docs.email
							};

							req.session.tz = body.timeZone;

							res.redirect('/' + docs.username + '/chores');

						});
					});
				}
			});

		}
	});


};