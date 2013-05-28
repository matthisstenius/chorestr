var db = require('../models/model'),
	bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto');

exports.details = function(req, res, next) {
	var baseUri = 'http://www.gravatar.com/avatar/';

	db.User.findOne({username: req.user.username}, {username: 1, meta: 1, email: 1}, function(err, docs) {
		if (err) {
			next();
			return;
		}

		var todo = achievmentCountdown(docs);

		var gravatar = baseUri + crypto.createHash('md5').update(docs.email.toLowerCase().trim()).digest('hex') + '?d=mm';

		res.render('userProfile', {
			title: docs.username + "'s profile",
			userDetails: docs,
			user: docs.username,
			messages: req.session.messages,
			awardsCount: docs.meta.awards.length,
			awards: docs.meta.awards,
			profilePic: gravatar,
			nextStats: todo
		});

		req.session.messages = null;
	});

	function achievmentCountdown(docs) {
		var todo = {
			nextPointBadge: [],
			nextCompletedBadge: [],
			nextPrioBadge: []
		};

		if (docs.meta.rank === 'Novice') {
			todo.nextRank = 10 - docs.meta.completedTotal;
		}

		if (docs.meta.rank === 'Amateur') {
			todo.nextRank = 50 - docs.meta.completedTotal;
		}

		if (docs.meta.rank === 'Pro') {
			todo.nextRank = 100 - docs.meta.completedTotal;
		}


		if (docs.meta.points < 1000) {
			todo.nextPointBadge.push({
				required: 1000 - docs.meta.points,
				name: 'Earned 1000 points'
			});
		}

		if (docs.meta.points > 1000 && docs.meta.points < 7000) {
			todo.nextPointBadge.push({
				required: 7000 - docs.meta.points,
				name: 'Earned 7000 points'
			});
		}

		if (docs.meta.completedTotal < 10) {
			todo.nextCompletedBadge.push({
				required: 10 - docs.meta.completedTotal,
				name: 'Completed 10 chores'
			});
		}

		if (docs.meta.completedTotal > 10 && docs.meta.completedTotal < 50) {
			todo.nextCompletedBadge.push({
				required: 50 - docs.meta.completedTotal,
				name: 'Completed 50 chores'
			});
		}

		if (docs.meta.completedTotal > 50 && docs.meta.completedTotal < 100) {
			todo.nextCompletedBadge.push({
				required: 50 - docs.meta.completedTotal,
				name: 'Completed 50 chores'
			});
		}

		if (docs.meta.completedTotal > 100 && docs.meta.completedTotal < 500) {
			todo.nextCompletedBadge.push({
				required: 50 - docs.meta.completedTotal,
				name: 'Completed 50 chores'
			});
		}

		if (docs.meta.completedPrio.One < 15) {
			todo.nextPrioBadge.push({
				required: 15 - docs.meta.completedPrio.One,
				name: 'Completed 15 prio-one chores',
				prio: 'one'
			});
		}

		if (docs.meta.completedPrio.Two < 15) {
			todo.nextPrioBadge.push({
				required: 15 - docs.meta.completedPrio.Two,
				name: 'Completed 15 prio-two chores',
				prio: 'two'
			});
		}

		if (docs.meta.completedPrio.Three < 15) {
			todo.nextPrioBadge.push({
				required: 15 - docs.meta.completedPrio.Three,
				name: 'Completed 15 prio-three chores',
				prio: 'three'
			});
		}

		if (docs.meta.completedPrio.For < 15) {
			todo.nextPrioBadge.push({
				required: 15 - docs.meta.completedPrio.For,
				name: 'Completed 15 prio-four chores',
				prio: 'four'
			});
		}

		if (docs.meta.completedPrio.Five < 15) {
			todo.nextPrioBadge.push({
				required: 15 - docs.meta.completedPrio.Five,
				name: 'Completed 15 prio-five chores',
				prio: 'five'
			});
		}

		return todo;
	}
};

exports.edit = function(req, res, next) {
	db.User.findOne({username: req.user.username}, function(err, docs) {
		if (err) {
			next(err);
			return;
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
					next(err);
					return;
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
				return;
			}

			req.session.messages = "Your account details have been saved";
			res.redirect('/account/' + user.username);
		});
	}


};

exports.remove = function(req, res, next) {
	db.User.remove({username: req.params.user}, function(err, User) {
		if (err) {
			next(err);
			return;
		}

		db.Chores.remove({user: User._id}, function(err) {
			if (err) {
				next(err);
				return;
			}

		});
		req.session.destroy();
		res.redirect('/');
	});
};