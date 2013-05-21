var mongoose = require('mongoose'),
	connectionEnv = require('../dbConfig');
var env = process.env.VCAP_SERVICE || 'development';

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

ChoresSchema.virtual('date.format').get(function() {
	return this.due.toDateString() + ' ' + this.due.getHours() + ':' + this.due.getMinutes();
});

ChoresSchema.virtual('complete.date').get(function() {
	return this.completedDate.toDateString() + ' ' + this.completedDate.getHours	() + ':' + this.completedDate.getMinutes();
});

var ChoresModel = mongoose.model('Chores', ChoresSchema);

var BadgeSchema = new mongoose.Schema({
	name: String,
	src: String,
	date: Date
});

BadgeSchema.virtual('badge.date').get(function() {
	return this.date.toDateString();
});

var BadgeModel = mongoose.model('Badges', BadgeSchema);

var ActivitySchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: new Date()}
});

ActivitySchema.virtual('activity.date').get(function() {
	return this.date.toDateString() + ' ' + this.date.getHours() + ':' + this.date.getMinutes();
});

var ActivtyModel = mongoose.model('Activities', ActivitySchema);

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
		awards: [BadgeSchema],
		activity: [ActivitySchema],
		rank: {type: String, default: 'Novice'},
		multiplier: {type: Number, default: 1}
	}
});


var UserModel = mongoose.model("Users", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;
module.exports.Badges = BadgeModel;
module.exports.Activity = ActivtyModel;
