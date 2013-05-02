var db = require('../models/model');

exports.showCompleted = function(req, res, next) {
	db.Chores.find({user: req.user._id, status: 'completed'}).sort({completedDate: -1}).exec(function(err, chores) {
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

		db.User.update({_id: userId},
			{$inc: {"meta.completedTotal": 1, "meta.points": chore.reward}}, function(err, user) {
			if (err) {
				next(err);
			}

			res.redirect('/' + req.user.username + '/chores');
		})
	});


};