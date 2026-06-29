<?php
if ( ! defined( 'ABSPATH' ) ) exit;

add_shortcode( 'solar_quick_estimate', 'solar_sc_quick_estimate' );
add_shortcode( 'solar_calculator',     'solar_sc_calculator' );

// ── Quick Estimate ──────────────────────────────────────────────────────────

function solar_sc_quick_estimate( $atts ) {
	ob_start();
	?>
	<div class="solar-calc-wrap solar-light" id="solar-qe-root">
		<section class="solar-calc solar-qe-section">
			<div class="qe-hero">
				<div class="qe-title">Quick System Estimate</div>
				<div class="qe-sub">Select bedrooms or number of people — they stay in sync. We use <strong>bedrooms + 1 = people</strong> and calculate <strong>5 kWh base + 5 kWh per person</strong>. Finds the minimum system that survives a July worst-case simulation. Prices shown are after all rebates.</div>

				<div style="margin-top:24px">
					<div class="field-group-title" style="margin-top:0">How many bedrooms?</div>
					<div class="occupant-picker" id="bedroomPicker"></div>
					<div class="field-group-title" style="margin-top:16px">Or select number of people</div>
					<div class="occupant-picker" id="occPicker"></div>
					<div class="qe-load-summary" id="qeLoadSummary" style="display:none">
						<div>
							<div class="qe-load-val" id="qeLoadVal">—</div>
							<div class="qe-load-eq" id="qeLoadEq"></div>
						</div>
						<div style="border-left:1px solid var(--sc-border);padding-left:12px;color:var(--sc-muted);font-size:11px;line-height:1.8" id="qeLoadBreakdown"></div>
					</div>
				</div>

				<div id="qeResult">
					<div class="qe-no-result">Select number of occupants above to see a system estimate</div>
				</div>

				<div class="qe-disclaimer" id="qeDisclaimer" style="display:none">
					<strong>Indicative pricing only.</strong> This estimate uses our standard assumptions and finds the minimum battery size that survives a July worst-case hourly simulation. Prices shown are after solar and battery rebates. Actual pricing depends on site conditions, roof space available, travel, and other site-specific factors.
				</div>
			</div>
		</section>
	</div>
	<?php
	return ob_get_clean();
}

// ── Internal Calculator ─────────────────────────────────────────────────────

function solar_sc_calculator( $atts ) {
	$atts = shortcode_atts( [ 'tab' => 'all' ], $atts, 'solar_calculator' );
	$tab  = sanitize_key( $atts['tab'] );

	$valid_tabs = [ 'main', 'three', 'optimiser', 'all' ];
	if ( ! in_array( $tab, $valid_tabs, true ) ) $tab = 'all';

	$show_main  = in_array( $tab, [ 'main', 'all' ], true );
	$show_three = in_array( $tab, [ 'three', 'all' ], true );
	$show_opt   = in_array( $tab, [ 'optimiser', 'all' ], true );
	$show_tabs  = $tab === 'all';

	// Admin edit-pricing link (only visible to admins, not customers)
	$admin_link = '';
	if ( current_user_can( 'manage_options' ) ) {
		$url        = admin_url( 'admin.php?page=solar-calc-assumptions' );
		$admin_link = '<a href="' . esc_url( $url ) . '" class="solar-admin-link" target="_blank">⚙ Edit Pricing</a>';
	}

	ob_start();
	?>
	<div class="solar-calc-wrap solar-light" id="solar-calc-root">

		<?php if ( $show_tabs ) : ?>
		<div class="tab-bar">
			<?php if ( $show_main )  : ?><button class="tab-btn active" onclick="solarShowTab('main',this)"><span class="tab-icon">📐</span>Calculator</button><?php endif; ?>
			<?php if ( $show_three ) : ?><button class="tab-btn<?php echo $show_main ? '' : ' active'; ?>" onclick="solarShowTab('three',this)"><span class="tab-icon">🔌</span>3 Phase</button><?php endif; ?>
			<?php if ( $show_opt )   : ?><button class="tab-btn<?php echo ( $show_main || $show_three ) ? '' : ' active'; ?>" onclick="solarShowTab('optimiser',this)"><span class="tab-icon">⚡</span>Optimiser</button><?php endif; ?>
			<div class="tab-bar-right"><?php echo $admin_link; ?></div>
		</div>
		<?php else : ?>
			<?php if ( $admin_link ) echo '<div class="solar-admin-bar">' . $admin_link . '</div>'; ?>
		<?php endif; ?>

		<?php if ( $show_main ) : ?>
		<!-- ── Main Calculator ── -->
		<section id="solar-main" class="solar-calc<?php echo $show_tabs ? ' sc-tab' : ''; ?>">
			<div class="layout">
				<div class="card">
					<div class="card-title">System Calculator</div>
					<div class="card-sub">Results update automatically as you type.</div>

					<div class="field"><label class="field-label">Daily load (kWh/day)</label><input id="mainLoad" type="number" value="20" step="0.5" oninput="scScheduleMain()"></div>

					<div class="field">
						<label class="field-label">Battery sizing</label>
						<select id="mainBattMode" onchange="scMainModeChange()">
							<option value="auto">Auto — find minimum that survives July</option>
							<option value="manual">Manual — enter battery units per brand</option>
						</select>
					</div>

					<div id="mainAutoFields">
						<div class="field-row">
							<div class="field"><label class="field-label">Starting units</label><input id="mainStartUnits" type="number" value="1" step="1" oninput="scScheduleMain()"></div>
							<div class="field"><label class="field-label">Max units to try</label><input id="mainMaxUnits" type="number" value="40" step="1" oninput="scScheduleMain()"></div>
						</div>
					</div>

					<div id="mainManualFields" style="display:none">
						<div class="field-row">
							<div class="field"><label class="field-label">Sig battery units</label><input id="mainSigUnits" type="number" value="3" step="1" oninput="scScheduleMain()"></div>
							<div class="field"><label class="field-label">Deye battery units</label><input id="mainDeyeUnits" type="number" value="5" step="1" oninput="scScheduleMain()"></div>
						</div>
					</div>

					<div id="mainRoofOnlyFields">
						<div class="field"><label class="field-label">Number of panels</label><input id="mainPanels" type="number" value="36" step="1" oninput="scScheduleMain()"></div>
					</div>

					<div id="mainGroundFields" style="display:none">
						<div class="field-group-title" style="margin-top:12px">Panel split</div>
						<div class="field-row">
							<div class="field"><label class="field-label">Roof panels</label><input id="mainRoofPanels" type="number" value="24" step="1" oninput="scScheduleMain()"></div>
							<div class="field"><label class="field-label">Ground panels</label><input id="mainGmPanels" type="number" value="12" step="1" oninput="scScheduleMain()"></div>
						</div>
						<div class="field"><label class="field-label">Total panels</label><input id="mainTotalPanels" type="number" readonly style="opacity:.5;cursor:not-allowed"></div>
					</div>

					<div style="margin-top:14px;display:flex;align-items:center;gap:10px">
						<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--sc-muted)">
							<input type="checkbox" id="mainGroundCheck" onchange="scMainGroundChange()" style="width:16px;height:16px;accent-color:var(--sc-accent);cursor:pointer">
							<span>Include ground mount panels</span>
						</label>
					</div>
				</div>
				<div>
					<div class="section-label">Summary</div>
					<div id="mainKpis" class="kpi-strip"></div>
					<div class="section-label">System results</div>
					<div id="mainResults" class="results-grid"></div>
					<div class="quote-wrapper"><div id="mainQuotes"></div></div>
				</div>
			</div>
		</section>
		<?php endif; ?>

		<?php if ( $show_three ) : ?>
		<!-- ── 3 Phase ── -->
		<section id="solar-three" class="solar-calc<?php echo $show_tabs ? ' sc-tab sc-hidden' : ''; ?>">
			<div class="layout">
				<div class="card">
					<div class="card-title">3 Phase System Calculator</div>
					<div class="card-sub">Inverters are 3-phase: Deye 12kW or Sigenergy 15/20/30kW — smallest that fits is selected automatically. Results update live.</div>

					<div class="field"><label class="field-label">Daily load (kWh/day)</label><input id="three3phLoad" type="number" value="40" step="0.5" oninput="scSchedule3ph()"></div>

					<div class="field">
						<label class="field-label">Battery sizing</label>
						<select id="three3phBattMode" onchange="scThree3phModeChange()">
							<option value="auto">Auto — find minimum that survives July</option>
							<option value="manual">Manual — enter battery units per brand</option>
						</select>
					</div>

					<div id="three3phAutoFields">
						<div class="field-row">
							<div class="field"><label class="field-label">Starting units</label><input id="three3phStartUnits" type="number" value="1" step="1" oninput="scSchedule3ph()"></div>
							<div class="field"><label class="field-label">Max units to try</label><input id="three3phMaxUnits" type="number" value="40" step="1" oninput="scSchedule3ph()"></div>
						</div>
					</div>

					<div id="three3phManualFields" style="display:none">
						<div class="field-row">
							<div class="field"><label class="field-label">Sig battery units</label><input id="three3phSigUnits" type="number" value="3" step="1" oninput="scSchedule3ph()"></div>
							<div class="field"><label class="field-label">Deye battery units</label><input id="three3phDeyeUnits" type="number" value="5" step="1" oninput="scSchedule3ph()"></div>
						</div>
					</div>

					<div class="field"><label class="field-label">Number of panels</label><input id="three3phPanels" type="number" value="60" step="1" oninput="scSchedule3ph()"></div>

					<div class="alert alert-info" style="margin-top:14px">Sigenergy 3-phase uses a $1,800 gateway (1 per ≤3 inverters). All inverter sizes tried — smallest that needs fewest units wins.</div>
				</div>
				<div>
					<div class="section-label">Summary</div>
					<div id="three3phKpis" class="kpi-strip"></div>
					<div class="section-label">System results</div>
					<div id="three3phResults" class="results-grid"></div>
					<div class="quote-wrapper"><div id="three3phQuotes"></div></div>
				</div>
			</div>
		</section>
		<?php endif; ?>

		<?php if ( $show_opt ) : ?>
		<!-- ── Optimiser ── -->
		<section id="solar-optimiser" class="solar-calc<?php echo $show_tabs ? ' sc-tab sc-hidden' : ''; ?>">
			<div class="layout">
				<div class="card">
					<div class="card-title">Value Optimiser</div>
					<div class="card-sub">Tries every panel/battery combination and finds the lowest price for each brand. Results update automatically.</div>
					<div class="field"><label class="field-label">Daily load (kWh/day)</label><input id="optLoad" type="number" value="20" step="0.5" oninput="scScheduleOpt()"></div>

					<div style="margin-top:12px">
						<button class="btn btn-secondary btn-sm" onclick="scToggleOptAdvanced(this)" style="width:100%;justify-content:space-between">
							<span>⚙ Advanced search options</span><span id="optAdvIcon">▸</span>
						</button>
					</div>
					<div id="optAdvanced" style="display:none;margin-top:10px">
						<div class="field-row">
							<div class="field"><label class="field-label">Min panels</label><input id="minPanels" type="number" value="12" step="1" oninput="scScheduleOpt()"></div>
							<div class="field"><label class="field-label">Max panels</label><input id="maxPanels" type="number" value="120" step="1" oninput="scScheduleOpt()"></div>
						</div>
						<div class="field-row">
							<div class="field"><label class="field-label">Panel step</label><input id="panelStep" type="number" value="1" step="1" oninput="scScheduleOpt()"></div>
							<div class="field"><label class="field-label">Max battery units</label><input id="optMaxUnits" type="number" value="40" step="1" oninput="scScheduleOpt()"></div>
						</div>
					</div>
				</div>
				<div>
					<div class="section-label">Summary</div>
					<div id="optKpis" class="kpi-strip"></div>
					<div class="section-label">Best options</div>
					<div id="optResults" class="results-grid"></div>
					<div class="quote-wrapper"><div id="optQuotes"></div></div>
				</div>
			</div>
		</section>
		<?php endif; ?>

	</div><!-- .solar-calc-wrap -->
	<?php
	return ob_get_clean();
}
