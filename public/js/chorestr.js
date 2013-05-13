var CHORESTR = CHORESTR || {};

CHORESTR.init = function() {

	var newChoreInput = document.querySelector('#title'),
		loginBtn = document.querySelector('.main-nav .login'),
		alertMessageClose = document.querySelector('.close-message'),
		validateInput = document.querySelectorAll('.validate'),
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

	if (typeof(alertMessageClose) !== 'undefined' && alertMessageClose !== null) {
		//var overlay = document.getElementById('badge-overlay');
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
		CHORESTR.moduleAlert(badgeModuleAlertBox);
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
		}



		else {
			error.textContent = '';
		}
	}
};

CHORESTR.moduleAlert = function(el) {
	var overlay = document.getElementById('badge-overlay');

	var pos = window.innerWidth / 2 - el.offsetWidth / 2;
	el.setAttribute('style', 'left:' + pos + 'px');

	overlay.setAttribute('style', 'height:' + $(document).height() + 'px');

	overlay.addEventListener('click', function() {
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
		overlay = document.getElementById('overlay'),
		closeButton = document.querySelector('.btn-cancel'),
		removeButton = document.querySelector('.btn-remove');

	$(moduleAlert).removeClass('hidden');
	$(overlay).removeClass('hidden');

	// Get the url from original form
	var form = document.querySelector('.module-alert-footer form');
	form.action = el[i].parentNode.action;

	var pos = window.innerWidth / 2 - moduleAlert.offsetWidth / 2;
	moduleAlert.setAttribute('style', 'left:' + pos + 'px');

	overlay.setAttribute('style', 'height:' + $(document).height() + 'px');

	closeButton.addEventListener('click', function(e) {
		e.preventDefault();
		$(moduleAlert).addClass('hidden');
		$(overlay).addClass('hidden');
	}, false);

	overlay.addEventListener('click', function(e) {
		e.preventDefault();
		$(moduleAlert).addClass('hidden');
		$(overlay).addClass('hidden');
	}, false);

	removeButton.addEventListener('click', function(e) {

	}, false);
};

CHORESTR.loginBox = function() {
	var input = document.getElementById('username');
	input.focus();
	//var pos = $(loginBtn).offset();
	//loginBox.setAttribute('style', 'left:' + (pos.left -  $(loginBox).width() / 2) + 'px');
	$('.login-box').toggleClass('hidden');

};

(function() {
	CHORESTR.init();
})();