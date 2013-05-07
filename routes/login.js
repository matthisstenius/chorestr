var db = require('../models/model'),
	bcrypt = require('bcrypt-nodejs'),
	email = require('emailjs'),
	crypto = require('crypto');

var server  = email.server.connect({
   user:    "admin@matthis.se",
   password:"meaCYsM66ywuyRP9hN",
   host:    "smtp.gmail.com",
   ssl:     true
});

exports.show = function(req, res, next) {
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}

	res.render('login', {
		title: 'Log in',
		error: req.session.loginError,
		username: req.session.username,
		user: username
	});

	req.session.loginError = null;
	req.session.username = null;
};

exports.login = function(req, res, next) {
	var body = req.body;

	db.User.findOne({username: body.username}, function(err, user) {
		if (err) {
			next(new Error('Something broke in db'));
		}

		if (user) {
			bcrypt.compare(body.password, user.password, function(err, result) {
				if (err) {
					next(new Error('bcrypt error'));
				}

				if (result) {
					req.session.user = user;
					res.redirect('/' + user.username + '/chores');

				}

				else {
					req.session.loginError = "Username or password incorrect";
					res.redirect('/login');
				}
			})
		}

		else {
			req.session.loginError = "Username or password incorrect";
			res.redirect('/login');
		}
	});

};

exports.showForgot = function(req, res, next) {
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}

	res.render('forgot', {
		title: 'Forgot password',
		messages: req.session.messages,
		user: username

	});

	req.session.messages = null;
};

exports.forgot = function(req, res, next) {
	var body = req.body,
		today = new Date(),
		resetDue = new Date();

	req.assert('email', 'Invalid email').isEmail();
	var errors = req.validationErrors(true);

	if (errors) {
		req.session.messages = errors;

		res.redirect('/forgot');
		return;
	}

	db.User.findOne({email: body.email}, function(err, user) {
		if (err) {
			next(err);
		}

		if (user) {
			crypto.randomBytes(16, function(err, buf) {
				if (err) {
					next(err);
				}

				bcrypt.hash(buf.toString('hex'), null, null, function(err, hash) {
					if (err) {
						next(err);
					}

					user.resetToken = hash;
					user.resetDue = resetDue.setDate(today.getDate() + 1);
					user.save();

				});

				var resetUrl = req.headers.host + '/reset/' + user._id + '/' + buf.toString('hex');

				var message = {
					text: 	 "hejhej",
				   	from:    "<no-reply@chorestr.com>",
				   	to:      "<" + user.email + ">",
				   	subject: "testing emailjs",
				   	attachment: [
				   		{data: "<html> <a href='" + resetUrl + "'>" + resetUrl + "</a></html>", alternative: true}
				   	]
				};

				server.send(message, function(err, message) {
					if (err) {
						next(err);
					}

					req.session.messages = {success: "An email has been sent to you."}
					res.redirect('/forgot');
				});
			});
		}

		else {
			req.session.messages = {exists: 'Could not find email adress'};
			res.redirect('/forgot');
			return;
		}


	});
};

exports.showReset = function(req, res, next) {
	var body = req.body;
	console.log("kommer jag hit");
	db.User.findOne({_id: req.params.userId}, function(err, user) {
		if (err) {
			next(err);
		}

		if (user) {
			bcrypt.compare(req.params.token, user.resetToken, function(err, result) {
				if (err) {
					next(err);
				}
				console.log(result);
				if (result && new Date(Date.now()) <= user.resetDue) {
					res.render('reset', {
						title: 'Reset password',
						userID: user._id,
						resetToken: req.params.token,
						messages: req.session.messages
					});

					req.session.messages = null;
				}

				else {
					req.session.messages = {expired: 'This reset token has expired. You can request a new one below'};
					res.redirect('/forgot');
				}
			})
		}

		else {
			req.session.messages = {expired: 'This reset token has expired. You can request a new one below'};
			res.redirect('/forgot');
		}

	});

};

exports.reset = function(req, res, next) {
	var body = req.body;

	req.assert('password', 'Passwords must contain atleast 6 characters').len(6);

	var errors = req.validationErrors(true);

	if (body.password !== body.passwordAgain) {
		errors.equals = "Passwords does not match";
	}

	if (errors) {
		req.session.messages = errors;
		res.redirect(req.path);
		return;
	}

	bcrypt.hash(body.password, null, null, function(err, hash) {

		if (err) {
			var report = new Error('Hash failed');
			report.inner = err;
			next(report);
		}

		db.User.findByIdAndUpdate(req.params.userId, {
			password: hash
		}, function(err, user) {
			if (err) {
				next(err);
			}

			req.session.username = user.username;
			res.redirect('/login');
		})
	});

};

exports.logout = function(req, res, next) {
	req.session.destroy()
	res.redirect('/');
};