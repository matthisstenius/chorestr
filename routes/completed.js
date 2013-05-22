var db = require('../models/model'),
	rank = require('../routes/rank'),
	badges = require('../routes/checkBadges');

exports.showCompleted = function(req, res, next) {
	// Take querystring and put it into an object
	var sort = {}, sortCompletedDate, sortPrio;
	var queryString = req.query.sort;

	if (queryString) {
		sort[queryString] = -1;
		res.cookie('sortCompleted', queryString, {maxAge:  30 * 86400 * 1000});
	}

	if (req.cookies.sortCompleted && !queryString) {
		sort[req.cookies.sortCompleted] = -1;
	}

	else {
		sort['completedDate'] = -1;
		sortCompletedDate = true;
	}

	if (sort.completedDate) {
		sortCompletedDate = true;
		sortPrio = false;
	}

	if (sort.prio) {
		sortPrio = true;
		sortCompletedDate = false;
	}

	db.Chores.find({user: req.user._id, status: 'completed'}).sort(sort).exec(function(err, chores) {
		if (err) {
			next(new Error('Could not find completed chores'));
		}

		db.User.findById(req.user._id, function(err, userDetails) {
			res.render('completed', {
				title: 'All chores',
				user: userDetails.username,
				chores: chores,
				meta: userDetails.meta,
				sortCompletedDate: sortCompletedDate,
				sortPrio: sortPrio
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

		// Increase count depending on prio
		if (chore.completedDate < chore.due) {
			db.User.findById(userId, function(err, user) {
				if (err) {
					next(err);
				}

				new db.Activity({
					title: 'Completed ' + chore.name,
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

				switch (chore.prio) {
					case "1" :
						var reward = chore.reward * user.meta.multiplier;
						user.update({$inc: {"meta.completedTotal": 1, "meta.points": reward, "meta.completedPrio.One": 1}}, function(err) {
							if (err) {
								next(err);
							}

							badges.check(req, res, next, function(badge) {
								req.session.alertBadge = badge;
								res.redirect('/' + req.user.username + '/chores');
							});

							rank(req, res, next);
						});

						break;

					case "2" :
						var reward = chore.reward * user.meta.multiplier;
						user.update({$inc: {"meta.completedTotal": 1, "meta.points": reward, "meta.completedPrio.Two": 1}}, function(err) {
							if (err) {
								next(err);
							}

							badges.check(req, res, next, function(badge) {
								req.session.alertBadge = badge;
								console.log(badge);
								res.redirect('/' + req.user.username + '/chores');
							});

							rank(req, res, next);

						});


						break;

					case "3" :
						var reward = chore.reward * user.meta.multiplier;
						user.update({$inc: {"meta.completedTotal": 1, "meta.points": reward, "meta.completedPrio.Three": 1}}, function(err) {
							if (err) {
								next(err);
							}

							badges.check(req, res, next, function(badge) {
								req.session.alertBadge = badge;
								res.redirect('/' + req.user.username + '/chores');
							});


							rank(req, res, next);

						});

						break;

					case "4" :
						var reward = chore.reward * user.meta.multiplier;
						user.update({$inc: {"meta.completedTotal": 1, "meta.points": reward, "meta.completedPrio.For": 1}}, function(err) {
							if (err) {
								next(err);
							}

							badges.check(req, res, next, function(badge) {
								req.session.alertBadge = badge;
								res.redirect('/' + req.user.username + '/chores');
							});

							rank(req, res, next);
						});

						break;

					case "5" :
						var reward = chore.reward * user.meta.multiplier;
						user.update({$inc: {"meta.completedTotal": 1, "meta.points": reward, "meta.completedPrio.Five": 1}}, function(err) {
							if (err) {
								next(err);
							}

							badges.check(req, res, next, function(badge) {
								req.session.alertBadge = badge;
								res.redirect('/' + req.user.username + '/chores');
							});

							rank(req, res, next);
						});

						break;
				}


			});

		}

		// Failed chores
		else {
			db.Chores.findByIdAndUpdate(req.params.id, {
				status: 'failed',
				completedDate: new Date()
			}, function(err, chore) {
				if (err) {
					next(err);
				}

				new db.Activity({
					title: 'Failed ' + chore.name,
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

				db.User.update({_id: userId}, {$inc: {"meta.failedTotal": 1}}, function(err, user) {
					if (err) {
						next(err);
					}

					res.redirect('/' + req.user.username + '/chores/failed');
				});

			});
		}

	});

};