var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: 'Mailjet',
	auth: {
		user: 'b43b0ea84d8cfa6118195b382fd1d62d',
		pass: 'e11cff82764a0fe87d94fc3f1ae448b1'
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