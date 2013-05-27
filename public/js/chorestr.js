var CHORESTR = CHORESTR || {};

CHORESTR.enabled = true;

CHORESTR.init = function() {

	var newChoreInput = document.querySelector('#title'),
		loginBtn = document.querySelector('.main-nav .login'),
		alertMessageClose = document.querySelector('.close-message'),
		validateInput = document.querySelectorAll('.validate'),
		userMenu = document.querySelector('.username'),
		showActivityLog = document.querySelector('.show-activity-log '),
		newChoreBtn = document.querySelector('.new-chore'),
		badgeModuleAlertBox = document.querySelector('.badge-module-alert'),
		removeChore = document.querySelectorAll('.remove'),
		loginBox = document.querySelector('.login-box');

	if (typeof(newChoreInput) !== 'undefined' && newChoreInput !== null) {
		newChoreInput.focus();
	}

	if (typeof(validateInput) !== 'undefined' && validateInput !== null) {
		for (var i = 0; i < validateInput.length; i += 1) {
			validateInput[i].addEventListener('blur', function() {
				CHORESTR.validate(this.getAttribute('id'), this.value);
			}, false);
		}
	}


	if (typeof(userMenu) !== 'undefined' && userMenu !== null) {
		var userSubMenu = document.querySelector('.user-subnav');

		userMenu.addEventListener('click', function(e) {
			e.preventDefault();
			$(userSubMenu).toggleClass('hidden');
		}, false);

		document.addEventListener('click', function() {
			$(userSubMenu).addClass('hidden');
		}, true);
	}

	if (typeof(showActivityLog) !== 'undefined' && showActivityLog !== null) {
		showActivityLog.addEventListener('click', function(e) {
			e.preventDefault();
			if (CHORESTR.enabled) {
				CHORESTR.showActivityLog(this.getAttribute('data-user'));
			}

		}, false);
	}

	if (typeof(alertMessageClose) !== 'undefined' && alertMessageClose !== null) {
		var infoMessage = document.querySelector('.info-message');
		alertMessageClose.addEventListener('click', function (e) {
			e.preventDefault();
			CHORESTR.closeMessage([infoMessage]);
		}, false);
	}

	if (typeof(loginBtn) !== 'undefined' && loginBtn !== null) {
		loginBtn.addEventListener('click', function(e) {
			CHORESTR.loginBox();
			e.preventDefault();
		}, false);
	}

	if (typeof(newChoreBtn) !== 'undefined' && newChoreBtn !== null) {
		newChoreBtn.addEventListener('click', function(e) {
			e.preventDefault();
			CHORESTR.newChore();
		}, false);
	}

	if (typeof(removeChore) !== 'undefined' && removeChore !== null) {
		for (var i = 0; i < removeChore.length; i += 1) {
			(function(removeChore, i) {
				removeChore[i].addEventListener('click', function(e) {
					e.preventDefault();
					CHORESTR.removeChore(removeChore, i);
				}, false);
			})(removeChore, i);

		}
	}

	if (typeof(badgeModuleAlertBox) !== 'undefined' && badgeModuleAlertBox !== null) {
		CHORESTR.badgeAlert(badgeModuleAlertBox);
	}
};

CHORESTR.validate = function(type, value) {
	if (type === 'username') {
		var error = document.querySelector('.username-error');

		if (value === '') {
			error.textContent = 'Enter a username';
			return;
		}

		if (!value.match(/[A-Za-z0-9]/)) {
			error.textContent = 'Invalid username. Ony alphanumerical characters allowed';
			return;
		}

		else {
			error.textContent = '';
		}
	}

	if (type === 'email') {
		var error = document.querySelector('.email-error');
		if (!value.match(/^(?!\.)(\w|-|\.){1,64}(?!\.)@(?!\.)[-.a-zåäö0-9]{4,253}$/)) {
			error.textContent = 'Invalid email';
			return;
		}

		else {
			error.textContent = '';
		}
	}

	if (type === 'password') {
		var error = document.querySelector('.password-error');

		if (value === '') {
			error.textContent = 'Enter a password';
			return;
		}

		if (value.length < 6) {
			error.textContent = 'Pasword must contain at least 6 characters';
			return;
		}

		else {
			error.textContent = '';
		}
	}

	if (type === "subject") {
		var error = document.querySelector('.subject-error');
		if (value === "") {
			error.textContent = "Enter a subject";
			return;
		}
	}

	if (type === "message") {
		var error = document.querySelector('.message-error');
		if (value === "") {
			error.textContent = "Enter a message";
		}
	}
};

CHORESTR.badgeAlert = function(el) {
	var overlay = document.getElementById('badge-overlay'),
		closeButton = document.querySelector('.close-badge-alert');

	var pos = CHORESTR.centerEl(el);
	el.setAttribute('style', 'left:' + pos + 'px');

	overlay.setAttribute('style', 'height:' + $(document).height() + 'px');

	overlay.addEventListener('click', function() {
		CHORESTR.closeMessage([el, overlay]);
	}, false);

	closeButton.addEventListener('click', function() {
		CHORESTR.closeMessage([el, overlay]);
	}, false);

};

CHORESTR.closeMessage = function(el) {
	for (var i = 0; i < el.length; i += 1) {
		el[i].parentNode.removeChild(el[i]);
	}
};

CHORESTR.removeChore = function(el, i) {
	var moduleAlert = document.querySelector('.module-alert'),
		closeButton = document.querySelector('.close');

	CHORESTR.alertBox(moduleAlert, closeButton);

	var form = document.querySelector('.module-alert-footer form');
	form.action = el[i].parentNode.action;
};

CHORESTR.newChore = function() {
	var newChore = document.querySelector('.new-chore-box'),
		newChoreInput = document.querySelector('#title'),
		closeButton = document.querySelector('.close-new-chore');

	CHORESTR.alertBox(newChore, closeButton);

	newChoreInput.focus();
};

CHORESTR.alertBox = function(el, closeButton) {
	var overlay = document.getElementById('overlay');

	var pos = CHORESTR.centerEl(el);
	el.setAttribute('style', 'left:' + pos + 'px');

	overlay.setAttribute('style', 'height:' + $(document).height() + 'px');

	$(el).removeClass('hidden');
	$(overlay).removeClass('hidden');

	overlay.addEventListener('click', function() {
		$(overlay).addClass('hidden');
		$(el).addClass('hidden');
	}, false);

	closeButton.addEventListener('click', function() {
		$(overlay).addClass('hidden');
		$(el).addClass('hidden');
	}, false);
};

CHORESTR.loginBox = function() {
	var input = document.getElementById('username'),
		loginBox = document.querySelector('.login-box'),
		closeButton = document.querySelector('.close');

	CHORESTR.alertBox(loginBox, closeButton);
};

CHORESTR.centerEl = function(el) {
	return window.innerWidth / 2 - $(el).width() / 2;
};

CHORESTR.showActivityLog = function(user) {
	var activityWrapper = document.querySelector('.activty-log-wrapper'),
		showActivityLog = document.querySelector('.show-activity-log'),
		loading = document.querySelector('.notifications'),
		overlay = document.getElementById('overlay');

	// Disable menubutton click while open.
	CHORESTR.enabled = false;
	$(loading).addClass('loading');

	$.ajax({
		url: '/account/' + user + '/activity'
	}).done(function(data) {
		var $activityLog,
			$header,
			$main,
			ul = document.createElement('ul');

		if (data.length > 0) {
			$activityLog = $('<div class="activity-log module-alert"/>'),
			$header = $('<div class="module-alert-header module clearfix"><h3>Notifications</h3><a class="close close-activity" href="#"><span class="icon-close"></span></a></div>'),
			$main = $('<div class="module-alert-main">');

			for (var i = 0; i < data.length; i += 1) {
				var li = document.createElement('li'),
					span = document.createElement('span');

				span.setAttribute('class', 'activity-date');
				li.textContent = data[i].title;
				var dateFormat = new Date(data[i].date);
				span.textContent = dateFormat.toDateString() + ' ' + dateFormat.getHours() + ':' + dateFormat.getMinutes();

				li.appendChild(span);
				ul.appendChild(li);
			}
			$main.append(ul);
		}

		else {
			$activityLog = $('<div class="activity-log module-alert"/>'),
			$header = $('<div class="module-alert-header module clearfix"><h3>Notifications</h3><a class="close close-activity" href="#"><span class="icon-close"></span></a></div>'),
			$main = $('<div class="module-alert-main"><p class="no-notifications">No new notifications</p></div>');
		}

		$(activityWrapper).append($activityLog);
		$activityLog.append($header, $main);

		var pos = CHORESTR.centerEl($activityLog);
		$activityLog.attr('style', 'left:' + pos + 'px');

		$(overlay).removeClass('hidden');

		$(loading).removeClass('loading');

		overlay.addEventListener('click', function() {
			showActivityLog.textContent = 0;
			$(showActivityLog).removeClass('new-notification');
			$(activityWrapper).empty($activityLog);
			$(overlay).addClass('hidden');
			CHORESTR.enabled = true;
		}, false);

		var closeButton = document.querySelector('.close-activity');

		closeButton.addEventListener('click', function(e) {
			e.preventDefault();
			showActivityLog.textContent = 0;
			$(showActivityLog).removeClass('new-notification');
			$(activityWrapper).empty($activityLog);
			$(overlay).addClass('hidden');
			CHORESTR.enabled = true;
		}, false);

	});

};

(function() {
	CHORESTR.init();
})();