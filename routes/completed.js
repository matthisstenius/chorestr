var db = require('../models/model');

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

		db.User.findById(req.user._id, function(err, user) {
			res.render('completed', {
				title: 'All chores',
				user: user.username,
				chores: chores,
				meta: user.meta,
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
			switch (chore.prio) {
				case "1" :
					db.User.update({_id: userId},
						{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward, "meta.completedPrio.One": 1}}, function(err, user) {
						if (err) {
							next(err);
						}

						checkAwards(function(badge) {
							// sätt session
							res.redirect('/' + req.user.username + '/chores');
						});
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

			var awardExists = function(id) {
				// Om samma badge redan finns avbryt
				for (var i = 0; i < user.meta.awards.length; i += 1) {
					if (user.meta.awards[i]._id.toString() === id) {

						return false;
					}

				}

				return true;
			};


			switch (true) {
				// Check amount of completed chores
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

				case (user.meta.completedTotal === 100):
					db.Badges.findByIdAndUpdate('518be147f1f1ff48cce7b21c', {date: new Date()}, function(err, badge){
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

				// Check score
				case (user.meta.points >= 1000 && user.meta.points <= 1500 && awardExists('518cc23ff1f1ff48cce7b21f')):
					db.Badges.findByIdAndUpdate('518cc23ff1f1ff48cce7b21f', {date: new Date()}, function(err, badge){
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

				case (user.meta.points >= 7000 && user.meta.points <= 7500 && awardExists('518cc253f1f1ff48cce7b220')):
					db.Badges.findByIdAndUpdate('518cc253f1f1ff48cce7b220', {date: new Date()}, function(err, badge){
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

				// Check completed chores by prio
				case (user.meta.completedPrio.One === 15 && awardExists('518ba595f1f1ff48cce7b21b')):
					db.Badges.findByIdAndUpdate('518ba595f1f1ff48cce7b21b', {date: new Date()}, function(err, badge){
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

				case (user.meta.completedPrio.Two === 15 && awardExists('518bf23ff1f1ff48cce7b21d')):
					db.Badges.findByIdAndUpdate('518bf23ff1f1ff48cce7b21d', {date: new Date()}, function(err, badge){
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

				case (user.meta.completedPrio.Three === 15 && awardExists('518ba58cf1f1ff48cce7b21a')):
					db.Badges.findByIdAndUpdate('518ba58cf1f1ff48cce7b21a', {date: new Date()}, function(err, badge){
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

				case (user.meta.completedPrio.For === 15 && awardExists('518bf24af1f1ff48cce7b21e')):
					db.Badges.findByIdAndUpdate('518bf24af1f1ff48cce7b21e', {date: new Date()}, function(err, badge){
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


				case (user.meta.completedPrio.Five === 15 && awardExists('518ba57ef1f1ff48cce7b219')):
					db.Badges.findByIdAndUpdate('518ba57ef1f1ff48cce7b219', {date: new Date()}, function(err, badge){
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