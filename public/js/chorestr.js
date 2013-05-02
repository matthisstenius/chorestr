var CHORESTR = CHORESTR || {};

CHORESTR.init = function() {

	var newChoreInput = document.querySelector('#title'),
		loginBtn = document.querySelector('.main-nav .login'),
		loginBox = document.querySelector('.login-box');

	if (typeof(newChoreInput) !== 'undefined' && newChoreInput !== null) {
		newChoreInput.focus();
	}

	if (typeof(loginBtn) !== 'undefined' && loginBtn !== null) {

		loginBtn.addEventListener('click', function(e) {
			CHORESTR.loginBox(e);
		}, false);
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

CHORESTR.loginBox = function(e) {
	e.preventDefault();
	var input = document.getElementById('username');
	input.focus();
	//var pos = $(loginBtn).offset();
	//loginBox.setAttribute('style', 'left:' + (pos.left -  $(loginBox).width() / 2) + 'px');
	$('.login-box').toggleClass('hidden');

};

(function() {
	CHORESTR.init();
})();