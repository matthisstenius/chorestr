var db = require('../models/model');

module.exports = function(req, res, next) {
	var activity, activity2;

	db.User.findById(req.user._id, function(err, user) {
		if (err) {
			next(err);
			return;
		}

		switch (true) {
			case (user.meta.completedTotal === 10):
				user.meta.rank = 'Amateur';

				activity = {
					title: 'Earned rank Amateur',
					date: new Date()
				};

				user.meta.activity.push(activity);
				req.session.notification += 1;

			break;

			case (user.meta.completedTotal === 50):
				user.meta.rank = 'Pro';
				user.meta.multiplier = 2;

				activity = {
					title: 'Earned rank Pro',
					date: new Date()
				};

				activity2 = {
					title: 'Earned 2x multiplier',
					date: new Date()
				};

				user.meta.activity.push(activity, activity2);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 100):
				user.meta.rank = 'King of Chores';
				user.meta.multiplier = 3;

				activity = {
					title: 'Earned rank King of Chores',
					date: new Date()
				};

				activity2 = {
					title: 'Earned 3x multiplier',
					date: new Date()
				};

				user.meta.activity.push(activity, activity2);
				req.session.notification += 2;

			break;
		}

		user.save(function(err) {
			if (err) {
				next(err);
			}
		});
	});
};