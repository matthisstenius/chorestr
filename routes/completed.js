var db = require('../models/model');

exports.showCompleted = function(req, res, next) {
	db.Chores.find({user: req.user._id, completed: true}).sort({completedDate: -1}).exec(function(err, chores) {
		if (err) {
			next(new Error('Could not find completed chores'));
		}

		res.render('completed', {
			title: 'Completed Chores',
			user: req.user.username,
			chores: chores
		});
	});
};

exports.completed = function(req, res, next) {
	var userId = req.user._id;

	db.Chores.findByIdAndUpdate(req.params.id, {
		completed: true,
		completedDate: new Date()
	}, function(err, chore) {
		if (err) {
			next(new Error('Could not complete chore'));
		}
	});

	db.User.findByIdAndUpdate(userId, {
		"meta.completedTotal": req.user.meta.completedTotal + 1
	}, function(err, user) {
		if (err) {
			next(new Error('Could not complete chore'));
		}

		res.redirect('/' + req.user.username + '/chores');
	});
};