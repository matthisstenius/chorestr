var db = require('../models/model');

exports.showCompleted = function(req, res, next) {
	var sort = {};
	var queryString = req.query.sort;

	if (!queryString) {
		queryString = 'completedDate';
	}
	sort[queryString] = -1;

	db.Chores.find({user: req.user._id, status: 'completed'}).sort(sort).exec(function(err, chores) {
		if (err) {
			next(new Error('Could not find completed chores'));
		}

		db.User.findById(req.user._id, function(err, user) {
			res.render('completed', {
				title: 'All chores',
				user: user.username,
				chores: chores,
				meta: user.meta
			});
		});
	});
};

exports.completed = function(req, res, next) {
	var userId = req.user._id;

	db.Chores.findByIdAndUpdate(req.params.id, {
		status: 'completed',
		completedDate: new Date()
	}, function(err, chore) {
		if (err) {
			next(new Error('Could not complete chore'));
		}

		if (chore.completedDate < chore.due) {
			switch (chore.prio) {
				case "1" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.One": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						res.redirect('/' + req.user.username + '/chores');
					});

					break;

				case "2" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Two": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						res.redirect('/' + req.user.username + '/chores');
					});

					break;

				case "3" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Three": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						res.redirect('/' + req.user.username + '/chores');
					});

					break;

				case "4" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.For": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						res.redirect('/' + req.user.username + '/chores');
					});

					break;

				case "5" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Five": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						res.redirect('/' + req.user.username + '/chores');
					});

					break;
			}
		}

		else {
			console.log("misslyckad");

			db.findByIdAndUpdate(req.params.id, {
				status: 'failed',
				completedDate: new Date()
			}, function(err, chore) {
				if (err) {
					next(err);
				}


			});
		}

	});
};