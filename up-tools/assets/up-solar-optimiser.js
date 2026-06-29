/* global document */
(function () {
    'use strict';

    // ─────────────────────────────────────────────
    // Solar production profile — 744 hourly values
    // Represents a typical month (31 days × 24h)
    // Values are fraction of peak output per hour
    // ─────────────────────────────────────────────
    var production = [
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0,
        0.0,0.0,0.0,0.0,0.0,0.02,0.05,0.1,0.18,0.26,0.33,0.38,0.4,0.37,0.31,0.22,0.12,0.05,0.01,0.0,0.0,0.0,0.0,0.0
    ];

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────
    function el(id) {
        return document.getElementById(id);
    }

    function val(id) {
        var n = parseFloat(el(id).value);
        if (isNaN(n)) throw new Error('Invalid value in field: ' + id);
        return n;
    }

    function money(n) {
        return '$' + Math.round(n).toLocaleString();
    }

    function num(n, d) {
        return Number(n).toLocaleString(undefined, {
            minimumFractionDigits: d,
            maximumFractionDigits: d
        });
    }

    // ─────────────────────────────────────────────
    // Read all inputs into one assumptions object
    // ─────────────────────────────────────────────
    function assumptions() {
        return {
            load:           val('upLoad'),
            maxPanels:      Math.floor(val('upMaxPanels')),
            maxBatteries:   Math.floor(val('upMaxBatteries')),
            panelWatts:     val('upPanelWatts'),
            panelCost:      val('upPanelCost'),
            installPerWatt: val('upInstallPerWatt'),
            frameCost:      val('upFrameCost'),
            sigStep:        val('upSigStep'),
            sigCost:        val('upSigCost'),
            sigFixed:       val('upSigFixed'),
            deyeStep:       val('upDeyeStep'),
            deyeCost:       val('upDeyeCost'),
            deyeFixed:      val('upDeyeFixed'),
            smallParts:     val('upSmallParts'),
            reserve:        val('upReserve'),
            efficiency:     val('upEfficiency'),
            margin:         0.30,
            gst:            0.10,
            solarStcPerKw:  6,
            solarStcPrice:  38,
            batteryStcPrice:37,
            batteryTier1:   6.8,
            batteryTier2:   4.0,
            batteryTier3:   0.7,
            batteryTier4:   0
        };
    }

    // ─────────────────────────────────────────────
    // Build an hourly load profile across the
    // same number of hours as the production data
    // Weights: night / morning / midday / evening / late
    // ─────────────────────────────────────────────
    function makeLoadProfile(hours, dailyLoad) {
        var weights = [];
        var i;
        for (i = 0; i < 6;  i++) weights.push(0.15 / 6);
        for (i = 0; i < 3;  i++) weights.push(0.20 / 3);
        for (i = 0; i < 7;  i++) weights.push(0.15 / 7);
        for (i = 0; i < 5;  i++) weights.push(0.40 / 5);
        for (i = 0; i < 3;  i++) weights.push(0.10 / 3);

        var loads = [];
        for (i = 0; i < hours; i++) {
            loads.push(weights[i % 24] * dailyLoad);
        }
        return loads;
    }

    // ─────────────────────────────────────────────
    // Battery rebate — tiered by total kWh capacity
    // ─────────────────────────────────────────────
    function batteryRebate(kwh, a) {
        return a.batteryStcPrice * (
            Math.min(kwh, 14)                        * a.batteryTier1 +
            Math.min(Math.max(kwh - 14, 0), 8)       * a.batteryTier2 +
            Math.min(Math.max(kwh - 22, 0), 28)      * a.batteryTier3 +
            Math.min(Math.max(kwh - 50, 0), 50)      * a.batteryTier4
        );
    }

    // ─────────────────────────────────────────────
    // Hourly simulation
    // Returns whether system meets load with no unmet demand
    // ─────────────────────────────────────────────
    function simulate(solarKw, batteryKwh, loads, a) {
        var reserveFloor = batteryKwh * a.reserve;
        var soc          = batteryKwh;
        var effC         = Math.sqrt(a.efficiency);
        var effD         = Math.sqrt(a.efficiency);
        var unmet        = 0;
        var minSoc       = soc;
        var spilled      = 0;

        for (var i = 0; i < production.length; i++) {
            var solar     = production[i] * solarKw;
            var load      = loads[i];
            var direct    = Math.min(solar, load);
            var remaining = load - direct;
            var excess    = solar - direct;

            if (excess > 0) {
                var room        = Math.max(0, batteryKwh - soc);
                var chargeInput = Math.min(excess, room / effC);
                soc            += chargeInput * effC;
                spilled        += Math.max(0, excess - chargeInput);
            }

            if (remaining > 0) {
                var usableAboveReserve = Math.max(0, soc - reserveFloor);
                var deliverable        = usableAboveReserve * effD;
                var discharge          = Math.min(remaining, deliverable);
                soc       -= discharge / effD;
                remaining -= discharge;
            }

            if (remaining > 0.0000001) unmet += remaining;
            if (soc < minSoc) minSoc = soc;
        }

        return {
            valid:        unmet <= 0.000001,
            unmet:        unmet,
            minSoc:       minSoc,
            reserveFloor: reserveFloor,
            spilled:      spilled
        };
    }

    // ─────────────────────────────────────────────
    // Pricing — gross, rebates, net
    // ─────────────────────────────────────────────
    function calcPrice(panels, batteries, step, batteryCost, fixedCost, a) {
        var solarKw     = panels * a.panelWatts / 1000;
        var batteryKwh  = batteries * step;

        var base = panels * a.panelCost
                 + panels * a.panelWatts * a.installPerWatt
                 + panels * a.frameCost
                 + batteries * batteryCost
                 + a.smallParts
                 + fixedCost;

        var gross       = base * (1 + a.margin) * (1 + a.gst);
        var solarRebate = solarKw * a.solarStcPerKw * a.solarStcPrice;
        var battRebate  = batteryRebate(batteryKwh, a);

        return {
            solarKw:       solarKw,
            batteryKwh:    batteryKwh,
            gross:         gross,
            solarRebate:   solarRebate,
            batteryRebate: battRebate,
            totalRebate:   solarRebate + battRebate,
            net:           gross - solarRebate - battRebate
        };
    }

    // ─────────────────────────────────────────────
    // Optimise — find cheapest valid system for one brand
    // Iterates all panel × battery combinations
    // ─────────────────────────────────────────────
    function optimiseBrand(name, step, batteryCost, fixedCost, loads, a) {
        var best = null;
        var rows = [];

        for (var panels = 1; panels <= a.maxPanels; panels++) {
            for (var batteries = 1; batteries <= a.maxBatteries; batteries++) {
                var p = calcPrice(panels, batteries, step, batteryCost, fixedCost, a);
                var s = simulate(p.solarKw, p.batteryKwh, loads, a);

                var row = {
                    brand:      name,
                    panels:     panels,
                    solarKw:    p.solarKw,
                    batteries:  batteries,
                    batteryKwh: p.batteryKwh,
                    reserve:    s.reserveFloor,
                    minSoc:     s.minSoc,
                    unmet:      s.unmet,
                    spilled:    s.spilled,
                    gross:      p.gross,
                    rebate:     p.totalRebate,
                    net:        p.net,
                    valid:      s.valid
                };

                rows.push(row);
                if (row.valid && (!best || row.net < best.net)) best = row;
            }
        }

        if (!best) {
            throw new Error('No valid system found for ' + name + '. Try increasing max panels or max batteries.');
        }

        return { best: best, rows: rows };
    }

    // ─────────────────────────────────────────────
    // Build the plain-text summary used by both
    // Copy and Fill Form buttons
    // ─────────────────────────────────────────────
    function summaryText(r) {
        return [
            '100UP System Quote — ' + r.brand,
            '──────────────────────────',
            'Panels:          ' + r.panels + ' (' + num(r.solarKw, 2) + ' kW)',
            'Battery units:   ' + r.batteries + ' (' + num(r.batteryKwh, 2) + ' kWh usable)',
            'Reserve floor:   ' + num(r.reserve, 2) + ' kWh',
            'Minimum SOC:     ' + num(r.minSoc, 2) + ' kWh',
            '──────────────────────────',
            'Gross (inc. margin + GST): ' + money(r.gross),
            'Total rebates:             ' + money(r.rebate),
            'Net price to customer:     ' + money(r.net),
            '──────────────────────────',
            'Generated by 100UP Solar Optimiser'
        ].join('\n');
    }

    // ─────────────────────────────────────────────
    // Render — result card HTML
    // Copy button uses clipboard API with fallback
    // Fill button targets the Breakdance contact form
    // ─────────────────────────────────────────────
    function card(r, winner) {
        var isWinner = r.brand === winner;
        var cardId   = 'up-card-' + r.brand.toLowerCase().replace(/\s+/g, '-');

        return '<div class="up-result' + (isWinner ? ' up-winner' : '') + '" id="' + cardId + '">' +
            '<h3>' + r.brand + (isWinner ? ' ✓ Winner' : '') + '</h3>' +
            '<div class="up-price">' + money(r.net) + '</div>' +
            '<div class="up-row"><span>Panels</span><span>' + r.panels + '</span></div>' +
            '<div class="up-row"><span>Solar size</span><span>' + num(r.solarKw, 2) + ' kW</span></div>' +
            '<div class="up-row"><span>Battery units</span><span>' + r.batteries + '</span></div>' +
            '<div class="up-row"><span>Battery usable</span><span>' + num(r.batteryKwh, 2) + ' kWh</span></div>' +
            '<div class="up-row"><span>Reserve floor</span><span>' + num(r.reserve, 2) + ' kWh</span></div>' +
            '<div class="up-row"><span>Minimum SOC</span><span>' + num(r.minSoc, 2) + ' kWh</span></div>' +
            '<div class="up-row"><span>Unmet load</span><span>' + num(r.unmet, 4) + ' kWh</span></div>' +
            '<div class="up-row"><span>Gross before rebates</span><span>' + money(r.gross) + '</span></div>' +
            '<div class="up-row"><span>Total rebates</span><span>' + money(r.rebate) + '</span></div>' +
            '<div class="up-card-actions">' +
                '<button type="button" class="up-btn-copy" data-card="' + cardId + '">Copy Summary</button>' +
                '<button type="button" class="up-btn-fill" data-card="' + cardId + '">Fill Form ↓</button>' +
            '</div>' +
            '</div>';
    }

    // ─────────────────────────────────────────────
    // Copy to clipboard
    // ─────────────────────────────────────────────
    function handleCopy(btn, r) {
        var text = summaryText(r);

        function onSuccess() {
            btn.textContent = '✓ Copied';
            btn.classList.add('up-copied');
            setTimeout(function () {
                btn.textContent = 'Copy Summary';
                btn.classList.remove('up-copied');
            }, 2000);
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(onSuccess);
        } else {
            // Fallback for http or older browsers
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity  = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            try { document.execCommand('copy'); onSuccess(); } catch (e) {}
            document.body.removeChild(ta);
        }
    }

    // ─────────────────────────────────────────────
    // Fill Breakdance contact form
    // Targets #message textarea (standard Breakdance field id)
    // Scrolls smoothly to form after filling
    // ─────────────────────────────────────────────
    function handleFill(btn, r) {
        var messageField = document.getElementById('message');

        if (!messageField) {
            alert('Contact form not found on this page. Make sure the form is below the optimiser.');
            return;
        }

        messageField.value = summaryText(r);

        // Trigger change event so Breakdance picks up the value
        var evt = document.createEvent('Event');
        evt.initEvent('input', true, true);
        messageField.dispatchEvent(evt);

        btn.textContent = '✓ Form Filled';
        btn.classList.add('up-filled');
        setTimeout(function () {
            btn.textContent = 'Fill Form ↓';
            btn.classList.remove('up-filled');
        }, 2000);

        // Smooth scroll to form
        messageField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ─────────────────────────────────────────────
    // Render — comparison table (top 60 valid rows)
    // ─────────────────────────────────────────────
    function renderTable(rows) {
        el('upTopHead').innerHTML =
            '<tr>' +
            '<th>Brand</th><th>Panels</th><th>Solar kW</th>' +
            '<th>Batteries</th><th>Battery kWh</th><th>Net Price</th><th>Min SOC</th>' +
            '</tr>';

        el('upTopBody').innerHTML = rows.slice(0, 60).map(function (r) {
            return '<tr>' +
                '<td>' + r.brand + '</td>' +
                '<td>' + r.panels + '</td>' +
                '<td>' + num(r.solarKw, 2) + '</td>' +
                '<td>' + r.batteries + '</td>' +
                '<td>' + num(r.batteryKwh, 2) + '</td>' +
                '<td>' + money(r.net) + '</td>' +
                '<td>' + num(r.minSoc, 2) + '</td>' +
                '</tr>';
        }).join('');
    }

    // ─────────────────────────────────────────────
    // Main run function
    // ─────────────────────────────────────────────
    function run() {
        var errorEl = el('upError');
        errorEl.style.display = 'none';
        errorEl.textContent = '';

        try {
            if (!production || production.length !== 744) {
                throw new Error('Production data problem. Expected 744 values, found ' +
                    (production ? production.length : 0));
            }

            var a      = assumptions();
            var loads  = makeLoadProfile(production.length, a.load);
            var sig    = optimiseBrand('Sigenergy', a.sigStep, a.sigCost, a.sigFixed, loads, a);
            var deye   = optimiseBrand('Deye',      a.deyeStep, a.deyeCost, a.deyeFixed, loads, a);
            var winner = sig.best.net <= deye.best.net ? 'Sigenergy' : 'Deye';

            el('upResults').innerHTML =
                '<div class="up-grid">' +
                card(sig.best, winner) +
                card(deye.best, winner) +
                '</div>';

            // Store results for button handlers
            var resultMap = {};
            resultMap['up-card-' + sig.best.brand.toLowerCase().replace(/\s+/g, '-')]  = sig.best;
            resultMap['up-card-' + deye.best.brand.toLowerCase().replace(/\s+/g, '-')] = deye.best;

            // Wire copy buttons
            var copyBtns = el('upResults').querySelectorAll('.up-btn-copy');
            copyBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var r = resultMap[btn.getAttribute('data-card')];
                    if (r) handleCopy(btn, r);
                });
            });

            // Wire fill buttons
            var fillBtns = el('upResults').querySelectorAll('.up-btn-fill');
            fillBtns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var r = resultMap[btn.getAttribute('data-card')];
                    if (r) handleFill(btn, r);
                });
            });

            var validRows = sig.rows.concat(deye.rows)
                .filter(function (r) { return r.valid; })
                .sort(function (a, b) { return a.net - b.net; });

            renderTable(validRows);

        } catch (e) {
            errorEl.style.display = 'block';
            errorEl.textContent   = e.message;
            el('upResults').innerHTML  = '';
            el('upTopHead').innerHTML  = '';
            el('upTopBody').innerHTML  = '';
        }
    }

    // ─────────────────────────────────────────────
    // Init — wait for DOM, then wire up button and run
    // ─────────────────────────────────────────────
    function init() {
        var btn = el('upRunBtn');
        if (!btn) return; // shortcode not on this page
        btn.addEventListener('click', run);
        run();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
