var db = require('../models/model');

exports.all = function(req, res) {
	db.Chores.find({}).sort({_id: -1}).exec(function(err, docs) {
		if (err) {
			console.log(err);
			return;
		}

		res.render('chores', {
			title: 'All chores',
			user: req.params.user,
			chores: docs
		});
	});
};

exports.new = function(req, res) {
	res.render('new', {
		title: 'New chore',
		user: req.params.user
	});
};

exports.add = function(req, res) {
	var body = req.body,
		reward, dueDate, today;

	today = new Date();
	dueDate = new Date();

	switch (body.prio) {
		case 'Low':
			reward = 500;
			dueDate = dueDate.setDate(today.getDate() + 5);
			break;
		case 'Medium':
			reward = 1500;
			dueDate = dueDate.setDate(today.getDate() + 3);
			break;
		case 'High':
			reward = 3000;
			dueDate = dueDate.setDate(today.getDate() + 1);
			break;
	}

	new db.Chores({
		name: body.title,
		reward: reward,
		due: dueDate,
		prio: body.prio
	}).save(function(err) {
		if (err) {
			console.log(err);
			return;
		}

		res.redirect('/' + req.params.user + '/chores');
	})
};

exports.edit = function(req, res) {

};

exports.remove = function(req, res) {
	db.Chores.remove({_id: req.params.id}, function(err) {
		if (err) {
			console.log(err);
			return;
		}

		res.redirect('/' + req.params.user + '/chores');
	});
};