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

			case (user.meta.completedTotal === 25):
				user.meta.rank = 'Trainee';

				activity = {
					title: 'Earned rank Trainee',
					date: new Date()
				};

				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 50):
				user.meta.rank = 'Jr. Chorestr';

				activity = {
					title: 'Earned rank Jr Chorestr',
					date: new Date()
				};

				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 75):
				user.meta.rank = 'Semi-Pro';

				activity = {
					title: 'Earned rank Semi-Pro',
					date: new Date()
				};

				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 125):
				user.meta.rank = 'Sr. Chorestr';
				user.meta.multiplier = 2;

				activity = {
					title: 'Earned rank Sr. Chorestr',
					date: new Date()
				};

				activity2 = {
					title: 'Earned 2x multiplier',
					date: new Date()
				};

				user.meta.activity.push(activity, activity2);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 175):
				user.meta.rank = 'Bronze Chorestr';

				activity = {
					title: 'Earned rank Bronze Chorestr',
					date: new Date()
				};


				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 200):
				user.meta.rank = 'Silver Chorestr';

				activity = {
					title: 'Earned rank Silver Chorestr',
					date: new Date()
				};


				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			break;

			case (user.meta.completedTotal === 250):
				user.meta.rank = 'Gold Chorestr';

				activity = {
					title: 'Earned rank Gold Chorestr',
					date: new Date()
				};


				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			break;

			case (user.meta.completedTotal === 275):
				user.meta.rank = 'Platinum Chorestr';

				activity = {
					title: 'Earned rank Platinum Chorestr',
					date: new Date()
				};


				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			break;

			case (user.meta.completedTotal === 325):
				user.meta.rank = 'Master of Chores';

				activity = {
					title: 'Earned rank Master of Chores',
					date: new Date()
				};


				user.meta.activity.push(activity);
				req.session.notification += 2;

			break;

			case (user.meta.completedTotal === 500):
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