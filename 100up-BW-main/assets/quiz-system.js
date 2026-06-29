(function () {
	'use strict';

	var KWH_PER_PERSON      = 5;
	var KW_SOLAR_PER_PERSON = 2.5;
	var KWH_BATTERY_PER_PERSON = 5;
	var INVERTER_KW         = 12;
	var BASE_HOUSE_KWH      = 5;

	var URLS = {
		starter:    'https://100up.com.au/off-grid-solar/1-bedroom-kit-install/',
		bed2:       'https://100up.com.au/off-grid-solar/2-bedroom-kit-install/',
		bed3:       'https://100up.com.au/off-grid-solar/3-bedroom-kit-install/',
		bed4:       'https://100up.com.au/off-grid-solar/4-bedroom-kit-install/',
		bed5:       'https://100up.com.au/off-grid-solar/5-bedroom-kit-install/',
		commercial: 'https://100up.com.au/off-grid-solar/custom-commercial-off-grid-systems/'
	};

	function $(id) {
		return document.getElementById(id);
	}

	function fireGtag(eventName, params) {
		if (typeof window.gtag !== 'function') { return; }
		if (window.brighterGA4 && window.brighterGA4.skipTracking === true) { return; }
		window.gtag('event', eventName, Object.assign({ quiz_type: '100up_off_grid_system' }, params || {}));
	}

	function getPeople() {
		var el = $('up100-people');
		return el ? parseInt(el.value, 10) || 1 : 1;
	}

	function getBallarat() {
		var r = document.querySelector('input[name="up100-ballarat"]:checked');
		return r && r.value === 'yes';
	}

	function getSite() {
		var r = document.querySelector('input[name="up100-site"]:checked');
		return r && r.value === 'workshop' ? 'workshop' : 'home';
	}

	function recommendation(people, site) {
		if (site === 'workshop') {
			return {
				url:        URLS.commercial,
				label:      'Custom commercial off-grid system',
				quoteLabel: 'Commercial Workshop (three-phase)',
				imgKey:     'workshop',
				modelTag:   'COMMERCIAL'
			};
		}
		if (people <= 1) {
			return {
				url:        URLS.starter,
				label:      'Starter off-grid solar system',
				quoteLabel: 'Starter Home (single-phase)',
				imgKey:     '1',
				modelTag:   '1-BED'
			};
		}
		if (people === 2) {
			return {
				url:        URLS.bed2,
				label:      '2-bedroom off-grid solar system',
				quoteLabel: '2 Bedroom Home (single-phase)',
				imgKey:     '2',
				modelTag:   '2-BED'
			};
		}
		if (people === 3) {
			return {
				url:        URLS.bed3,
				label:      '3-bedroom off-grid solar system',
				quoteLabel: '3 Bedroom Home (single-phase)',
				imgKey:     '3',
				modelTag:   '3-BED'
			};
		}
		if (people === 4) {
			return {
				url:        URLS.bed4,
				label:      '4-bedroom off-grid solar system',
				quoteLabel: '4 Bedroom Home (single-phase)',
				imgKey:     '4',
				modelTag:   '4-BED'
			};
		}
		return {
			url:        URLS.bed5,
			label:      '5-bedroom off-grid solar system',
			quoteLabel: (people >= 6 ? '5+ Bedroom Home' : '5 Bedroom Home') + ' (single-phase)',
			imgKey:     '5',
			modelTag:   '5-BED'
		};
	}

	function formatKw(n) {
		var s = n % 1 === 0 ? n.toFixed(0) : n.toFixed(1);
		return s + ' kW';
	}

	function formatKwh(n) {
		var s = n % 1 === 0 ? n.toFixed(0) : n.toFixed(1);
		return s + ' kWh';
	}

	function buildQuoteUrl(base, quotePhrase, meta) {
		var u;
		try {
			u = new URL(base, window.location.href);
		} catch (e) {
			return base;
		}
		var msg =
			'Please tell me more about off grid solar for my **' + quotePhrase + '**' +
			(meta && meta.ballarat ? ' (Ballarat & regional Victoria).' : '.');
		u.searchParams.set('100up_msg', msg);
		u.searchParams.set('message', msg);
		u.searchParams.set('source', '100up_quiz');
		if (meta) {
			if (meta.people)   u.searchParams.set('people', String(meta.people));
			if (meta.site)     u.searchParams.set('site', meta.site);
			if (meta.ballarat) u.searchParams.set('ballarat', 'yes');
		}
		return u.toString();
	}

	var started = false;

	function markStarted() {
		if (started) return;
		started = true;
		fireGtag('quiz_started', {
			event_category: 'Quiz',
			event_label: '100UP off-grid quiz started'
		});
	}

	function markComplete(payload) {
		fireGtag('quiz_complete', {
			event_category: 'Quiz',
			event_label: payload.recommendation_label || '100UP quiz complete',
			quiz_people: payload.people,
			quiz_site:   payload.site
		});
	}

	function run() {
		var root = document.getElementById('up100-off-grid-quiz');
		if (!root) return;

		var btn    = $('up100-calc-btn');
		var result = $('up100-result');
		if (!btn || !result) return;

		var quoteBase = root.getAttribute('data-quote-url') || 'https://100up.com.au/quote/';

		root.querySelectorAll('[data-track-start]').forEach(function (el) {
			el.addEventListener('change', markStarted);
			el.addEventListener('input',  markStarted);
		});

		btn.addEventListener('click', function () {
			markStarted();

			var people   = getPeople();
			var ballarat = getBallarat();
			var site     = getSite();
			var rec      = recommendation(people, site);

			var solarKw     = people * KW_SOLAR_PER_PERSON;
			var batteryKwh  = people * KWH_BATTERY_PER_PERSON;
			var phaseLabel  = site === 'workshop' ? 'Three Phase' : 'Single Phase';
			var dailyKwh    = BASE_HOUSE_KWH + people * KWH_PER_PERSON;

			// Specs
			$('up100-phase-out').textContent   = phaseLabel;
			$('up100-energy-out').textContent  = '~' + dailyKwh + ' kWh per day';
			$('up100-solar-out').textContent   = formatKw(solarKw) + ' Generation Capacity';
			$('up100-battery-out').textContent = formatKwh(batteryKwh) + ' Storage';
			$('up100-inverter-out').textContent = INVERTER_KW + ' kW System';

			// Model tag
			var modelTag = $('up100-model-tag');
			if (modelTag) { modelTag.textContent = rec.modelTag; }

			// Recommendation text
			var recText = $('up100-rec-text');
			if (recText) {
				recText.textContent =
					(site === 'workshop'
						? 'For workshop and commercial loads, we recommend reviewing our three-phase commercial systems.'
						: 'Based on a home with ' +
						  people +
						  (people === 1 ? ' occupant' : ' occupants') +
						  ', the closest match in our range is the ' +
						  rec.label + '.') +
					(ballarat
						? ' You\'re in the Ballarat region — we serve Ballarat and regional Victoria.'
						: '');
			}

			// Featured image
			var imgKey     = rec.imgKey;
			var imgUrl     = root.getAttribute('data-img-' + imgKey) || '';
			var imgWrap    = $('up100-result-img-wrap');
			var featuredImg = $('up100-featured-img');
			if (imgWrap && featuredImg) {
				if (imgUrl) {
					featuredImg.src    = imgUrl;
					featuredImg.alt    = rec.label;
					imgWrap.removeAttribute('hidden');
				} else {
					imgWrap.setAttribute('hidden', '');
				}
			}

			// Links
			var recLink = $('up100-rec-link');
			if (recLink) { recLink.href = rec.url; }

			var quoteCta = $('up100-quote-cta');
			if (quoteCta) {
				quoteCta.href = buildQuoteUrl(quoteBase, rec.quoteLabel, {
					people:   people,
					site:     site,
					ballarat: ballarat
				});
			}

			// Show results and switch to 2-col layout on desktop
			result.removeAttribute('hidden');
			var layout = root.querySelector('.up100-quiz-layout');
			if (layout) { layout.classList.add('up100-has-results'); }

			markComplete({
				recommendation_label: rec.label,
				people: people,
				site:   site
			});

			if (window.innerWidth < 760) {
				setTimeout(function () {
					result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				}, 80);
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else {
		run();
	}
})();
