(function () {
	'use strict';

	var REFRESH_MS = 15 * 60 * 1000;

	var CONDITIONS = [
		{
			min: 0, max: 50,
			icon: '🌙',
			label: 'No solar production',
			modifier: 'up100-ticker--none',
			msg: 'Solar panels are resting right now — but Ballarat averages over 5 peak sun hours a day.'
		},
		{
			min: 50, max: 200,
			icon: '☁️',
			label: 'Low solar conditions',
			modifier: 'up100-ticker--low',
			msg: 'Overcast in Ballarat right now. Even on cloudy days, a good system keeps generating.'
		},
		{
			min: 200, max: 450,
			icon: '⛅',
			label: 'Moderate solar',
			modifier: 'up100-ticker--moderate',
			msg: 'Partly cloudy over Ballarat. A {kw}kW system is generating around {kwh} kWh right now.'
		},
		{
			min: 450, max: 700,
			icon: '🌤',
			label: 'Good solar day',
			modifier: 'up100-ticker--good',
			msg: 'Good solar conditions in Ballarat. A {kw}kW system is generating around {kwh} kWh right now.'
		},
		{
			min: 700, max: 900,
			icon: '☀️',
			label: 'Great solar day',
			modifier: 'up100-ticker--great',
			msg: 'Great solar conditions right now. A {kw}kW system is producing roughly {kwh} kWh — this is what you\'re missing.'
		},
		{
			min: 900, max: 9999,
			icon: '🌞',
			label: 'Excellent conditions',
			modifier: 'up100-ticker--excellent',
			msg: 'Peak solar conditions over Ballarat. A {kw}kW system is generating around {kwh} kWh right now.'
		}
	];

	var ALL_MODIFIERS = CONDITIONS.map( function ( c ) { return c.modifier; } );

	function calcKwh( rad, systemKw ) {
		return ( systemKw * ( rad / 1000 ) * 0.77 ).toFixed( 1 );
	}

	function getCondition( rad ) {
		for ( var i = 0; i < CONDITIONS.length; i++ ) {
			if ( rad >= CONDITIONS[ i ].min && rad < CONDITIONS[ i ].max ) {
				return CONDITIONS[ i ];
			}
		}
		return CONDITIONS[ CONDITIONS.length - 1 ];
	}

	function relativeTime( dateStr ) {
		var then = new Date( dateStr );
		var diffMs = Date.now() - then.getTime();
		var diffMin = Math.round( diffMs / 60000 );
		if ( diffMin < 2 )  { return 'just now'; }
		if ( diffMin < 60 ) { return diffMin + ' min ago'; }
		var hrs = Math.round( diffMin / 60 );
		return hrs + 'h ago';
	}

	function render( root, data ) {
		var rad       = data.solar_radiation || 0;
		var systemKw  = parseFloat( root.getAttribute( 'data-system-kw' ) ) || 6.6;
		var quoteUrl  = root.getAttribute( 'data-quote-url' ) || 'https://100up.com.au/quote/';
		var cond      = getCondition( rad );
		var kwh       = calcKwh( rad, systemKw );

		var msg = cond.msg
			.replace( /\{kw\}/g,  systemKw )
			.replace( /\{kwh\}/g, kwh );

		var bar = root.querySelector( '.up100-ticker-bar' );
		if ( bar ) {
			ALL_MODIFIERS.forEach( function ( m ) { bar.classList.remove( m ); } );
			bar.classList.add( cond.modifier );
		}

		var iconEl = root.querySelector( '.up100-ticker-icon' );
		if ( iconEl ) { iconEl.textContent = cond.icon; }

		var labelEl = root.querySelector( '.up100-ticker-label' );
		if ( labelEl ) { labelEl.textContent = cond.label; }

		var msgEl = root.querySelector( '.up100-ticker-msg' );
		if ( msgEl ) { msgEl.textContent = msg; }

		var ctaEl = root.querySelector( '.up100-ticker-cta' );
		if ( ctaEl ) { ctaEl.href = quoteUrl; }

		var metaEl = root.querySelector( '.up100-ticker-meta' );
		if ( metaEl ) {
			metaEl.textContent = 'Ballarat solar radiation · Lake Wendouree · ' + relativeTime( data.date_time );
		}

		root.removeAttribute( 'hidden' );
	}

	function fetchAndRender( root ) {
		var proxyUrl = root.getAttribute( 'data-proxy-url' );
		if ( ! proxyUrl ) { return; }

		fetch( proxyUrl )
			.then( function ( r ) {
				if ( ! r.ok ) { throw new Error( 'proxy error' ); }
				return r.json();
			} )
			.then( function ( data ) {
				if ( data && data.solar_radiation !== undefined ) {
					render( root, data );
				}
			} )
			.catch( function () {
				// Fail silently — ticker stays hidden rather than showing an error
			} );
	}

	function init() {
		document.querySelectorAll( '.up100-solar-ticker-root' ).forEach( function ( root ) {
			fetchAndRender( root );
			setInterval( function () {
				fetchAndRender( root );
			}, REFRESH_MS );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

} )();
