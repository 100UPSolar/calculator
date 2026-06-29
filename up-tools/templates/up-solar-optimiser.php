<?php
/**
 * Template: Solar Optimiser
 * Shortcode: [up_solar_optimiser]
 *
 * Pure HTML only — all CSS and JS are enqueued separately.
 * Add or remove input fields here; keep IDs matching up-solar-optimiser.js
 */
?>
<div id="up-offgrid-calc">

    <div class="up-box">
        <h2>Private Off-grid Solar Optimiser</h2>
        <p>Enter your daily load and run the optimisation to find the cheapest panel and battery combination that never runs out of power.</p>

        <label for="upLoad">Daily load demand (kWh/day)</label>
        <input id="upLoad" type="number" value="30" min="1" step="0.5">

        <button type="button" id="upRunBtn">Run Optimisation</button>

        <div id="upError" class="up-error"></div>

        <details>
            <summary>Advanced settings</summary>

            <div class="up-input-grid">

                <div class="up-input-group">
                    <h4>Sigenergy Costs</h4>
                    <label>Battery usable kWh</label>
                    <input id="upSigStep" type="number" value="7.8" step="0.1">
                    <label>Battery unit cost ($)</label>
                    <input id="upSigCost" type="number" value="3650">
                    <label>Fixed system cost ($)</label>
                    <input id="upSigFixed" type="number" value="9100">
                </div>

                <div class="up-input-group">
                    <h4>Deye Costs</h4>
                    <label>Battery usable kWh</label>
                    <input id="upDeyeStep" type="number" value="5.1" step="0.1">
                    <label>Battery unit cost ($)</label>
                    <input id="upDeyeCost" type="number" value="1600">
                    <label>Fixed system cost ($)</label>
                    <input id="upDeyeFixed" type="number" value="9300">
                </div>

                <div class="up-input-group">
                    <h4>Other Costs</h4>
                    <label>Panel watts</label>
                    <input id="upPanelWatts" type="number" value="510">
                    <label>Panel cost ($)</label>
                    <input id="upPanelCost" type="number" value="120">
                    <label>Install cost per watt ($)</label>
                    <input id="upInstallPerWatt" type="number" value="0.35" step="0.01">
                    <label>Frame cost per panel ($)</label>
                    <input id="upFrameCost" type="number" value="50">
                    <label>Small parts ($)</label>
                    <input id="upSmallParts" type="number" value="2000">
                </div>

                <div class="up-input-group">
                    <h4>Limits &amp; Efficiencies</h4>
                    <label>Max panels to test</label>
                    <input id="upMaxPanels" type="number" value="160">
                    <label>Max battery units to test</label>
                    <input id="upMaxBatteries" type="number" value="30">
                    <label>Battery reserve (e.g. 0.15 = 15%)</label>
                    <input id="upReserve" type="number" value="0.15" step="0.01">
                    <label>Round-trip efficiency (e.g. 0.92)</label>
                    <input id="upEfficiency" type="number" value="0.92" step="0.01">
                </div>

            </div>
        </details>
    </div>

    <div class="up-box">
        <h2>Best Value Results</h2>
        <div id="upResults"></div>
    </div>

    <div class="up-box">
        <h2>Top Valid Options</h2>
        <div class="up-table-wrap">
            <table>
                <thead id="upTopHead"></thead>
                <tbody id="upTopBody"></tbody>
            </table>
        </div>
    </div>

</div>
