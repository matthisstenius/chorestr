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

		// Increase count depending on prio
		if (chore.completedDate < chore.due) {
			switch (chore.prio) {
				case "1" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.One": 1}}, function(err, user) {
						if (err) {
							next(err);
						}
						checkAwards(req, res, next);
						//res.redirect('/' + req.user.username + '/chores');
					});

					break;

				case "2" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Two": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						checkAwards(function(badge) {
							// sätt session
							res.redirect('/' + req.user.username + '/chores');
						});
					});

					break;

				case "3" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Three": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						checkAwards(function(badge) {
							// sätt session
							res.redirect('/' + req.user.username + '/chores');
						});

					});

					break;

				case "4" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.For": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						checkAwards(function(badge) {
							// sätt session
							res.redirect('/' + req.user.username + '/chores');
						});
					});

					break;

				case "5" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.Five": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						checkAwards(function(badge) {
							// sätt session
							res.redirect('/' + req.user.username + '/chores');
						});
					});

					break;
			}

		}

		// Failed chores
		else {
			console.log("misslyckad");

			db.Chores.findByIdAndUpdate(req.params.id, {
				status: 'failed',
				completedDate: new Date()
			}, function(err, chore) {
				if (err) {
					next(err);
				}

				db.User.update({_id: userId}, {$inc: {"meta.failedTotal": 1}}, function(err, user) {
					if (err) {
						next(err);
					}

					res.redirect('/' + req.user.username + '/chores/failed');
				});

			});
		}

	});

	// Check if goal for earning badge is true
	function checkAwards(callback) {
		db.User.findById(userId, function(err, user) {
			if (err) {
				next(err);
			}

			switch (true) {
				case (user.meta.completedTotal === 1):
					db.Badges.findByIdAndUpdate('5188e715f1f1ff48cce7b215', {date: new Date()}, function(err, badge){
						if (err) {
							next(err);
						}

						user.meta.awards.push(badge);
						user.save(function(err) {
							if (err) {
								next(err);
							}

							callback(badge);
						});
					});

					break;

				case (user.meta.completedTotal === 10):
					db.Badges.findByIdAndUpdate('5188dbb4f1f1ff48cce7b214', {date: new Date()}, function(err, badge){
						if (err) {
							next(err);
						}

						user.meta.awards.push(badge);
						user.save(function(err) {
							if (err) {
								next(err);
							}

							callback(badge);
						});
					});

					break;

				case (user.meta.completedTotal === 50):
					db.Badges.findByIdAndUpdate('5188e73bf1f1ff48cce7b217', {date: new Date()}, function(err, badge){
						if (err) {
							next(err);
						}

						user.meta.awards.push(badge);
						user.save(function(err) {
							if (err) {
								next(err);
							}

							callback(badge);
						});
					});

					break;

				case (user.meta.completedTotal === 500):
					db.Badges.findByIdAndUpdate('5188e745f1f1ff48cce7b218', {date: new Date()}, function(err, badge){
						if (err) {
							next(err);
						}

						user.meta.awards.push(badge);
						user.save(function(err) {
							if (err) {
								next(err);
							}

							callback(badge);
						});
					});

					break;
				default:
					callback();
			}
		});
	};

};