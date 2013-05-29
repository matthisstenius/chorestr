var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: 'Hotmail',
	auth: {
		user: 'support@chorestr.com',
		pass: 'Ed?{FD3XW]7C2EoG'
	}
});

exports.send = function(errStack) {

	var mailOptions = {
		from: 'support@chorestr.com',
		to: 'support@chorestr.com',
		subject: 'Error',
		html: "<html><p>" + errStack + "</p></html>"
	};

	smtpTransport.sendMail(mailOptions, function(err, response) {
		if (err) {
			next(err);
			return;
		}

	});
};