var db = require('../models/model');

exports.showActivity = function(req, res, next) {

	db.User.findOne({username: req.user.username}, {meta: 1}, function(err, docs) {
		if (err) {
			next();
			return;
		}

		res.send(docs.meta.activity.reverse());

		docs.meta.activity = [];

		docs.save(function(err) {
			if (err) {
				next(err);
				return;
			}
		})

	});
	req.session.notification = null;
};