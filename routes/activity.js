var db = require('../models/model');

exports.showActivity = function(req, res, next) {

	db.User.findOne({username: req.user.username}, {meta: 1}, function(err, docs) {
		if (err) {
			next();
		}

		res.send(docs.meta.activity.reverse());

	});
	req.session.notification = null;
};