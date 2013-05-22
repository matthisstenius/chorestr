var db = require('../models/model');

exports.showFailed = function(req, res, next) {
	var userID = req.user._id;

	// Take querystring and put it into an object
	var sort = {}, sortFailedDate, sortPrio;
	var queryString = req.query.sort;

	if (queryString) {
		sort[queryString] = -1;
		res.cookie('sortFailed', queryString, {maxAge:  30 * 86400 * 1000});
	}

	if (req.cookies.sortFailed && !queryString) {
		sort[req.cookies.sortFailed] = -1;
	}

	else {
		sort['failedDate'] = -1;
		sortFailedDate = true;
	}

	if (sort.failedDate) {
		sortFailedDate = true;
		sortPrio = false;
	}

	if (sort.prio) {
		sortPrio = true;
		sortFailedDate = false;
	}

	db.Chores.find({status: 'failed', user: userID}).sort(sort).exec(function(err, chores) {
		if (err) {
			next(err);
		}

		db.User.findById(req.user._id, function(err, userDetails) {
			res.render('failed', {
				title: 'Failed chores',
				user: userDetails.username,
				chores: chores,
				meta: userDetails.meta,
				sortFailedDate: sortFailedDate,
				sortPrio: sortPrio
			});
		});
	});
};