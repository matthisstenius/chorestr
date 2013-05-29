var db = require('../models/model'),
	badgeCollection = [];

// Check if goal for earning badge is true
module.exports.check = function(req, res, next, callback) {
		var userId = req.user._id,
			badge, activity, now;

		db.User.findById(userId, function(err, user) {
			if (err) {
				next(err);
				return;
			}

			var awardExists = function(id) {
				// Om samma badge redan finns avbryt
				for (var i = 0; i < user.meta.awards.length; i += 1) {
					if (user.meta.awards[i].name === id) {
						return false;
					}
				}

				return true;
			};


			if (user.meta.completedTotal === 1) {
				now = new Date();

				badge = {
					name: 'Completed first chore',
					src: '/img/badges/first-chore-completed.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed first chore',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.completedTotal === 10) {
				now = new Date();

				badge = {
					name: 'Completed 10 chores',
					src: '/img/badges/completed-10-chores.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 10 chores',
					date: now
				};

				user.meta.activity.push(activity);

			}

			if (user.meta.completedTotal === 50) {
				now = new Date();

				badge = {
					name: 'Completed 50 chores',
					src: '/img/badges/completed-50-chores.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 50 chores',
					date: now
				};

				user.meta.activity.push(activity);

			}

			if (user.meta.completedTotal === 100) {
				now = new Date();

				user.meta.awards.push({
					name: 'Completed 100 chores',
					src: '/img/badges/completed-100-chores.svg',
					date: now.toDateString()
				});

				activity = {
					title: 'Awarded badge Completed 100 chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.completedTotal === 500) {
				now = new Date();

				badge = {
					name: 'Completed 500 chores',
					src: '/img/badges/completed-500-chores.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 500 chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			// Check score
			if (user.meta.points >= 1000 && user.meta.points <= 1500 && awardExists('Earned 1000 points')) {
				now = new Date();

				badge = {
					name: 'Earned 1000 points',
					src: '/img/badges/1000-points.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Earned 1000 points',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.points >= 7000 && user.meta.points <= 7500 && awardExists('Earned 7000 points')) {
				now = new Date();

				badge = {
					name: 'Earned 7000 points',
					src: '/img/badges/7000-points.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Earned 7000 points',
					date: now
				};

				user.meta.activity.push(activity);
			}

			// Check completed chores by prio
			if (user.meta.completedPrio.One === 15 && awardExists('Completed 15 prio-one chores')) {
				now = new Date();

				badge = {
					name: 'Completed 15 prio-one chores',
					src: '/img/badges/completed-15-prio-one.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 15 prio-one chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.completedPrio.Two === 15 && awardExists('Completed 15 prio-two chores')) {
				now = new Date();

				badge = {
					name: 'Completed 15 prio-two chores',
					src: '/img/badges/completed-15-prio-two.svg',
					date: now.toDateString()
				};

				user.meta.awards.push();
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 15 prio-two chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.completedPrio.Three === 15 && awardExists('Completed 15 prio-three chores')) {
				now = new Date();

				badge = {
					name: 'Completed 15 prio-three chores',
					src: '/img/badges/completed-15-prio-three.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 15 prio-three chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			if (user.meta.completedPrio.For === 15 && awardExists('Completed 15 prio-one four')) {
				now = new Date();

				badge = {
					name: 'Completed 15 prio-one four',
					src: '/img/badges/completed-15-prio-four.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 15 prio-four chores',
					date: now
				};

				user.meta.activity.push(activity);
			}


			if (user.meta.completedPrio.Five === 15 && awardExists('Completed 15 prio-five chores')) {
				now = new Date();

				badge = {
					name: 'Completed 15 prio-five chores',
					src: '/img/badges/completed-15-prio-five.svg',
					date: now.toDateString()
				};

				user.meta.awards.push(badge);
				badgeCollection.push(badge);

				activity = {
					title: 'Awarded badge Completed 15 prio-five chores',
					date: now
				};

				user.meta.activity.push(activity);
			}

			user.save(function(err) {
				if ( (err)) {
					next(err);
				}

				callback(badgeCollection);
				badgeCollection = [];
			});

		});

	};