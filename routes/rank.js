var db = require('../models/model');

module.exports = function(req, res, next) {
	db.User.findById(req.user._id, function(err, user) {
		if (err) {
			next(err);
		}

		switch (true) {
			case (user.meta.completedTotal === 10):
				user.meta.rank = "Amateur";
				user.save(function(err) {
					if (err) {
						next(err);
					}
				});

				new db.Activity({
					title: 'Earned rank Amateur',
					date: new Date()
				}).save(function(err, activity) {
					if (err) {
						next(err);
					}

					user.meta.activity.push(activity);

					user.save(function(err) {
						if (err) {
							next(err);
						}
					});
				});

			break;

			case (user.meta.completedTotal === 50):
				user.meta.rank = "Pro";
				user.meta.multiplier = 2;
				user.save(function(err) {
					if (err) {
						next(err);
					}
				});

				new db.Activity({
					title: 'Earned rank Pro',
					date: new Date()
				}).save(function(err, activity) {
					if (err) {
						next(err);
					}

					user.meta.activity.push(activity);

					user.save(function(err) {
						if (err) {
							next(err);
						}
					});
				});

			break;

			case (user.meta.completedTotal === 100):
				user.meta.rank = "King of Chores";
				user.meta.multiplier = 3;
				user.save(function(err) {
					if (err) {
						next(err);
					}
				});

				new db.Activity({
					title: 'Earned rank King of Chores',
					date: new Date()
				}).save(function(err, activity) {
					if (err) {
						next(err);
					}

					user.meta.activity.push(activity);

					user.save(function(err) {
						if (err) {
							next(err);
						}
					});
				});

			break;
		}
	});
};