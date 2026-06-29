/**
 * 100UP quote page helper: reads ?100up_msg= or ?message= and prefills the first
 * likely message/body textarea. Enable with:
 * add_filter( 'up100_ct_load_quote_prefill', '__return_true' );
 * on the quote page (theme snippet or small MU-plugin).
 */
(function () {
	'use strict';

	function getParam(name) {
		var p = new URLSearchParams(window.location.search);
		return p.get(name) || '';
	}

	function decodeMsg(raw) {
		if (!raw) return '';
		try {
			return decodeURIComponent(raw.replace(/\+/g, ' '));
		} catch (e) {
			return raw;
		}
	}

	function pickTextarea() {
		var selectors = [
			'textarea[id="100up_msg"]',
			'textarea[name="fields[100up_msg]"]',
			'textarea[name*="100up_msg" i]',
			'textarea[name*="message" i]',
			'textarea[name*="your-message" i]',
			'textarea[name="message"]',
			'textarea#message',
			'textarea.wpcf7-your-message',
			'textarea[name^="fields["][name*="message"]',
			'form textarea'
		];
		for (var i = 0; i < selectors.length; i++) {
			var el = document.querySelector(selectors[i]);
			if (el && el.offsetParent !== null) return el;
		}
		return document.querySelector('form textarea');
	}

	function run() {
		var msg = decodeMsg(getParam('100up_msg')) || decodeMsg(getParam('message'));
		if (!msg) return;
		var ta = pickTextarea();
		if (!ta) return;
		if (!ta.value.trim()) {
			ta.value = msg;
		} else {
			ta.value = ta.value.trim() + '\n\n' + msg;
		}
		ta.dispatchEvent(new Event('change', { bubbles: true }));
		ta.dispatchEvent(new Event('input', { bubbles: true }));
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			setTimeout(run, 200);
		});
	} else {
		setTimeout(run, 200);
	}
})();
