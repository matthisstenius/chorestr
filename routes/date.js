var time = require('time');

module.exports = function(date, tz) {
	var timezone;

	var timezone = new time.Date();
	timezone.setTimezone(tz);

	var localDate = new Date(date.getTime() - timezone.getTimezoneOffset() * 60 * 1000)
	return localDate.toDateString() + ' ' + localDate.getHours() + ':' + localDate.getMinutes();
};