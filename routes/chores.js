var db = require('../models/model');

exports.all = function(req, res, next) {

	db.Chores.find({user: req.user._id, status: 'active'}).sort({_id: -1}).exec(function(err, chores) {
		if (err) {
			var report = new Error('Unable to find chores');
			report.inner = err;
			next(report);
			return;
		}

		db.User.findById(req.user._id, function(err, userDetails) {
			res.render('chores', {
				title: 'All chores',
				user: userDetails.username,
				chores: chores,
				meta: userDetails.meta
			});
		});

	});

};

exports.new = function(req, res, next) {

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

	var data = riskCalc(body.prio);

	new db.Chores({
		name: body.title,
		reward: data.reward,
		due: data.dueDate,
		prio: body.prio,
		user: req.user._id
	}).save(function(err) {
		if (err) {
				var report = new Error('Unable to save chore');
				report.inner = err;

				next(report);
				return;
			}

			res.redirect('/' + req.user.username + '/chores');
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
			chore: chore
		});

	});

};

exports.update = function(req, res, next) {
	var body = req.body,
		id = req.params.id;

	var data = riskCalc(body.prio);

	db.Chores.findByIdAndUpdate(id, {
		name: body.title,
		reward: data.reward,
		due: data.dueDate,
		prio: body.prio
	}, function(err) {
		if (err) {
				var report = new Error('Unable to update chore');
				report.inner = err;
				next(report);
				return;
			}

		res.redirect('/' + req.user.username + '/chores');
	});

};

exports.remove = function(req, res, next) {
	var id = req.params.id;

	db.Chores.findByIdAndRemove(id, function(err) {
		if (err) {
				var report = new Error('Unable to delete chore');
				report.inner = err;
				next(report);
				return;
			}
			res.redirect('/' + req.user.username + '/chores/completed');
	});

};

function riskCalc(prio) {
	var reward, dueDate, today;
	var riskCalc = {};

	today = new Date();
	dueDate = new Date();

	switch (prio) {
		case 'Low':
			riskCalc.reward = 150;
			riskCalc.dueDate = dueDate.setDate(today.getDate() + 5);
			break;
		case 'Medium':
			riskCalc.reward = 250;
			riskCalc.dueDate = dueDate.setDate(today.getDate() + 3);
			break;
		case 'High':
			riskCalc.reward = 500;
			riskCalc.dueDate = dueDate.setDate(today.getDate() + 1);
			break;
	}

	return riskCalc;
};