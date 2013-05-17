var db = require('../models/model'),
	bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto');

exports.details = function(req, res, next) {
	var baseUri = 'http://www.gravatar.com/avatar/';

	db.User.findOne({username: req.user.username}, {username: 1, meta: 1, email: 1}, function(err, docs) {
		if (err) {
			next();
		}

		var gravatar = baseUri + crypto.createHash('md5').update(docs.email.toLowerCase().trim()).digest('hex') + '?d=mm';

		res.render('userProfile', {
			title: "Profile",
			userDetails: docs,
			user: docs.username,
			messages: req.session.messages,
			awardsCount: docs.meta.awards.length,
			profilePic: gravatar
		});

		req.session.messages = null;
	});
};

exports.edit = function(req, res, next) {
	db.User.findOne({username: req.user.username}, function(err, docs) {
		if (err) {
			next(err);
		}

		res.render('editProfile', {
			title: 'Edit profile',
			userProfile: docs,
			user: docs.username,
			messages: req.session.messages
		});

		req.session.messages = null;
	});

};

exports.save = function(req, res, next) {
	var body = req.body;

	req.assert('email', "Enter a valid email addres").notEmpty().isEmail();

	if (body.password || body.passwordAgain) {
		req.assert('passwordAgain', 'Password do not match.').equals(body.password);
		req.assert('password', 'Password must contain 6 characters or more.').len(6);
	}

	var errors = req.validationErrors(true);

	if (errors) {
		console.log(errors);
		req.session.messages = errors;
		res.redirect(req.path);
		return;
	}

	if (body.password && body.passwordAgain) {
		bcrypt.hash(body.password, null, null, function(err, hash) {

				if (err) {
					var report = new Error('Hash failed');
					report.inner = err;
					next(report);
				}

				db.User.findOneAndUpdate({username: req.user.username}, {
					password: hash,
					email: body.email
				}, function(err, user) {
					if (err) {
						next(err);
					}

					req.session.messages = "Your account details have been saved";
					res.redirect('/account/' + user.username);
				});
			});
	}

	else {
		db.User.findOneAndUpdate({username: req.user.username}, {
			email: body.email,
		}, function(err, user) {
			if (err) {
				next(err);
			}
			req.session.messages = "Your account details have been saved";
			res.redirect('/account/' + user.username);
		});
	}


};

exports.remove = function(req, res, next) {
	db.User.remove({username: req.params.user}, function(err, User) {
		if (err) {
			next(err)
		}

		db.Chores.remove({user: User._id}, function(err) {
			if (err) {
				next(err);
			}

		});
		req.session.destroy();
		res.redirect('/');
	});
};