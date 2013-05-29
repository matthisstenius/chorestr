var mongoose = require('mongoose'),
	connectionEnv = require('../dbConfig');

mongoose.connect(connectionEnv.dbConnection);

var ChoresSchema = new mongoose.Schema({
	name: String,
	reward: {type: Number, default: 1000},
	due: Date,
	prio: {type: String, index: true},
	status: {type: String, default: 'active'},
	completedDate: {type: Date, default: '2013-01-01'},
	user: {type: mongoose.Schema.ObjectId, index: true}
});


var ChoresModel = mongoose.model('Chores', ChoresSchema);

var UserSchema = new mongoose.Schema({
	username: {type: String, trim: true, index: true},
	email: String,
	password: String,
	resetToken: {type: String, default: ''},
	resetDue: {type: Date, default: '2013-01-01'},
	meta: {
		completedTotal: {type: Number, default: 0},
		failedTotal: {type: Number, default: 0},

		completedPrio: {
			One: {type: Number, default: 0},
			Two: {type: Number, default: 0},
			Three: {type: Number, default: 0},
			For: {type: Number, default: 0},
			Five: {type: Number, default: 0}
		},

		points: {type: Number, default: 0},
		awards: [],
		activity: [],
		rank: {type: String, default: 'Novice'},
		multiplier: {type: Number, default: 1}
	}
});


var UserModel = mongoose.model("Users", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;