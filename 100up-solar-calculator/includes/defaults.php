<?php
if ( ! defined( 'ABSPATH' ) ) exit;

function solar_calc_defaults() {
	return [
		// Solar panels
		'panelW'                => 490,
		'panelCost'             => 140,
		'panelInstallPerW'      => 0.35,
		'panelFrame'            => 50,
		// Solar rebate
		'solarStcPerKw'         => 6,
		'solarStcPrice'         => 38,
		// Sigenergy battery
		'sigBatteryKwh'         => 7.8,
		'sigBatteryCost'        => 3650,
		// Deye battery
		'deyeBatteryKwh'        => 5.1,
		'deyeBatteryCost'       => 1600,
		// Battery rebate tiers
		'batteryTier1'          => 6.8,
		'batteryTier2'          => 4,
		'batteryTier3'          => 0.7,
		'batteryStcPrice'       => 37,
		// Fixed site costs
		'smallParts'            => 700,
		'installerSignOff'      => 800,
		'ces'                   => 500,
		'labourFixed'           => 1900,
		// Inverters — 8kW dual
		'deyeInverterCost'      => 3100,
		'sigInverterCost'       => 2500,
		// Inverters — single/large
		'sigSingleInverterCost' => 2700,
		'deyeSingleInverterCost'=> 2550,
		// Inverter config
		'sigGatewayCost'        => 1000,
		'solarOversizePercent'  => 200,
		'minInverters'          => 1,
		// Large inverter sizes (used by optimiser + main)
		'optSigInvKw'           => 12,
		'optDeyeInvKw'          => 10,
		'optMinInverters'       => 1,
		'maxBattPerInverter'    => 6,
		// Pricing
		'margin'                => 0.3,
		'gst'                   => 0.1,
		// Ground mount
		'gmFramePerPanel'       => 150,
		'gmLabourPerPanel'      => 150,
		'gmMachineryFixed'      => 1000,
		// 3-phase inverters
		'deye3phInverterCost'   => 3160,
		'sig3ph15kwCost'        => 3350,
		'sig3ph20kwCost'        => 4000,
		'sig3ph30kwCost'        => 5100,
		'sig3phGatewayCost'     => 1800,
	];
}

function solar_calc_get_assumptions() {
	$saved    = get_option( SOLAR_CALC_OPTION_KEY, [] );
	$defaults = solar_calc_defaults();
	return array_merge( $defaults, $saved );
}
