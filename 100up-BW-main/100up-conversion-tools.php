<?php
/**
 * Plugin Name: 100UP Conversion Tools
 * Plugin URI: https://brighterwebsites.com/
 * Description: 100UP Off-grid Tools to help Customers - System finder quiz, Simple energy calculator.  Includes GA4 Tracking and Quote prefill support.
 * Author: Brighter Websites
 * Author URI: https://brighterwebsites.com/
 * License: Proprietary - Client Use Only
 * License URI: https://brighterwebsites.com.au/policies/service-agreement/
 * Version: 1.0.0
 * Text Domain: 100up-conversion-tools
 *
 * Shortcodes:
 * - [100-up-quiz-system] — full off-grid finder + sizing + daily usage block.
 * - [100-up-daily-energy] — standalone expected daily usage (5 kWh house + 5 kWh/person).
 * - [100up-solar-ticker] — live solar radiation ticker for Ballarat region.
 * Optional [100-up-quiz-system]: quote_url, about_text
 * Optional [100-up-daily-energy]: default_people="1"–"6"
 * Optional [100up-solar-ticker]: quote_url, system_kw
 *
 * Quote page: append ?100up_msg=... (URL-encoded). Optional helper script: enqueue
 * 100up_ct_quote_prefill_handle if you add the script to the quote page, or add
 * assets/quote-prefill.js via your theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UP100_CT_VERSION', '1.0.0' );
define( 'UP100_CT_PLUGIN_FILE', __FILE__ );
define( 'UP100_CT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'UP100_CT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register assets (front-end). Lightweight; safe to load site-wide.
 */
function up100_ct_register_assets() {
	wp_register_style(
		'up100-ct-quiz',
		UP100_CT_PLUGIN_URL . 'assets/quiz-system.css',
		array(),
		UP100_CT_VERSION
	);
	wp_register_script(
		'up100-ct-quiz',
		UP100_CT_PLUGIN_URL . 'assets/quiz-system.js',
		array(),
		UP100_CT_VERSION,
		true
	);
	wp_register_script(
		'up100-ct-daily-energy',
		UP100_CT_PLUGIN_URL . 'assets/daily-energy.js',
		array(),
		UP100_CT_VERSION,
		true
	);
	wp_register_style(
		'up100-ct-solar-ticker',
		UP100_CT_PLUGIN_URL . 'assets/solar-ticker.css',
		array(),
		UP100_CT_VERSION
	);
	wp_register_script(
		'up100-ct-solar-ticker',
		UP100_CT_PLUGIN_URL . 'assets/solar-ticker.js',
		array(),
		UP100_CT_VERSION,
		true
	);
}
add_action( 'init', 'up100_ct_register_assets' );

/**
 * Enqueue when shortcode is present in main post (classic). For builders, shortcode may still render;
 * we also enqueue inside shortcode callback to cover that case.
 */
function up100_ct_enqueue_quiz_assets() {
	wp_enqueue_style( 'up100-ct-quiz' );
	wp_enqueue_script( 'up100-ct-quiz' );
}

/**
 * Enqueue styles + standalone daily energy script only.
 */
function up100_ct_enqueue_daily_energy_assets() {
	wp_enqueue_style( 'up100-ct-quiz' );
	wp_enqueue_script( 'up100-ct-daily-energy' );
}

/**
 * Server-side proxy for Ballarat solar radiation API.
 * Caches for 15 minutes via transient.
 * Returns the latest single record as JSON.
 */
function up100_ct_solar_proxy() {
	$transient_key = 'up100_solar_radiation';
	$cached        = get_transient( $transient_key );
 
	if ( false !== $cached ) {
		header( 'Content-Type: application/json' );
		header( 'X-UP100-Cache: HIT' );
		echo $cached; // already JSON string
		wp_die();
	}
 
	$api_url = 'https://data.ballarat.vic.gov.au/api/explore/v2.1/catalog/datasets/solar-radiation-observations/records?limit=1&order_by=date_time%20desc&where=location_description%3D%22Rowing%20Course%22';
 
	$response = wp_remote_get( $api_url, array( 'timeout' => 8 ) );
 
	if ( is_wp_error( $response ) ) {
		wp_send_json_error( array( 'message' => 'upstream_failed' ), 502 );
		wp_die();
	}
 
	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );
 
	if ( empty( $data['results'][0] ) ) {
		wp_send_json_error( array( 'message' => 'no_results' ), 502 );
		wp_die();
	}
 
	$record = $data['results'][0];
 
	// Flatten to just what the JS needs
	$payload = array(
		'solar_radiation' => floatval( $record['solar_radiation'] ),
		'date_time'       => sanitize_text_field( $record['date_time'] ),
		'location'        => sanitize_text_field( $record['location_description'] ),
	);
 
	$json = wp_json_encode( $payload );
 
	set_transient( $transient_key, $json, 15 * MINUTE_IN_SECONDS );
 
	header( 'Content-Type: application/json' );
	header( 'X-UP100-Cache: MISS' );
	echo $json;
	wp_die();
}
add_action( 'wp_ajax_nopriv_up100_solar_proxy', 'up100_ct_solar_proxy' );
add_action( 'wp_ajax_up100_solar_proxy',        'up100_ct_solar_proxy' );

/**
 * Shortcode: [100-up-quiz-system]
 *
 * @param array $atts Shortcode attributes.
 * @return string
 */
function up100_ct_render_quiz_shortcode( $atts ) {
	up100_ct_enqueue_quiz_assets();

	$atts = shortcode_atts(
		array(
			'quote_url'  => 'https://100up.com.au/quote/',
			'about_text' => '',
		),
		$atts,
		'100-up-quiz-system'
	);

	$quote_url = esc_url( $atts['quote_url'] );
	$about     = wp_kses_post( $atts['about_text'] );

	// Fetch featured images for each recommended system post.
	$img_1        = get_the_post_thumbnail_url( 1616, 'large' ) ?: '';
	$img_2        = get_the_post_thumbnail_url( 1622, 'large' ) ?: '';
	$img_3        = get_the_post_thumbnail_url( 1624, 'large' ) ?: '';
	$img_4        = get_the_post_thumbnail_url( 1626, 'large' ) ?: '';
	$img_5        = get_the_post_thumbnail_url( 1628, 'large' ) ?: '';
	$img_workshop = get_the_post_thumbnail_url( 1631, 'large' ) ?: '';

	ob_start();
	?>
	<div
		class="up100-quiz"
		id="up100-off-grid-quiz"
		data-quote-url="<?php echo esc_attr( $quote_url ); ?>"
		data-about-default="<?php echo esc_attr( wp_strip_all_tags( $about ) ); ?>"
		data-img-1="<?php echo esc_attr( $img_1 ); ?>"
		data-img-2="<?php echo esc_attr( $img_2 ); ?>"
		data-img-3="<?php echo esc_attr( $img_3 ); ?>"
		data-img-4="<?php echo esc_attr( $img_4 ); ?>"
		data-img-5="<?php echo esc_attr( $img_5 ); ?>"
		data-img-workshop="<?php echo esc_attr( $img_workshop ); ?>"
	>
		<div class="up100-quiz-layout">

			<!-- ── FORM PANEL ─────────────────────────────────── -->
			<div class="up100-quiz-panel up100-quiz-panel--form">

				<h3 class="up100-quiz-title"><?php esc_html_e( 'Find your off-grid system size', '100up-conversion-tools' ); ?></h3>
				<p class="up100-quiz-intro"><?php esc_html_e( 'Answer a few questions for indicative solar, battery, and inverter sizing plus a matched system recommendation.', '100up-conversion-tools' ); ?></p>

				<div class="up100-quiz-fields">

					<div class="up100-field">
						<label for="up100-people"><?php esc_html_e( '1. How many people?', '100up-conversion-tools' ); ?></label>
						<select id="up100-people" class="up100-quiz-input" data-track-start>
							<?php for ( $i = 1; $i <= 6; $i++ ) : ?>
								<option value="<?php echo esc_attr( (string) $i ); ?>"><?php echo esc_html( sprintf( _n( '%d Occupant', '%d Occupants', $i, '100up-conversion-tools' ), $i ) ); ?></option>
							<?php endfor; ?>
						</select>
					</div>

					<div class="up100-field">
						<span class="up100-label"><?php esc_html_e( '2. Ballarat Region?', '100up-conversion-tools' ); ?></span>
						<div class="up100-inline-radios">
							<label class="up100-pill"><input type="radio" name="up100-ballarat" value="yes" data-track-start /> <?php esc_html_e( 'Yes', '100up-conversion-tools' ); ?></label>
							<label class="up100-pill"><input type="radio" name="up100-ballarat" value="no" checked data-track-start /> <?php esc_html_e( 'No', '100up-conversion-tools' ); ?></label>
						</div>
					</div>

					<div class="up100-field">
						<span class="up100-label"><?php esc_html_e( '3. Property Type?', '100up-conversion-tools' ); ?></span>
						<div class="up100-inline-radios up100-inline-radios--cards">
							<label class="up100-pill-card">
								<input type="radio" name="up100-site" value="home" checked data-track-start />
								<span class="up100-pill-card-icon" aria-hidden="true">&#x1F3E0;</span>
								<span><?php esc_html_e( 'Home', '100up-conversion-tools' ); ?></span>
							</label>
							<label class="up100-pill-card">
								<input type="radio" name="up100-site" value="workshop" data-track-start />
								<span class="up100-pill-card-icon" aria-hidden="true">&#x1F3ED;</span>
								<span><?php esc_html_e( 'Workshop', '100up-conversion-tools' ); ?></span>
							</label>
						</div>
						<p class="up100-help"><?php esc_html_e( 'Home uses single-phase; workshop uses three-phase.', '100up-conversion-tools' ); ?></p>
					</div>

				</div><!-- /.up100-quiz-fields -->

				<button type="button" class="up100-calc-btn" id="up100-calc-btn">
					<?php esc_html_e( 'Calculate &amp; Recommend', '100up-conversion-tools' ); ?>
				</button>

			</div><!-- /.up100-quiz-panel--form -->

			<!-- ── RESULTS PANEL ──────────────────────────────── -->
			<div class="up100-quiz-panel up100-quiz-panel--results" id="up100-result" hidden>

				<!-- Recommendation headline card -->
				<div class="up100-result-rec-card">
					<p class="up100-rec-main-text" id="up100-rec-text"></p>
					<?php if ( $about ) : ?>
						<p class="up100-rec-sub-text" id="up100-rec-subtext"><?php echo $about; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post applied above. ?></p>
					<?php else : ?>
						<p class="up100-rec-sub-text" id="up100-rec-subtext" hidden></p>
					<?php endif; ?>
				</div>

				<!-- Featured image from recommended system post -->
				<div class="up100-result-img-wrap" id="up100-result-img-wrap" hidden>
					<img class="up100-featured-img" id="up100-featured-img" src="" alt="">
				</div>

				<!-- Indicative specs card -->
				<div class="up100-specs-card">
					<div class="up100-specs-header">
						<span class="up100-specs-title"><?php esc_html_e( 'Indicative System', '100up-conversion-tools' ); ?></span>
						<span class="up100-model-tag" id="up100-model-tag"></span>
					</div>
					<ul class="up100-spec-list">
						<li>
							<span class="up100-spec-label"><?php esc_html_e( 'Phase', '100up-conversion-tools' ); ?></span>
							<strong id="up100-phase-out"></strong>
						</li>
						<li>
							<span class="up100-spec-label"><?php esc_html_e( 'Energy Use', '100up-conversion-tools' ); ?></span>
							<div>
								<strong id="up100-energy-out"></strong>
								<span class="up100-spec-badge">&#x2139; <?php esc_html_e( 'Expected daily usage (fully occupied)', '100up-conversion-tools' ); ?></span>
							</div>
						</li>
						<li>
							<span class="up100-spec-label"><?php esc_html_e( 'Solar Panels', '100up-conversion-tools' ); ?></span>
							<strong id="up100-solar-out"></strong>
						</li>
						<li>
							<span class="up100-spec-label"><?php esc_html_e( 'Battery Storage', '100up-conversion-tools' ); ?></span>
							<strong id="up100-battery-out"></strong>
						</li>
						<li>
							<span class="up100-spec-label"><?php esc_html_e( 'Inverter', '100up-conversion-tools' ); ?></span>
							<strong id="up100-inverter-out"></strong>
						</li>
					</ul>
					<p class="up100-footnote"><?php esc_html_e( 'Figures are indicative guides for discussion — final design depends on appliances, shading, and site audit.', '100up-conversion-tools' ); ?></p>
				</div><!-- /.up100-specs-card -->

				<!-- Next step CTAs -->
				<div class="up100-rec-block">
					<p class="up100-rec-actions-label"><?php esc_html_e( 'Recommended next step:', '100up-conversion-tools' ); ?></p>
					<div class="up100-rec-actions">
						<a href="#" class="up100-quote-cta" id="up100-quote-cta" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Request a Quote', '100up-conversion-tools' ); ?></a>
						<a href="#" class="up100-rec-link" id="up100-rec-link" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View System Details', '100up-conversion-tools' ); ?></a>
					</div>
				</div><!-- /.up100-rec-block -->

			</div><!-- /.up100-quiz-panel--results -->

		</div><!-- /.up100-quiz-layout -->
	</div><!-- /#up100-off-grid-quiz -->
	<?php
	return ob_get_clean();
}
add_shortcode( '100-up-quiz-system', 'up100_ct_render_quiz_shortcode' );

/**
 * Shortcode: [100-up-daily-energy]
 * Standalone “expected daily usage” widget (same formula as the quiz block).
 *
 * @param array $atts Shortcode attributes.
 * @return string
 */
function up100_ct_render_daily_energy_shortcode( $atts ) {
	up100_ct_enqueue_daily_energy_assets();

	$atts = shortcode_atts(
		array(
			'default_people' => '4',
		),
		$atts,
		'100-up-daily-energy'
	);

	$default = (int) $atts['default_people'];
	if ( $default < 1 ) {
		$default = 1;
	}
	if ( $default > 6 ) {
		$default = 6;
	}

	$field_id    = 'up100-de-' . wp_rand( 10000, 99999999 );
	$initial_kwh = 5 + $default * 5;

	ob_start();
	?>
	<div class="up100-quiz up100-daily-energy-root">
		<div class="up100-de-inner">

			<div class="up100-de-people-row">
				<label class="up100-de-people-label" for="<?php echo esc_attr( $field_id ); ?>"><?php esc_html_e( 'How many people?', '100up-conversion-tools' ); ?></label>
				<select id="<?php echo esc_attr( $field_id ); ?>" class="up100-quiz-input up100-daily-energy-people">
					<?php for ( $i = 1; $i <= 6; $i++ ) : ?>
						<option value="<?php echo esc_attr( (string) $i ); ?>" <?php selected( $default, $i ); ?>>
							<?php echo esc_html( sprintf( _n( '%d Occupant', '%d Occupants', $i, '100up-conversion-tools' ), $i ) ); ?>
						</option>
					<?php endfor; ?>
				</select>
			</div>

			<div class="up100-de-result">
				<p class="up100-de-result-heading"><?php esc_html_e( 'Expected daily usage', '100up-conversion-tools' ); ?></p>
				<p class="up100-de-kwh up100-daily-energy-lead"><?php echo esc_html( sprintf( '~%d kWh per day', $initial_kwh ) ); ?></p>
				<p class="up100-de-sub"><?php esc_html_e( '(fully occupied)', '100up-conversion-tools' ); ?></p>
			</div>

			<p class="up100-de-footnote"><?php esc_html_e( 'Indicative only; Calculated as 5 kWh per day for the fully occupied household, plus 5 kWh per person. Actual use depends on appliances, heating/cooling, and habits.', '100up-conversion-tools' ); ?></p>

		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( '100-up-daily-energy', 'up100_ct_render_daily_energy_shortcode' );

/**
 * Shortcode: [100up-solar-ticker]
 *
 * @param array $atts Shortcode attributes.
 * @return string
 */
function up100_ct_render_solar_ticker( $atts ) {
	$atts = shortcode_atts(
		array(
			'quote_url' => 'https://100up.com.au/quote/',
			'system_kw' => '6.6',
		),
		$atts,
		'100up-solar-ticker'
	);
 
	// Use ACF field up_sys_inverter_capacity if present on the current post; fall back to shortcode attribute.
	$acf_kw    = function_exists( 'get_field' ) ? get_field( 'up_sys_inverter_capacity' ) : null;
	$system_kw = floatval( $acf_kw ?: $atts['system_kw'] );
	$quote_url = esc_url( $atts['quote_url'] );
	$proxy_url = esc_url( admin_url( 'admin-ajax.php' ) . '?action=up100_solar_proxy' );
 
	// Enqueue assets
	wp_enqueue_style( 'up100-ct-solar-ticker' );
	wp_enqueue_script( 'up100-ct-solar-ticker' );
 
	ob_start();
	?>
	<div
		class="up100-solar-ticker-root"
		data-proxy-url="<?php echo esc_attr( $proxy_url ); ?>"
		data-quote-url="<?php echo esc_attr( $quote_url ); ?>"
		data-system-kw="<?php echo esc_attr( (string) $system_kw ); ?>"
		hidden
	>
		<div class="up100-ticker-bar">
			<div class="up100-ticker-badge">
				<span class="up100-ticker-icon" aria-hidden="true"></span>
				<span class="up100-ticker-label"></span>
			</div>
			<span class="up100-ticker-msg"></span>
			<a href="<?php echo esc_attr( $quote_url ); ?>" class="up100-ticker-cta">
				<?php esc_html_e( 'Get a free estimate', '100up-conversion-tools' ); ?>
			</a>
		</div>
		<p class="up100-ticker-meta"></p>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( '100up-solar-ticker', 'up100_ct_render_solar_ticker' );





/**
 * Optional: register quote prefill script for use on the quote page only.
 */
function up100_ct_register_quote_prefill() {
	wp_register_script(
		'up100-ct-quote-prefill',
		UP100_CT_PLUGIN_URL . 'assets/quote-prefill.js',
		array(),
		UP100_CT_VERSION,
		true
	);
}
add_action( 'init', 'up100_ct_register_quote_prefill' );

/**
 * Enqueue quote prefill on a page if body class or filter says so.
 * Use: add_filter( 'up100_ct_load_quote_prefill', '__return_true' ); on quote template,
 * or from Breakdance/code snippet when on quote page.
 */
function up100_ct_maybe_quote_prefill() {
	if ( ! apply_filters( 'up100_ct_load_quote_prefill', false ) ) {
		return;
	}
	wp_enqueue_script( 'up100-ct-quote-prefill' );
}
add_action( 'wp_enqueue_scripts', 'up100_ct_maybe_quote_prefill', 30 );
