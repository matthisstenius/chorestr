var db = require('../models/model');

exports.showBadges = function(req, res, next) {
	db.User.findOne({username: req.user.username}, {username: 1, meta: 1, email: 1}, function(err, docs) {
		if (err) {
			next();
			return;
		}

		res.render('badges', {
			title: "My badges",
			userDetails: docs,
			user: docs.username,
			awards: docs.meta.awards
		});
	});
};