var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/Chorestr");

var ChoresSchema = new mongoose.Schema({
	name: String,
	reward: {type: Number, default: 1000},
	due: Date,
	prio: String
});

ChoresSchema.virtual('date.format').get(function() {
	return this.due.toLocaleDateString() + ' ' + this.due.getHours	() + ':' + this.due.getMinutes();
});

var ChoresModel = mongoose.model('Chores', ChoresSchema);

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	points: Number,
	awards: [],
	multiplier: {type: Number, default: 0}
});

var UserModel = mongoose.model("Users", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;
