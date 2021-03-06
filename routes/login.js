var db = require('../models/model'),
	bcrypt = require('bcrypt-nodejs'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto');

var smtpTransport = nodemailer.createTransport('SMTP', {
	service: 'Mailjet',
	auth: {
		user: 'b43b0ea84d8cfa6118195b382fd1d62d',
		pass: 'e11cff82764a0fe87d94fc3f1ae448b1'
	}
});


exports.show = function(req, res, next) {
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}

	res.render('login', {
		title: 'Log in - chorestr.com',
		error: req.session.loginError,
		user: username,
		username: req.session.username
	}, function(err, html) {
		req.session.loginError = null;
		req.session.username = null;
		res.send(html);
	});
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
					req.session.tz = body.timeZone;

					req.session.user = {
						_id: user._id,
						username: user.username,
						email: user.email
					};

					res.redirect('/' + user.username + '/chores');

				}

				else {
					req.session.loginError = 'Username or password incorrect';
					res.redirect('/login');
				}
			});
		}

		else {
			req.session.loginError = 'Username or password incorrect';
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
		title: 'Forgot password - chorestr.com',
		messages: req.session.messages,
		user: username
	}, function(err, html) {
		req.session.messages = null;
		res.send(html);
	});
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

				var text = 'Chorestr received a request to reset the password for your Chorestr account. To reset your password click on the link below (or copy and paste it in your browser).';
				var resetUrl = req.headers.host + '/reset/' + user._id + '/' + buf.toString('hex');

				var mailOptions = {
					from: 'Chorestr support <support@chorestr.com>',
					to: user.email,
					subject: 'Reset password',
					html: "<html><p>" + text + "</p><a href='http://" + resetUrl + "'>" + resetUrl + "</a><p> If you didn't request a password reset your can disregard this message.</p></html>"
				};

				smtpTransport.sendMail(mailOptions, function(err, response) {
					if (err) {
						next(err);
						return;
					}

					req.session.messages = {success: 'An email has been sent to you.'};
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
	db.User.findOne({_id: req.params.userId}, function(err, user) {
		if (err) {
			next(err);
			return;
		}

		if (user) {
			bcrypt.compare(req.params.token, user.resetToken, function(err, result) {
				if (err) {
					next(err);
				}

				if (result && new Date(Date.now()) <= user.resetDue) {
					res.render('reset', {
						title: 'Reset password - chorestr.com',
						userID: user._id,
						resetToken: req.params.token,
						messages: req.session.messages
					}, function(err, html) {
						req.session.messages = null;
						res.send(html);
					});
				}

				else {
					req.session.messages = {expired: 'This reset token has expired. You can request a new one below'};
					res.redirect('/forgot');
				}
			});
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
		errors.equals = 'Passwords does not match';
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
			return;
		}

		db.User.findByIdAndUpdate(req.params.userId, {
			password: hash
		}, function(err, user) {
			if (err) {
				next(err);
				return;
			}

			req.session.username = user.username;
			res.redirect('/login');
		});
	});

};

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};