<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'wp_enqueue_scripts', 'solar_calc_enqueue' );

function solar_calc_enqueue() {
	global $post;
	if ( ! is_a( $post, 'WP_Post' ) ) return;

	$has_qe   = has_shortcode( $post->post_content, 'solar_quick_estimate' );
	$has_calc = has_shortcode( $post->post_content, 'solar_calculator' );

	if ( ! $has_qe && ! $has_calc ) return;

	wp_enqueue_style(
		'solar-calc',
		SOLAR_CALC_URL . 'assets/solar-calc.css',
		[],
		SOLAR_CALC_VERSION
	);

	wp_enqueue_script(
		'solar-calc',
		SOLAR_CALC_URL . 'assets/solar-calc.js',
		[],
		SOLAR_CALC_VERSION,
		true
	);

	// Pass server-side pricing into JS — no hardcoded defaults in the browser
	wp_localize_script( 'solar-calc', 'SolarCalcConfig', [
		'assumptions'  => solar_calc_get_assumptions(),
		'adminUrl'     => current_user_can( 'manage_options' )
			? admin_url( 'admin.php?page=solar-calc-assumptions' )
			: '',
	] );
}
