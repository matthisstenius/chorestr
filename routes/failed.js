var db = require('../models/model');

exports.showFailed = function(req, res, next) {
	var userID = req.user._id;

	db.Chores.find({status: 'failed', user: userID}, function(err, chores) {
		if (err) {
			next(err);
		}

		db.User.findById(req.user._id, function(err, userDetails) {
			res.render('failed', {
				title: 'Failed chores',
				user: userDetails.username,
				chores: chores,
				meta: userDetails.meta
			});
		});
	});
};