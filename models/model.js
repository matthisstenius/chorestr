var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/Chorestr");

var ChoresSchema = new mongoose.Schema({
	name: String,
	reward: {type: Number, default: 1000},
	due: Date,
	prio: String,
	completed: {type: Boolean, default: false},
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

var UserSchema = new mongoose.Schema({
	username: {type: String, trim: true, index: true},
	email: String,
	password: String,
	resetToken: {type: String, default: ''},
	resetDue: {type: Date, default: '2013-01-01'},
	meta: {
		completedTotal: {type: Number, default: 0},
		completedType: {
			low: {type: Number, default: 0},
			medium: {type: Number, default: 0},
			high: {type: Number, default: 0}
		},

		points: {type: Number, default: 0},
		awards: [],
		multiplier: {type: Number, default: 0}
	}
});

var UserModel = mongoose.model("Users", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;
