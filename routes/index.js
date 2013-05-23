
/*
 * GET home page.
 */

exports.index = function(req, res){
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}
	res.render('index', {
		title: 'A good way to make chores fun - Chorestr.com',
	  	user: username
	});
};