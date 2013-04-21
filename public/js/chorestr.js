var CHORESTR = CHORESTR || {};

CHORESTR.init = function() {


	// $('.new-chore').on('click', function(e) {
	// 	CHORESTR.newChore(e);
	// });
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

(function() {
	CHORESTR.init();
})();