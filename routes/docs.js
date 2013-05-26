exports.privacy = function(req, res, next) {
	var username;

	if (req.session.user) {
		username = req.session.user.username;
	}

	res.render('privacy', {
		title: 'Privacy Policy',
		user: username
	});
};