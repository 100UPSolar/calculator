(function () {
	'use strict';

	var BASE = 5;
	var PER_PERSON = 5;
	var MAX = 6;

	function update(root) {
		var sel = root.querySelector('.up100-daily-energy-people');
		var out = root.querySelector('.up100-daily-energy-lead');
		if (!sel || !out) return;
		var n = parseInt(sel.value, 10) || 1;
		if (n > MAX) n = MAX;
		if (n < 1) n = 1;
		var kwh = BASE + n * PER_PERSON;
		out.textContent = '~' + kwh + ' kWh per day';
	}

	function bind(root) {
		if (root.getAttribute('data-up100-daily-bound') === '1') return;
		root.setAttribute('data-up100-daily-bound', '1');
		var sel = root.querySelector('.up100-daily-energy-people');
		if (sel) {
			sel.addEventListener('change', function () {
				update(root);
			});
		}
		update(root);
	}

	function init() {
		document.querySelectorAll('.up100-daily-energy-root').forEach(bind);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
