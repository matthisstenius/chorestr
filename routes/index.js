
/*
 * GET home page.
 */

exports.index = function(req, res){
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}
	res.render('index', {
		title: 'Welcome to Chorestr',
	  	user: username
	});
};