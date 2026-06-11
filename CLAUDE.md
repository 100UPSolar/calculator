# 100UP Calculator — Project Handover

## What this is
A single-file HTML application (`100UP_calculators_GEN_v##.html`) used by 100UP Solar / Re-Energy (Ballarat, VIC) for sales quoting of **off-grid solar + battery systems**. All HTML, CSS, and JS live in one file. There is also a separate customer-facing widget (`re-energy-qe-embed.html`) embedded on re-energy.com.au, and a separate Pipeline/CRM tracker file (deliberately NOT merged with the calculator).

## CRITICAL RULES — never break these

1. **Strict sequential versioning.** Every change, no matter how small, increments the version number (v64 → v65 → v66...). Never reuse a version number across separate updates. The version appears in the filename AND inside the file (header/title) — bump both. Deliver the complete updated file each time.
2. **`DEFAULT_A` values must stay zeroed.** localStorage is the sole source of truth for assumption values. Never re-hardcode business numbers into `DEFAULT_A` — this caused user assumptions to reset on every new file version and was deliberately fixed.
3. **Manufacturer part names must be verified against official product pages** — do not guess model numbers. Claude got Deye naming wrong twice before (invented SUN-series numbers, then SE-G5.1 Pro-B). Current verified conventions:
   - **Sigenergy:** SigenStor BAT 8.0 (capacity-based lookup for other sizes); SigenStor EC models for SP/TP inverters (8/12/15/20/30 kW); Sigen Gateway with phase designation.
   - **Deye:** AI-W5.1-B (battery); AI-W5.1-PDU3 + Base (BMS/base, always 1 per inverter); `Deye AI-W5.1-{kW}P1-AU-B` (single-phase inverters); `Deye AI-W5.1-{kW}P3-AU-B` (three-phase).
   - Model-name logic is centralised in three JS helpers: `partBattery`, `partInverter`, `partSigGateway`. Route any new naming through these.

## Domain model

- Systems are sized against a **July worst-case hourly survival model** for Ballarat, VIC.
- Two brands: **Sigenergy = premium**, **Deye = budget**.
- Off-grid; generator assistance is a configurable option. "No pass found" results still show system price, express shortage as % of July load, and recommend a generator for the shortfall.
- Inverter selection is dynamic: smallest size that fits the solar array (8/12 kW Sigenergy, Deye sizes), with inverter count scaling when batteries exceed `maxBattPerInverter` (6) per inverter.
- Sigenergy gateway: 1 per ≤3 inverters (12 kW single-phase gateway); separate 3-phase gateway exists.
- **STCs** apply to both solar (`solarStcPerKw` × kW × `solarStcPrice`) and battery (tiered: `batteryTier1/2/3` × `batteryStcPrice` via `batteryStcCount`).
- Ground mount: per-panel frame ($150) and labour ($150) rates plus fixed machinery; GM BOM tab has its own parts list with unit costs (defaults from L&H Wendouree quote 0066286481, 03-06-26, key `100upGmBomCosts_v1`) and a Print BOM feature.

## Tabs
Quick Estimate (landing) · Calculator (fixed panels + ground mount checkbox, auto/manual battery toggle) · Optimiser · 3-Phase · GM BOM · Assumptions.

## Assumptions system
- Stored in localStorage (browser + file-path specific). Assumptions tab has **Export** (dated JSON download) and **Import** buttons — this is how values survive new file versions and browser/path changes.
- Reference values (v26 baseline): panelW=490, panelCost=140, panelInstallPerW=0.35, panelFrame=50, solarStcPerKw=6, solarStcPrice=38, sigBatteryKwh=7.8, sigBatteryCost=3650, deyeBatteryKwh=5.1, deyeBatteryCost=1600, batteryTier1=6.8, batteryTier2=4, batteryTier3=0.7, batteryStcPrice=37, smallParts=700, installerSignOff=800, ces=500, labourFixed=1900, deyeInverterCost=3100, sigInverterCost=2500, sigSingleInverterCost=2700, deyeSingleInverterCost=2550, sigGatewayCost=1000, margin=0.3, gst=0.1, solarOversizePercent=200, minInverters=1, gmFramePerPanel=150, gmLabourPerPanel=150, gmMachineryFixed=1000, optSigInvKw=12, optDeyeInvKw=10, optMinInverters=1, maxBattPerInverter=6, deye3phInverterCost=3160, sig3ph15kwCost=3350, sig3ph20kwCost=4000, sig3ph30kwCost=5100, sig3phGatewayCost=1800.
- NOTE: live values come from Fred's exported JSON / localStorage, not from the table above.

## Open decisions (do not implement without asking Fred)

1. **10 kW single-phase Deye gap.** Deye's AI-W5.1 single-phase line tops out at 8 kW, so the "10 kW single-phase Deye" config has no real matching model. Options: treat as three-phase, or remove the config.
2. **Battery STC tier values.** `batteryStcCount` tier-boundary bugs were fixed in v60. Analysis suggests corrected tier rates of `batteryTier1=6.8`, `batteryTier2=4.08`, `batteryTier3=1.0` (vs the older 6.8/4/0.7). Two implementation options were presented: (a) update the JSON assumption values directly, or (b) derive from `solarStcPerKw × percentage`. Fred has not yet chosen.

## Recent history (for orientation)
- v60: battery STC tier boundary fixes.
- ~v53–59: rounded display numbers; embed price displays ("From" + 10% reduction); June worst-case sizing banner on embed; Print BOM; zeroed `DEFAULT_A`; assumptions Export/Import.
- v63: manufacturer part names added throughout via the three helper functions.
- v64: GM BOM default unit costs from L&H Wendouree quote merged into `gmCosts`.

## Known pitfalls from past sessions
- `sed` edits have corrupted code before (e.g. mangled `A.inverterKw = Math.max(...)`); prefer precise targeted edits and verify with grep afterwards.
- Watch for stale function references after refactors (e.g. a leftover `costForOpt` call once blanked most tabs).
- localStorage key conflicts can make old defaults persist — if changing a default's meaning, consider the stored key.
- Fred communicates in brief, directive requests and expects full implementation including edge cases and UI polish.

## Working style
- Read the relevant section of the file before editing; the file is large.
- After any change: bump version (filename + in-file), sanity-check all tabs still render (no JS console errors), then deliver/save the complete file.
