<?php
/**
 * Plugin Name: 100UP Solar Calculator
 * Description: Solar system pricing calculators for Sigenergy & Deye. Includes Quick Estimate (customer-facing) and internal tools (Calculator, 3 Phase, Optimiser).
 * Version: 1.0.0
 * Author: Brighter Websites
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'SOLAR_CALC_VERSION', '1.0.0' );
define( 'SOLAR_CALC_DIR', plugin_dir_path( __FILE__ ) );
define( 'SOLAR_CALC_URL', plugin_dir_url( __FILE__ ) );
define( 'SOLAR_CALC_OPTION_KEY', '100up_solar_assumptions' );

require_once SOLAR_CALC_DIR . 'includes/defaults.php';
require_once SOLAR_CALC_DIR . 'includes/enqueue.php';
require_once SOLAR_CALC_DIR . 'includes/shortcodes.php';
require_once SOLAR_CALC_DIR . 'admin/settings-page.php';
