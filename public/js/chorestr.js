var CHORESTR = CHORESTR || {};

CHORESTR.init = function() {

	var newChoreInput = document.querySelector('#title'),
		loginBtn = document.querySelector('.main-nav .login'),
		alertMessageClose = document.querySelector('.close-message'),
		validateInput = document.querySelectorAll('.validate'),
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
		alertMessageClose.addEventListener('click', function (e) {

			CHORESTR.closeMessage('.info-message');

			e.preventDefault();
		}, false);
	}

	if (typeof(loginBtn) !== 'undefined' && loginBtn !== null) {

		loginBtn.addEventListener('click', function(e) {

			CHORESTR.loginBox();
			e.preventDefault();
		}, false);
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

CHORESTR.newChore = function(e) {
	var newChore = document.querySelector('.new-chore-overlay'),
		overlay = document.querySelector('.bg-overlay');

	// $.ajax({
	// 	url: window.location.pathname + '/new',
	// 	type: 'GET'
	// }).done(function(data) {
	// 	console.log(data);
	// 	$('body').append(data);
	// });
	$(newChore).removeClass('hidden');

	var pos = window.innerWidth / 2 - newChore.offsetWidth / 2;
	newChore.setAttribute('style', 'left:' + pos + 'px');


	$(overlay).removeClass('hidden');
	overlay.setAttribute('style', 'height:' + $(document).height() + 'px');

	$(overlay).on('click', function() {
		$(newChore).addClass('hidden');
		$(overlay).addClass('hidden');
	});
	e.preventDefault();
};

CHORESTR.closeMessage = function(el) {
	var node = document.querySelector(el);

	node.parentNode.removeChild(node);
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