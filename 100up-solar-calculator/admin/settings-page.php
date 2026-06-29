<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'admin_menu', 'solar_calc_admin_menu' );
add_action( 'admin_post_solar_calc_save', 'solar_calc_save_assumptions' );
add_action( 'admin_enqueue_scripts', 'solar_calc_admin_enqueue' );

function solar_calc_admin_menu() {
	add_menu_page(
		'Solar Pricing',
		'Solar Pricing',
		'manage_options',
		'solar-calc-assumptions',
		'solar_calc_settings_page',
		'dashicons-sun',
		30
	);
}

function solar_calc_admin_enqueue( $hook ) {
	if ( $hook !== 'toplevel_page_solar-calc-assumptions' ) return;
	wp_enqueue_style( 'solar-calc-admin', SOLAR_CALC_URL . 'assets/admin.css', [], SOLAR_CALC_VERSION );
}

function solar_calc_save_assumptions() {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorised' );
	check_admin_referer( 'solar_calc_save' );

	$defaults = solar_calc_defaults();
	$saved    = [];

	foreach ( $defaults as $key => $default ) {
		if ( isset( $_POST[ $key ] ) ) {
			$val = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
			if ( is_numeric( $val ) ) {
				$saved[ $key ] = ( strpos( $val, '.' ) !== false ) ? (float) $val : (int) $val;
			}
		}
	}

	update_option( SOLAR_CALC_OPTION_KEY, $saved );
	wp_redirect( admin_url( 'admin.php?page=solar-calc-assumptions&saved=1' ) );
	exit;
}

function solar_calc_settings_page() {
	$assumptions = solar_calc_get_assumptions();
	$defaults    = solar_calc_defaults();

	$groups = [
		'Solar Panels' => [
			[ 'panelW',           'Panel size',              'W' ],
			[ 'panelCost',        'Panel supply cost',       '$ / panel' ],
			[ 'panelInstallPerW', 'Panel installation',      '$ / W' ],
			[ 'panelFrame',       'Mounting frame (roof)',   '$ / panel' ],
		],
		'Solar Rebate' => [
			[ 'solarStcPerKw',  'Solar rebate STCs',  'STC / kW' ],
			[ 'solarStcPrice',  'Solar STC price',    '$' ],
		],
		'Sigenergy Battery' => [
			[ 'sigBatteryKwh',  'Battery size',  'kWh usable' ],
			[ 'sigBatteryCost', 'Battery cost',  '$ / unit' ],
		],
		'Deye Battery' => [
			[ 'deyeBatteryKwh',  'Battery size',  'kWh usable' ],
			[ 'deyeBatteryCost', 'Battery cost',  '$ / unit' ],
		],
		'Battery Rebate Tiers' => [
			[ 'batteryTier1',   'Tier 1 rebate',   'STC / kWh — first 14 kWh' ],
			[ 'batteryTier2',   'Tier 2 rebate',   'STC / kWh — 14–22 kWh' ],
			[ 'batteryTier3',   'Tier 3 rebate',   'STC / kWh — 22–50 kWh' ],
			[ 'batteryStcPrice','Battery STC price','$' ],
		],
		'Fixed Site Costs' => [
			[ 'smallParts',       'Small parts',              '$' ],
			[ 'installerSignOff', 'Installer sign off',       '$' ],
			[ 'ces',              'CES',                      '$' ],
			[ 'labourFixed',      'Fixed labour per site',    '$' ],
		],
		'Inverters — Standard 8kW Dual' => [
			[ 'sigInverterCost',  'Sigenergy 8kW inverter',       '$' ],
			[ 'deyeInverterCost', 'Deye 8kW inverter (with BMS)', '$' ],
			[ 'sigGatewayCost',   'Sigenergy gateway',             '$' ],
			[ 'minInverters',     'Minimum inverters',             'count' ],
		],
		'Inverters — Large / Single' => [
			[ 'sigSingleInverterCost',  'Sigenergy 12kW single',      '$' ],
			[ 'deyeSingleInverterCost', 'Deye 10kW single (with BMS)', '$' ],
			[ 'optSigInvKw',            'Sigenergy large inv. size',   'kW' ],
			[ 'optDeyeInvKw',           'Deye large inv. size',        'kW' ],
			[ 'optMinInverters',        'Large inv. min count',        'count' ],
		],
		'Inverter Config' => [
			[ 'solarOversizePercent', 'Solar allowed per inverter', '% — 200 = 2× inverter kW' ],
			[ 'maxBattPerInverter',   'Max batteries per inverter', 'count' ],
		],
		'Pricing & Tax' => [
			[ 'margin', 'Margin',  'decimal — 0.30 = 30%' ],
			[ 'gst',    'GST',     'decimal — 0.10 = 10%' ],
		],
		'Ground Mount Extras' => [
			[ 'gmFramePerPanel',   'Frame cost',       '$ / panel' ],
			[ 'gmLabourPerPanel',  'Labour cost',      '$ / panel' ],
			[ 'gmMachineryFixed',  'Machinery (fixed)','$' ],
		],
		'3-Phase Inverters' => [
			[ 'deye3phInverterCost', 'Deye 12kW 3-phase',         '$' ],
			[ 'sig3ph15kwCost',      'Sigenergy 15kW 3-phase',     '$' ],
			[ 'sig3ph20kwCost',      'Sigenergy 20kW 3-phase',     '$' ],
			[ 'sig3ph30kwCost',      'Sigenergy 30kW 3-phase',     '$' ],
			[ 'sig3phGatewayCost',   'Sigenergy 3-phase gateway',  '$' ],
		],
	];

	?>
	<div class="wrap solar-admin-wrap">
		<h1>☀ Solar Pricing Assumptions</h1>
		<p class="solar-admin-sub">These values are used by all solar calculators on the site. Changes take effect immediately for all visitors.</p>

		<?php if ( isset( $_GET['saved'] ) ) : ?>
			<div class="notice notice-success is-dismissible"><p><strong>Assumptions saved.</strong> All calculators are now using the updated pricing.</p></div>
		<?php endif; ?>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<?php wp_nonce_field( 'solar_calc_save' ); ?>
			<input type="hidden" name="action" value="solar_calc_save">

			<?php foreach ( $groups as $group_label => $fields ) : ?>
			<div class="solar-admin-group">
				<h2 class="solar-admin-group-title"><?php echo esc_html( $group_label ); ?></h2>
				<table class="solar-admin-table widefat">
					<thead>
						<tr>
							<th>Setting</th>
							<th>Value</th>
							<th>Unit / Note</th>
							<th>Default</th>
						</tr>
					</thead>
					<tbody>
					<?php foreach ( $fields as [ $key, $label, $unit ] ) :
						$current = $assumptions[ $key ] ?? $defaults[ $key ];
						$default = $defaults[ $key ];
						$changed = $current != $default;
					?>
						<tr class="<?php echo $changed ? 'solar-row-changed' : ''; ?>">
							<td class="solar-row-label"><?php echo esc_html( $label ); ?><?php if ( $changed ) echo ' <span class="solar-badge-changed">edited</span>'; ?></td>
							<td><input type="number" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $current ); ?>" step="0.01" class="solar-admin-input"></td>
							<td class="solar-row-unit"><?php echo esc_html( $unit ); ?></td>
							<td class="solar-row-default"><?php echo esc_html( $default ); ?></td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
			</div>
			<?php endforeach; ?>

			<div class="solar-admin-actions">
				<input type="submit" class="button button-primary button-large" value="💾 Save Assumptions">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=solar-calc-assumptions&reset=1' ) ); ?>" class="button button-secondary" onclick="return confirm('Reset all values to plugin defaults?')">↺ Reset to defaults</a>
			</div>
		</form>
	</div>
	<?php

	// Handle reset via GET (simple, no separate form needed)
	if ( isset( $_GET['reset'] ) && current_user_can( 'manage_options' ) ) {
		delete_option( SOLAR_CALC_OPTION_KEY );
		wp_redirect( admin_url( 'admin.php?page=solar-calc-assumptions&saved=1' ) );
		exit;
	}
}
