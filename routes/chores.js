var db = require('../models/model'),
	date = require('../routes/date');

exports.all = function(req, res, next) {
	// Take querystring and put it into an object
	var sort = {}, sortId, sortPrio;
	var queryString = req.query.sort;

	if (queryString) {
		sort[queryString] = -1;
		res.cookie('sortCurrent', queryString, {maxAge:  30 * 86400 * 1000});
	}

	if (req.cookies.sortCurrent && !queryString) {
		sort[req.cookies.sortCurrent] = -1;
	}

	else {
		sort['_id'] = -1;
	}

	if (sort._id) {
		sortId = true;
		sortPrio = false;
	}

	if (sort.prio) {
		sortPrio = true;
		sortId = false;
	}

	db.Chores.find({user: req.user._id, status: 'active'}).sort(sort).exec(function(err, chores) {
		if (err) {
			next(err);
			return;
		}

		db.User.findById(req.user._id, function(err, userDetails) {
			if (err) {
				next(err);
			}

			// Format date and add timezone
			for (var i = 0; i < chores.length; i += 1) {
				chores[i].localDate = date(chores[i].due, req.session.tz);
			}

			res.render('chores', {
				title: 'Current chores',
				user: userDetails.username,
				chores: chores,
				meta: userDetails.meta,
				sortId: sortId,
				sortPrio: sortPrio,
				alertBadge: req.session.alertBadge
			});

			req.session.alertBadge = null;
		});

	});

};

exports.new = function(req, res) {

	res.render('new', {
		title: 'New chore',
		user: req.user.username,
		messages: req.session.messages
	});

	req.session.messages = null;
};

exports.add = function(req, res, next) {
	var body = req.body;

	req.assert('title', 'Enter a title').notEmpty();


	var errors = req.validationErrors(true);

	if (errors) {
		req.session.messages = errors;
		res.redirect(req.path);
		return;
	}

	riskCalc(body.prio, function(data) {
		new db.Chores({
			name: body.title,
			reward: data.reward,
			due: data.dueDate,
			prio: body.prio,
			user: req.user._id
		}).save(function(err) {
			if (err) {
				next(err);
				return;
			}

			res.redirect('/' + req.user.username + '/chores');
		});
	});
};

exports.edit = function(req, res, next) {
	var id = req.params.id;

	db.Chores.findById(id, function(err, chore) {
		if (err) {
			var report = new Error('Unable to find chore');
			report.inner = err;
			next(report);
			return;
		}

		res.render('edit', {
			title: chore.name,
			user: req.user.username,
			chore: chore,
			messages: req.session.messages
		});

		req.session.messages = null;
	});

};

exports.update = function(req, res, next) {
	var body = req.body,
		id = req.params.id;

	req.assert('title', 'Enter a title').notEmpty();


	var errors = req.validationErrors(true);

	if (errors) {
		req.session.messages = errors;
		res.redirect('back');
		return;
	}

	riskCalc(body.prio, function(data) {
		db.Chores.findByIdAndUpdate(id, {
			name: body.title,
			reward: data.reward,
			due: data.dueDate,
			prio: body.prio
		}, function(err) {
			if (err) {
				next(err);
				return;
			}

			res.redirect('/' + req.user.username + '/chores');
		});
	});
};

exports.remove = function(req, res, next) {
	var id = req.params.id;

	db.Chores.findByIdAndRemove(id, function(err) {
		if (err) {
				next(err);
				return;
			}
			res.redirect('back');
	});

};

function riskCalc(prio, callback) {
	var dueDate, today;
	var riskCalcData = {};

	today = new Date();
	dueDate = new Date();

	switch (prio) {
		case '1':
			riskCalcData.reward = 50;
			dueDate.setDate(today.getDate() + 10);
			break;
		case '2':
			riskCalcData.reward = 75;
			dueDate.setDate(today.getDate() + 7);
			break;
		case '3':
			riskCalcData.reward = 100;
			dueDate.setDate(today.getDate() + 5);
			break;
		case '4':
			riskCalcData.reward = 150;
			dueDate.setDate(today.getDate() + 2);
			break;
		case '5':
			riskCalcData.reward = 250;
			dueDate.setDate(today.getDate() + 1);
			break;
	}


	riskCalcData.dueDate = dueDate;
	callback(riskCalcData);
}