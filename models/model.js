var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';

switch (env) {
	case 'development':
		mongoose.connect("mongodb://localhost/Chorestr");
		break;
	case 'production':
		mongoose.connect("mongodb://nodejitsu:1a9c9754ff4d4213f8c01d2f30bd974b@linus.mongohq.com:10047/nodejitsudb2125588036")
		break;
};

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
	return this.due.toLocaleDateString() + ' ' + this.due.getHours	() + ':' + this.due.getMinutes();
});

ChoresSchema.virtual('complete.date').get(function() {
	return this.completedDate.toLocaleDateString() + ' ' + this.completedDate.getHours	() + ':' + this.completedDate.getMinutes();
});

var ChoresModel = mongoose.model('Chores', ChoresSchema);

var BadgeSchema = new mongoose.Schema({
	name: String,
	src: String,
	date: {type: Date, default: new Date()}
});

BadgeSchema.virtual('badge.date').get(function() {
	return this.date.toLocaleDateString();
});

var BadgeModel = mongoose.model('Badges', BadgeSchema);

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
		multiplier: {type: Number, default: 0}
	}
});


var UserModel = mongoose.model("Users", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;
module.exports.Badges = BadgeModel;
