var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/Chorestr");

var ChoresSchema = new mongoose.Schema({
	name: String,
	reward: Number,
	due: Date
});

var ChoresModel = mongoose.model('Chores', ChoresSchema);

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

var UserModel = mongoose.model("User", UserSchema);

module.exports.Chores = ChoresModel;
module.exports.User = UserModel;
