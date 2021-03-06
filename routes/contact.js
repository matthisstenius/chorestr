var nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport("SMTP", {
	service: 'Hotmail',
	auth: {
		user: 'hello@chorestr.com',
		pass: '!)94,2`4962122E'
	}
});

exports.showContact = function(req, res, next) {
	var username, email;

	if (req.session.user) {
		username = req.session.user.username;
		email = req.session.user.email;
	}

	res.render('contact', {
		title: 'Contact - chorestr.com',
		user: username,
		email: email,
		messages: req.session.messages,
		errors: req.session.errors
	}, function(err, html) {
		req.session.messages = null;
		req.session.errors = null;
		res.send(html);
	});

};

exports.send = function(req, res, next) {
	var body = req.body;

	req.assert('subject', 'Enter a subject').notEmpty();
	req.assert('email', 'Invalid email').isEmail();
	req.assert('message', 'Enter a message').notEmpty();

	var error = req.validationErrors(true);

	if (error) {
		req.session.errors = error;
		res.redirect('/contact');
		return;
	}

	var mailOptions = {
		from: body.email,
		to: 'hello@chorestr.com',
		subject: body.subject,
		html: "<html><p>" + body.message + "</p><p>"+ body.email + "</p></html>"
	};

	smtpTransport.sendMail(mailOptions, function(err, response) {
		if (err) {
			next(err);
			return;
		}

		req.session.messages =  "Your message has been deliverd. We'll get back to you ASAP!";
		res.redirect('/contact');

	});
};