/**
 * 100UP Solar Calculator — frontend engine
 * Pricing is injected server-side via SolarCalcConfig.assumptions (wp_localize_script).
 * No hardcoded defaults here — all values come from the WP admin settings page.
 */
(function () {
  'use strict';

  // ── Config from server ──────────────────────────────────────────────────
  const A = (window.SolarCalcConfig && window.SolarCalcConfig.assumptions)
    ? window.SolarCalcConfig.assumptions
    : {};

  // ── July hourly solar production (W per kW installed) — 31 days × 24 h ─
  const solarWPerKw = [0,0,0,0,0,0,0,0,75.564,294.517,472.675,554.064,578.169,548.313,467.476,321.697,127.266,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,75.461,107.045,260.178,560.113,582.685,553.308,293.507,143.84,46.193,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.019,9.124,36.791,535.684,316.378,216.311,210.212,108.252,119.054,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,126.271,23.929,146.129,27.527,204.702,115.929,291.449,109.898,61.768,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.321,291.166,22.133,88.295,98.114,172.529,148.081,13.185,4.278,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11.978,35.843,83.257,112.174,252.235,139.873,11.457,89.39,29.225,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,132.205,338.893,484.911,565.2,595.216,565.742,130.278,335.672,134.837,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10.517,348.39,54.273,580.021,604.815,172.679,92.774,344.843,140.553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144.793,351.504,489.274,580.379,611.908,579.295,491.354,340.081,128.435,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.079,13.212,22.044,76.7,127.231,306.663,68.256,31.269,10.478,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12.125,35.279,141.373,57.689,148.938,201.036,134.681,75.791,23.946,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.068,13.178,79.837,29.116,56.987,64.764,100.233,69.52,22.268,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.062,13.963,155.861,85.171,161.343,273.353,76.96,42.903,14.426,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144.126,345.146,484.501,572.38,601.213,571.261,486.398,343.522,148.386,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,150.923,352.817,487.742,570.765,600.025,575.854,494.374,355.11,156.694,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,158.642,366.693,504.68,330.753,400.058,257.257,270.583,95.151,59.036,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55.587,153.743,46.21,170.721,328.518,58.311,104.424,7.525,3.57,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,143.503,7.626,120.713,582.549,610.298,584.488,499.048,207.845,81.788,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.076,13.931,106.334,218.46,170.245,229.222,165.344,91.78,161.621,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,155.214,42.612,504.921,595.629,622.608,589.041,502.228,356.04,150.698,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,146.596,350.271,492.943,136.712,598.218,561.259,24.391,326.708,5.864,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,157.812,361.704,495.829,573.511,597.399,572.245,496.219,358.866,161.231,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,157.647,355.332,489.255,351.354,309.378,579.776,342.215,239.089,107.764,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34.625,46.647,498.033,212.644,182.994,244.232,498.687,68.433,28.93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.867,14.715,504.542,583.69,243.09,588.188,35.071,200.797,176.008,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176.916,15.682,529.041,614.215,641.403,209.655,170.596,390.122,38.945,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,190.064,403.298,542.064,628.401,659.057,629.6,544.154,404.033,93.498,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,178.735,382.712,518.526,600.117,624.139,592.487,507.406,367.017,175.76,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,185.76,391.639,530.4,611.256,397.319,339.648,208.32,290.957,48.958,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10.68,16.473,37.517,332.548,80.734,107.115,152.38,256.216,171.299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,188.899,395.875,525.774,605.312,632.039,296.349,524.189,243.5,112.766,0,0,0,0,0,0,0];

  const loadBlocks = [
    {start:0,end:4,pct:12.5},{start:4,end:8,pct:15},{start:8,end:12,pct:12.5},
    {start:12,end:16,pct:17.5},{start:16,end:20,pct:30},{start:20,end:24,pct:17.5}
  ];
  const pctSum = loadBlocks.reduce((s,b)=>s+b.pct,0);

  // ── Formatters ─────────────────────────────────────────────────────────
  function fmt(n){ return new Intl.NumberFormat('en-AU',{maximumFractionDigits:0}).format(Math.round(n)); }
  function money(n){ return '$'+fmt(n); }
  function money2(n){ return '$'+new Intl.NumberFormat('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0); }
  function kw(n){ return (Math.round(n*10)/10).toFixed(1)+'kW'; }
  function kwh(n){ return (Math.round(n*10)/10).toFixed(1)+'kWh'; }

  // ── Tab switcher (internal tools) ──────────────────────────────────────
  window.solarShowTab = function(id, btn){
    document.querySelectorAll('.sc-tab').forEach(x=>x.classList.add('sc-hidden'));
    const el = document.getElementById('solar-'+id);
    if(el) el.classList.remove('sc-hidden');
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    if(btn) btn.classList.add('active');
  };

  // ── Simulation engine ──────────────────────────────────────────────────
  function hourlyLoadKwh(dailyKwh, hour){
    const block = loadBlocks.find(b=>hour>=b.start&&hour<b.end);
    return dailyKwh*(block.pct/pctSum)/(block.end-block.start);
  }

  function simulate(panelCount, batteryKwh, dailyKwh){
    const solarKw = panelCount*A.panelW/1000;
    let soc=batteryKwh, unmet=0, spilled=0;
    for(let i=0;i<solarWPerKw.length;i++){
      const hour=i%24;
      const production=solarKw*solarWPerKw[i]/1000;
      const load=hourlyLoadKwh(dailyKwh,hour);
      soc+=production-load;
      if(soc>batteryKwh){spilled+=soc-batteryKwh;soc=batteryKwh;}
      if(soc<0){unmet+=-soc;soc=0;}
    }
    return {passes:unmet<0.00001,unmet,spilled,solarKw,modeLabel:'Accurate July hourly model'};
  }

  // ── Rebate calculations ────────────────────────────────────────────────
  function solarStcCount(solarKw){ return solarKw*A.solarStcPerKw; }
  function batteryStcCount(battKwh){
    let stc=0;
    stc+=Math.min(battKwh,14)*A.batteryTier1;
    if(battKwh>14) stc+=Math.min(battKwh-14,8)*A.batteryTier2;
    if(battKwh>22) stc+=Math.min(battKwh-22,28)*A.batteryTier3;
    return stc;
  }

  // ── Core cost engine ───────────────────────────────────────────────────
  function costForWithConfig(brand, panelCount, units, invKw, invUnitCost, minInv){
    const solarKw=panelCount*A.panelW/1000;
    const isSig=brand==='Sigenergy';
    const maxSolarPerInv=invKw*(A.solarOversizePercent/100);
    const invForSolar=Math.max(minInv,Math.ceil(solarKw/maxSolarPerInv));
    const invForBatt=Math.ceil(units/A.maxBattPerInverter);
    const invCount=Math.max(invForSolar,invForBatt);
    const panelSupplyCost=panelCount*A.panelCost;
    const panelInstallCost=panelCount*A.panelW*A.panelInstallPerW;
    const panelFrameCost=panelCount*A.panelFrame;
    const panelCost=panelSupplyCost+panelInstallCost+panelFrameCost;
    const fixed=A.smallParts+A.installerSignOff+A.ces+A.labourFixed;
    const batteryKwh=units*(isSig?A.sigBatteryKwh:A.deyeBatteryKwh);
    const batteryCost=units*(isSig?A.sigBatteryCost:A.deyeBatteryCost);
    const gatewayCount=isSig?Math.ceil(invCount/3):0;
    const inverterCost=invCount*invUnitCost+gatewayCount*A.sigGatewayCost;
    const costBeforeMargin=panelCost+fixed+batteryCost+inverterCost;
    const marginDollar=costBeforeMargin*A.margin;
    const basePlusMargin=costBeforeMargin+marginDollar;
    const gstDollar=basePlusMargin*A.gst;
    const afterMarginGst=basePlusMargin+gstDollar;
    const solarStcs=solarStcCount(solarKw);
    const batteryStcs=batteryStcCount(batteryKwh);
    const solarRebateValue=solarStcs*A.solarStcPrice;
    const batteryRebateValue=batteryStcs*A.batteryStcPrice;
    const rebate=solarRebateValue+batteryRebateValue;
    const finalPrice=Math.max(0,afterMarginGst-rebate);
    return {brand,panelCount,solarKw,units,batteryKwh,invCount,invKw,gatewayCount,
      panelSupplyCost,panelInstallCost,panelFrameCost,panelCost,fixed,
      batteryCost,inverterCost,costBeforeMargin,marginDollar,basePlusMargin,
      gstDollar,afterMarginGst,rebate,finalPrice,solarStcs,batteryStcs,solarRebateValue,batteryRebateValue};
  }

  function costFor(brand,panelCount,units){
    const isSig=brand==='Sigenergy';
    return costForWithConfig(brand,panelCount,units,8,isSig?A.sigInverterCost:A.deyeInverterCost,A.minInverters);
  }
  function costForLarge(brand,panelCount,units){
    const isSig=brand==='Sigenergy';
    return costForWithConfig(brand,panelCount,units,isSig?A.optSigInvKw:A.optDeyeInvKw,isSig?A.sigSingleInverterCost:A.deyeSingleInverterCost,A.optMinInverters);
  }
  function costForBest(brand,panelCount,units){
    const solarKw=panelCount*A.panelW/1000;
    const isSig=brand==='Sigenergy';
    const rawSmall=Math.ceil(solarKw/(8*(A.solarOversizePercent/100)));
    const rawLarge=Math.ceil(solarKw/((isSig?A.optSigInvKw:A.optDeyeInvKw)*(A.solarOversizePercent/100)));
    return rawLarge<rawSmall?costForLarge(brand,panelCount,units):costFor(brand,panelCount,units);
  }

  // ── 3-Phase cost engine ────────────────────────────────────────────────
  function costFor3phWithConfig(brand,panelCount,units,invKw,invUnitCost){
    const solarKw=panelCount*A.panelW/1000;
    const isSig=brand==='Sigenergy';
    const maxSolarPerInv=invKw*(A.solarOversizePercent/100);
    const invForSolar=Math.ceil(solarKw/maxSolarPerInv);
    const invForBatt=Math.ceil(units/A.maxBattPerInverter);
    const invCount=Math.max(1,Math.max(invForSolar,invForBatt));
    const panelSupplyCost=panelCount*A.panelCost;
    const panelInstallCost=panelCount*A.panelW*A.panelInstallPerW;
    const panelFrameCost=panelCount*A.panelFrame;
    const panelCost=panelSupplyCost+panelInstallCost+panelFrameCost;
    const fixed=A.smallParts+A.installerSignOff+A.ces+A.labourFixed;
    const batteryKwh=units*(isSig?A.sigBatteryKwh:A.deyeBatteryKwh);
    const batteryCost=units*(isSig?A.sigBatteryCost:A.deyeBatteryCost);
    const gatewayCount=isSig?Math.ceil(invCount/3):0;
    const inverterCost=invCount*invUnitCost+gatewayCount*A.sig3phGatewayCost;
    const costBeforeMargin=panelCost+fixed+batteryCost+inverterCost;
    const marginDollar=costBeforeMargin*A.margin;
    const basePlusMargin=costBeforeMargin+marginDollar;
    const gstDollar=basePlusMargin*A.gst;
    const afterMarginGst=basePlusMargin+gstDollar;
    const solarStcs=solarStcCount(solarKw);
    const batteryStcs=batteryStcCount(batteryKwh);
    const solarRebateValue=solarStcs*A.solarStcPrice;
    const batteryRebateValue=batteryStcs*A.batteryStcPrice;
    const rebate=solarRebateValue+batteryRebateValue;
    const finalPrice=Math.max(0,afterMarginGst-rebate);
    return {brand,panelCount,solarKw,units,batteryKwh,invCount,invKw,gatewayCount,
      panelSupplyCost,panelInstallCost,panelFrameCost,panelCost,fixed,
      batteryCost,inverterCost,costBeforeMargin,marginDollar,basePlusMargin,
      gstDollar,afterMarginGst,rebate,finalPrice,solarStcs,batteryStcs,
      solarRebateValue,batteryRebateValue,is3ph:true};
  }
  function costForSig3phBest(panelCount,units){
    const configs=[{kw:15,cost:A.sig3ph15kwCost},{kw:20,cost:A.sig3ph20kwCost},{kw:30,cost:A.sig3ph30kwCost}];
    let best=null;
    for(const cfg of configs){
      const r=costFor3phWithConfig('Sigenergy',panelCount,units,cfg.kw,cfg.cost);
      if(!best||r.invCount<best.invCount||(r.invCount===best.invCount&&r.finalPrice<best.finalPrice)) best=r;
    }
    return best;
  }
  function costForDeye3ph(panelCount,units){
    return costFor3phWithConfig('Deye',panelCount,units,12,A.deye3phInverterCost);
  }

  // ── Ground mount cost engine ───────────────────────────────────────────
  function costForGroundWithConfig(brand,roofPanels,gmPanels,units,invKw,invUnitCost,minInv){
    const totalPanels=roofPanels+gmPanels;
    const solarKw=totalPanels*A.panelW/1000;
    const isSig=brand==='Sigenergy';
    const maxSolarPerInv=invKw*(A.solarOversizePercent/100);
    const invForSolar=Math.max(minInv,Math.ceil(solarKw/maxSolarPerInv));
    const invForBatt=Math.ceil(units/A.maxBattPerInverter);
    const invCount=Math.max(invForSolar,invForBatt);
    const panelSupplyCost=totalPanels*A.panelCost;
    const panelInstallCost=totalPanels*A.panelW*A.panelInstallPerW;
    const roofFrameCost=roofPanels*A.panelFrame;
    const gmFrameCost=gmPanels*A.gmFramePerPanel;
    const panelCost=panelSupplyCost+panelInstallCost+roofFrameCost;
    const fixed=A.smallParts+A.installerSignOff+A.ces+A.labourFixed;
    const batteryKwh=units*(isSig?A.sigBatteryKwh:A.deyeBatteryKwh);
    const batteryCost=units*(isSig?A.sigBatteryCost:A.deyeBatteryCost);
    const gatewayCount=isSig?Math.ceil(invCount/3):0;
    const inverterCost=invCount*invUnitCost+gatewayCount*A.sigGatewayCost;
    const gmLabourCost=gmPanels*A.gmLabourPerPanel;
    const gmMachineryCost=gmPanels>0?A.gmMachineryFixed:0;
    const gmExtra=gmFrameCost+gmLabourCost+gmMachineryCost;
    const costBeforeMargin=panelCost+fixed+batteryCost+inverterCost+gmExtra;
    const marginDollar=costBeforeMargin*A.margin;
    const basePlusMargin=costBeforeMargin+marginDollar;
    const gstDollar=basePlusMargin*A.gst;
    const afterMarginGst=basePlusMargin+gstDollar;
    const solarStcs=solarStcCount(solarKw);
    const batteryStcs=batteryStcCount(batteryKwh);
    const solarRebateValue=solarStcs*A.solarStcPrice;
    const batteryRebateValue=batteryStcs*A.batteryStcPrice;
    const rebate=solarRebateValue+batteryRebateValue;
    const finalPrice=Math.max(0,afterMarginGst-rebate);
    return {brand,roofPanels,gmPanels,panelCount:totalPanels,solarKw,units,batteryKwh,
      invCount,invKw,gatewayCount,panelSupplyCost,panelInstallCost,roofFrameCost,gmFrameCost,
      panelCost,fixed,batteryCost,inverterCost,gmLabourCost,gmMachineryCost,gmExtra,
      costBeforeMargin,marginDollar,basePlusMargin,gstDollar,afterMarginGst,
      solarStcs,batteryStcs,solarRebateValue,batteryRebateValue,rebate,finalPrice,groundMount:true};
  }
  function costForGroundBest(brand,roofPanels,gmPanels,units){
    const solarKw=(roofPanels+gmPanels)*A.panelW/1000;
    const isSig=brand==='Sigenergy';
    const rawSmall=Math.ceil(solarKw/(8*(A.solarOversizePercent/100)));
    const largeKw=isSig?A.optSigInvKw:A.optDeyeInvKw;
    const rawLarge=Math.ceil(solarKw/(largeKw*(A.solarOversizePercent/100)));
    if(rawLarge<rawSmall)
      return costForGroundWithConfig(brand,roofPanels,gmPanels,units,largeKw,isSig?A.sigSingleInverterCost:A.deyeSingleInverterCost,A.optMinInverters);
    return costForGroundWithConfig(brand,roofPanels,gmPanels,units,8,isSig?A.sigInverterCost:A.deyeInverterCost,A.minInverters);
  }

  // ── Auto-sizing ────────────────────────────────────────────────────────
  function findMinUnits(brand,panelCount,dailyLoad,startUnits,maxUnits){
    const isSig=brand==='Sigenergy';
    const inc=isSig?A.sigBatteryKwh:A.deyeBatteryKwh;
    for(let u=startUnits;u<=maxUnits;u++){
      const sim=simulate(panelCount,u*inc,dailyLoad);
      if(sim.passes) return {...costForBest(brand,panelCount,u),...sim,dailyLoad};
    }
    const sim=simulate(panelCount,maxUnits*inc,dailyLoad);
    return {...costForBest(brand,panelCount,maxUnits),...sim,failed:true,dailyLoad};
  }
  function findMinUnitsGround(brand,roofPanels,gmPanels,dailyLoad,startUnits,maxUnits){
    const isSig=brand==='Sigenergy';
    const inc=isSig?A.sigBatteryKwh:A.deyeBatteryKwh;
    const totalPanels=roofPanels+gmPanels;
    for(let u=startUnits;u<=maxUnits;u++){
      const sim=simulate(totalPanels,u*inc,dailyLoad);
      if(sim.passes) return {...costForGroundBest(brand,roofPanels,gmPanels,u),...sim,dailyLoad};
    }
    const sim=simulate(totalPanels,maxUnits*inc,dailyLoad);
    return {...costForGroundBest(brand,roofPanels,gmPanels,maxUnits),...sim,failed:true,dailyLoad};
  }
  function findMinUnits3ph(brand,panelCount,dailyLoad,startUnits,maxUnits){
    const isSig=brand==='Sigenergy';
    const inc=isSig?A.sigBatteryKwh:A.deyeBatteryKwh;
    const costFn=isSig?costForSig3phBest:costForDeye3ph;
    for(let u=startUnits;u<=maxUnits;u++){
      const sim=simulate(panelCount,u*inc,dailyLoad);
      if(sim.passes) return {...costFn(panelCount,u),...sim,dailyLoad};
    }
    const sim=simulate(panelCount,maxUnits*inc,dailyLoad);
    return {...costFn(panelCount,maxUnits),...sim,failed:true,dailyLoad};
  }

  // ── UI helpers ─────────────────────────────────────────────────────────
  function kpiStrip(items){
    return items.map(([label,val])=>`<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${val}</div></div>`).join('');
  }

  function inverterDescription(r){
    return r.invCount+' × '+(r.invKw||8)+'kW '+r.brand+' inverter'+(r.invCount>1?'s':'');
  }

  function shortageBlock(r){
    if(!r.failed||!r.unmet) return '';
    const totalLoad=(r.dailyLoad||20)*31;
    const pct=Math.min(100,(r.unmet/totalLoad*100)).toFixed(1);
    return `<div class="alert alert-warn" style="margin:8px 18px 0;font-size:11px;line-height:1.6">
      <span class="alert-title">⚡ ${pct}% power shortage in July worst-case</span>
      This system is short <strong>${kwh(r.unmet)}</strong> over the July simulation period.
      The shortfall will need to be covered by a <strong>generator</strong>.
    </div>`;
  }

  function battCapWarning(r){
    const battPerInv=r.invCount>0?Math.ceil(r.units/r.invCount):r.units;
    if(battPerInv>A.maxBattPerInverter)
      return `<div class="alert alert-warn" style="margin:8px 18px 0;font-size:11px"><span class="alert-title">⚠ Battery distribution issue</span>${r.units} batteries across ${r.invCount} inverter${r.invCount>1?'s':''} — check layout (max ${A.maxBattPerInverter}/inverter).</div>`;
    return '';
  }

  function costTableRows(r){
    const rows=[];
    rows.push(`<div class="cost-row section-header"><span class="cost-label">Solar panels</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Supply (${r.panelCount} × ${money(A.panelCost)})</span><span class="cost-val">${money(r.panelSupplyCost||0)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Install (${r.panelCount} × ${money2(A.panelW*A.panelInstallPerW)})</span><span class="cost-val">${money(r.panelInstallCost||0)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Frame (${r.panelCount} × ${money(A.panelFrame)})</span><span class="cost-val">${money(r.panelFrameCost||0)}</span></div>`);
    rows.push(`<div class="cost-row bold-row"><span class="cost-label">Total panels</span><span class="cost-val">${money(r.panelCost)}</span></div>`);
    rows.push(`<div class="cost-row section-header"><span class="cost-label">Other costs</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Battery (${r.units} units)</span><span class="cost-val">${money(r.batteryCost)}</span></div>`);
    const invKwDisplay=r.invKw||8;
    const phTag=r.is3ph?' 3Φ':'';
    const invLineLabel=r.brand==='Sigenergy'
      ?`${r.invCount} × ${invKwDisplay}kW${phTag} inverter${r.invCount>1?'s':''} + ${r.gatewayCount} gateway${r.gatewayCount>1?'s':''} (1 per ≤3 inv.)`
      :`${r.invCount} × ${invKwDisplay}kW${phTag} Deye inverter${r.invCount>1?'s':''} with BMS`;
    rows.push(`<div class="cost-row"><span class="cost-label">${invLineLabel}</span><span class="cost-val">${money(r.inverterCost)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Small parts</span><span class="cost-val">${money(A.smallParts)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Installer sign off</span><span class="cost-val">${money(A.installerSignOff)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">CES</span><span class="cost-val">${money(A.ces)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Fixed labour</span><span class="cost-val">${money(A.labourFixed)}</span></div>`);
    rows.push(`<div class="cost-row section-header"><span class="cost-label">Pricing</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">Base cost</span><span class="cost-val">${money(r.costBeforeMargin)}</span></div>`);
    rows.push(`<div class="cost-row margin-row"><span class="cost-label">Margin (${(A.margin*100).toFixed(0)}%)</span><span class="cost-val">${money(r.marginDollar)}</span></div>`);
    rows.push(`<div class="cost-row bold-row"><span class="cost-label">Sales cost before GST</span><span class="cost-val">${money(r.basePlusMargin)}</span></div>`);
    rows.push(`<div class="cost-row"><span class="cost-label">GST (${(A.gst*100).toFixed(0)}%)</span><span class="cost-val">${money(r.gstDollar)}</span></div>`);
    rows.push(`<div class="cost-row bold-row"><span class="cost-label">Before rebates</span><span class="cost-val">${money(r.afterMarginGst)}</span></div>`);
    rows.push(`<div class="cost-row section-header"><span class="cost-label">Rebates</span></div>`);
    rows.push(`<div class="cost-row rebate"><span class="cost-label">Solar (${(r.solarStcs||0).toFixed(1)} STCs)</span><span class="cost-val">–${money(r.solarRebateValue||0)}</span></div>`);
    rows.push(`<div class="cost-row rebate"><span class="cost-label">Battery (${(r.batteryStcs||0).toFixed(1)} STCs)</span><span class="cost-val">–${money(r.batteryRebateValue||0)}</span></div>`);
    return rows.join('');
  }

  function resultCard(r){
    const cls=r.brand==='Sigenergy'?'sig':'deye';
    const maxBatt=r.invCount*A.maxBattPerInverter;
    const battRatio=`${r.units}/${maxBatt} batt`;
    const simRow=r.modeLabel?`<div class="cost-row"><span class="cost-label">Model</span><span class="cost-val">${r.modeLabel}</span></div>
      <div class="cost-row"><span class="cost-label">July result</span><span class="cost-val">${r.failed?'✗ Generator needed':'✓ Passes'}</span></div>`:'';
    return `<div class="result-card ${cls}">
      <div class="result-head">
        <div class="result-brand">${r.brand} ${r.invKw}kW${r.is3ph?' 3Φ':''} system${r.failed?' <span style="font-size:11px;color:var(--sc-accent)">· generator required</span>':''}</div>
        <div style="font-size:11px;color:var(--sc-muted);margin-bottom:8px">${r.panelCount} panels · ${kw(r.solarKw)} · ${kwh(r.batteryKwh)} · ${inverterDescription(r)} · ${battRatio}</div>
        <div class="result-price">${money(r.finalPrice)}</div>
      </div>
      ${shortageBlock(r)}${battCapWarning(r)}
      <div class="cost-table">
        ${costTableRows(r)}${simRow}
        <div class="cost-row total"><span class="cost-label">Final customer price</span><span class="cost-val" style="font-size:15px;color:var(--sc-accent)">${money(r.finalPrice)}</span></div>
      </div>
    </div>`;
  }

  function systemOptionText(r, optionLabel){
    const ikw=r.invKw||8;
    const phLabel=r.is3ph?' 3-phase':'';
    const inverterLine=r.brand==='Sigenergy'
      ?`${r.invCount} x ${ikw}kW${phLabel} Sigenergy inverter${r.invCount>1?'s':''} + ${r.gatewayCount} x Sigenergy Gateway${r.gatewayCount>1?'s':''}`
      :`${r.invCount} x ${ikw}kW${phLabel} Deye inverter${r.invCount>1?'s':''} with BMS`;
    const mountLine=r.groundMount&&r.gmPanels>0&&r.roofPanels>0
      ?`- Mounting: ${r.roofPanels} panels on roof (standard frame) + ${r.gmPanels} panels on ground mount frame`
      :r.groundMount&&r.gmPanels>0
      ?`- Mounting: ${r.gmPanels} panels on ground mount frame`
      :`- Mounting: ${r.panelCount} panels on roof (standard frame)`;
    const brandName=r.brand==='Sigenergy'?'Sigenergy Off Grid Solar System':'Deye Off Grid Solar System';
    return `${optionLabel} - ${brandName}
- Inverter${(r.invCount||1)>1?'s':''}: ${inverterLine}
- Battery: ${r.units} x ${r.brand} battery unit${r.units>1?'s':''}, ${kwh(r.batteryKwh)} usable storage
- Solar: ${r.panelCount} x ${A.panelW}W solar panels, ${kw(r.solarKw)} total array
${mountLine}
- Price: ${money(r.finalPrice)} fully installed after solar and battery rebates
- Includes: installation and certification`;
  }

  function combinedQuoteText(o1,o2){
    return `${systemOptionText(o1,'Option 1')}\n\n${systemOptionText(o2,'Option 2')}\n\nBoth options include installation and certification. Both systems come with a 10 year manufacturer warranty on inverter and battery.`;
  }

  function combinedQuoteCard(o1,o2,id){
    const txt=combinedQuoteText(o1,o2).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    return `<div class="quote-card">
      <div class="quote-head">
        <div class="quote-head-title">Combined quote block</div>
        <span style="font-family:monospace;font-size:13px;color:var(--sc-accent)">from ${money(Math.min(o1.finalPrice,o2.finalPrice))}</span>
      </div>
      <div class="quote-summary">
        <div class="quote-opt"><span class="sig-tag">Option 1 · Sigenergy</span> &nbsp;<strong>${kw(o1.solarKw)} solar · ${kwh(o1.batteryKwh)} battery · ${money(o1.finalPrice)}</strong></div>
        <div class="quote-opt"><span class="deye-tag">Option 2 · Deye</span> &nbsp;<strong>${kw(o2.solarKw)} solar · ${kwh(o2.batteryKwh)} battery · ${money(o2.finalPrice)}</strong></div>
      </div>
      <div class="quote-body">
        <textarea class="quote-textarea" id="${id}">${txt}</textarea>
        <div class="quote-actions">
          <button class="btn btn-secondary btn-sm" onclick="scCopyQuote('${id}')">⎘ Copy quote block</button>
        </div>
      </div>
    </div>`;
  }

  window.scCopyQuote = function(id){
    const el=document.getElementById(id); el.select(); document.execCommand('copy');
  };

  // ── Debounce helpers ───────────────────────────────────────────────────
  let _mainT, _optT, _3phT;
  window.scScheduleMain = function(){ clearTimeout(_mainT); _mainT=setTimeout(scRunMain,350); };
  window.scScheduleOpt  = function(){ clearTimeout(_optT);  _optT =setTimeout(scRunOptimiser,500); };
  window.scSchedule3ph  = function(){ clearTimeout(_3phT);  _3phT =setTimeout(scRunMain3ph,350); };

  // ── Mode change handlers ───────────────────────────────────────────────
  window.scMainModeChange = function(){
    const auto=document.getElementById('mainBattMode')&&document.getElementById('mainBattMode').value==='auto';
    const af=document.getElementById('mainAutoFields');
    const mf=document.getElementById('mainManualFields');
    if(af) af.style.display=auto?'':'none';
    if(mf) mf.style.display=auto?'none':'';
    scScheduleMain();
  };
  window.scMainGroundChange = function(){
    const gm=document.getElementById('mainGroundCheck')&&document.getElementById('mainGroundCheck').checked;
    const rf=document.getElementById('mainRoofOnlyFields');
    const gf=document.getElementById('mainGroundFields');
    if(rf) rf.style.display=gm?'none':'';
    if(gf) gf.style.display=gm?'':'none';
    scScheduleMain();
  };
  window.scThree3phModeChange = function(){
    const auto=document.getElementById('three3phBattMode')&&document.getElementById('three3phBattMode').value==='auto';
    const af=document.getElementById('three3phAutoFields');
    const mf=document.getElementById('three3phManualFields');
    if(af) af.style.display=auto?'':'none';
    if(mf) mf.style.display=auto?'none':'';
    scSchedule3ph();
  };
  window.scToggleOptAdvanced = function(btn){
    const el=document.getElementById('optAdvanced');
    if(!el) return;
    const open=el.style.display==='';
    el.style.display=open?'none':'';
    const icon=document.getElementById('optAdvIcon');
    if(icon) icon.textContent=open?'▸':'▾';
  };

  // ── Main Calculator ────────────────────────────────────────────────────
  function scRunMain(){
    const mainLoad=document.getElementById('mainLoad');
    if(!mainLoad) return;
    const daily=Number(mainLoad.value);
    const isGm=document.getElementById('mainGroundCheck')&&document.getElementById('mainGroundCheck').checked;
    const isAuto=document.getElementById('mainBattMode')&&document.getElementById('mainBattMode').value==='auto';
    const start=Math.max(1,Math.floor(Number(document.getElementById('mainStartUnits')&&document.getElementById('mainStartUnits').value)||1));
    const max=Math.max(start,Math.floor(Number(document.getElementById('mainMaxUnits')&&document.getElementById('mainMaxUnits').value)||40));
    const sigMU=Math.max(0,Math.floor(Number(document.getElementById('mainSigUnits')&&document.getElementById('mainSigUnits').value)||1));
    const deyeMU=Math.max(0,Math.floor(Number(document.getElementById('mainDeyeUnits')&&document.getElementById('mainDeyeUnits').value)||1));

    let sig,deye;
    if(isGm){
      const roofP=Math.max(0,Math.floor(Number(document.getElementById('mainRoofPanels')&&document.getElementById('mainRoofPanels').value)||0));
      const gmP=Math.max(0,Math.floor(Number(document.getElementById('mainGmPanels')&&document.getElementById('mainGmPanels').value)||0));
      const tot=document.getElementById('mainTotalPanels');
      if(tot) tot.value=roofP+gmP;
      if(isAuto){
        sig=findMinUnitsGround('Sigenergy',roofP,gmP,daily,start,max);
        deye=findMinUnitsGround('Deye',roofP,gmP,daily,start,max);
      } else {
        sig=costForGroundBest('Sigenergy',roofP,gmP,sigMU);
        deye=costForGroundBest('Deye',roofP,gmP,deyeMU);
      }
    } else {
      const panels=Math.max(1,Math.floor(Number(document.getElementById('mainPanels')&&document.getElementById('mainPanels').value)||1));
      if(isAuto){
        sig=findMinUnits('Sigenergy',panels,daily,start,max);
        deye=findMinUnits('Deye',panels,daily,start,max);
      } else {
        sig={...costForBest('Sigenergy',panels,sigMU),modeLabel:'Manual — no July test',dailyLoad:daily};
        deye={...costForBest('Deye',panels,deyeMU),modeLabel:'Manual — no July test',dailyLoad:daily};
      }
    }

    const kpisEl=document.getElementById('mainKpis');
    const resEl=document.getElementById('mainResults');
    const quotesEl=document.getElementById('mainQuotes');
    if(kpisEl) kpisEl.innerHTML=kpiStrip([['Solar',kw(sig.solarKw)],['Daily',kwh(daily)],['Sig',sig.failed?'No pass':money(sig.finalPrice)],['Deye',deye.failed?'No pass':money(deye.finalPrice)],['Sig inv',sig.invCount+'×'+sig.invKw+'kW'],['Deye inv',deye.invCount+'×'+deye.invKw+'kW']]);
    if(resEl) resEl.innerHTML=resultCard(sig)+resultCard(deye);
    if(quotesEl) quotesEl.innerHTML=combinedQuoteCard(sig,deye,'mainCombinedQuote');
  }

  // ── 3-Phase ────────────────────────────────────────────────────────────
  function scRunMain3ph(){
    const loadEl=document.getElementById('three3phLoad');
    if(!loadEl) return;
    const daily=Number(loadEl.value);
    const isAuto=document.getElementById('three3phBattMode')&&document.getElementById('three3phBattMode').value==='auto';
    const start=Math.max(1,Math.floor(Number(document.getElementById('three3phStartUnits')&&document.getElementById('three3phStartUnits').value)||1));
    const max=Math.max(start,Math.floor(Number(document.getElementById('three3phMaxUnits')&&document.getElementById('three3phMaxUnits').value)||40));
    const sigMU=Math.max(1,Math.floor(Number(document.getElementById('three3phSigUnits')&&document.getElementById('three3phSigUnits').value)||1));
    const deyeMU=Math.max(1,Math.floor(Number(document.getElementById('three3phDeyeUnits')&&document.getElementById('three3phDeyeUnits').value)||1));
    const panels=Math.max(1,Math.floor(Number(document.getElementById('three3phPanels')&&document.getElementById('three3phPanels').value)||1));

    let sig,deye;
    if(isAuto){
      sig=findMinUnits3ph('Sigenergy',panels,daily,start,max);
      deye=findMinUnits3ph('Deye',panels,daily,start,max);
    } else {
      sig={...costForSig3phBest(panels,sigMU),modeLabel:'Manual — no July test',dailyLoad:daily};
      deye={...costForDeye3ph(panels,deyeMU),modeLabel:'Manual — no July test',dailyLoad:daily};
    }

    const kpisEl=document.getElementById('three3phKpis');
    const resEl=document.getElementById('three3phResults');
    const quotesEl=document.getElementById('three3phQuotes');
    if(kpisEl) kpisEl.innerHTML=kpiStrip([['Solar',kw(sig.solarKw)],['Daily',kwh(daily)],['Sig',sig.failed?'No pass':money(sig.finalPrice)],['Deye',deye.failed?'No pass':money(deye.finalPrice)],['Sig inv',sig.invCount+'×'+sig.invKw+'kW 3Φ'],['Deye inv',deye.invCount+'×'+deye.invKw+'kW 3Φ']]);
    if(resEl) resEl.innerHTML=resultCard(sig)+resultCard(deye);
    if(quotesEl) quotesEl.innerHTML=combinedQuoteCard(sig,deye,'three3phCombinedQuote');
  }

  // ── Optimiser ──────────────────────────────────────────────────────────
  function scRunOptimiser(){
    const loadEl=document.getElementById('optLoad');
    if(!loadEl) return;
    const daily=Number(loadEl.value);
    const minP=Math.max(1,Math.floor(Number(document.getElementById('minPanels')&&document.getElementById('minPanels').value)||12));
    const maxP=Math.max(minP,Math.floor(Number(document.getElementById('maxPanels')&&document.getElementById('maxPanels').value)||120));
    const step=Math.max(1,Math.floor(Number(document.getElementById('panelStep')&&document.getElementById('panelStep').value)||1));
    const maxUnits=Math.max(1,Math.floor(Number(document.getElementById('optMaxUnits')&&document.getElementById('optMaxUnits').value)||40));
    const all=[];
    for(const brand of ['Sigenergy','Deye']){
      const inc=brand==='Sigenergy'?A.sigBatteryKwh:A.deyeBatteryKwh;
      for(let p=minP;p<=maxP;p+=step){
        for(let u=1;u<=maxUnits;u++){
          const sim=simulate(p,u*inc,daily);
          if(sim.passes){all.push({...costForBest(brand,p,u),...sim});break;}
        }
      }
    }
    all.sort((a,b)=>a.finalPrice-b.finalPrice);
    const bestSig=all.find(x=>x.brand==='Sigenergy');
    const bestDeye=all.find(x=>x.brand==='Deye');
    const kpisEl=document.getElementById('optKpis');
    const resEl=document.getElementById('optResults');
    const quotesEl=document.getElementById('optQuotes');
    if(kpisEl) kpisEl.innerHTML=kpiStrip([['Best overall',all[0]?all[0].brand:'—'],['Lowest price',all[0]?money(all[0].finalPrice):'—'],['Options tested',all.length],['Daily load',kwh(daily)],['Sig inv',A.optSigInvKw+'kW'],['Deye inv',A.optDeyeInvKw+'kW']]);
    if(resEl) resEl.innerHTML=(bestSig?resultCard(bestSig):'')+(bestDeye?resultCard(bestDeye):'');
    if(quotesEl) quotesEl.innerHTML=(bestSig&&bestDeye)?combinedQuoteCard(bestSig,bestDeye,'optCombinedQuote'):'';
  }

  // ── Quick Estimate ─────────────────────────────────────────────────────
  const QE_OCCUPANT_CONFIGS=[
    {count:1,icon:'🧍',label:'1 person'},{count:2,icon:'👥',label:'2 people'},
    {count:3,icon:'👨‍👩‍👦',label:'3 people'},{count:4,icon:'👨‍👩‍👧‍👦',label:'4 people'},
    {count:5,icon:'🏘️',label:'5 people'},{count:6,icon:'🏡',label:'6 people'},
    {count:7,icon:'🏰',label:'7 people'},{count:8,icon:'🏢',label:'8 people'},
    {count:9,icon:'🏗️',label:'9+ people'},
  ];
  const QE_BEDROOM_CONFIGS=[
    {bedrooms:0,icon:'🏠',label:'Studio'},{bedrooms:1,icon:'🛏️',label:'1 bed'},
    {bedrooms:2,icon:'🛏️',label:'2 bed'},{bedrooms:3,icon:'🛏️',label:'3 bed'},
    {bedrooms:4,icon:'🛏️',label:'4 bed'},{bedrooms:5,icon:'🛏️',label:'5 bed'},
    {bedrooms:6,icon:'🛏️',label:'6 bed'},{bedrooms:7,icon:'🛏️',label:'7 bed'},
    {bedrooms:8,icon:'🛏️',label:'8+ bed'},
  ];

  function qeLoad(occupants){ return 5+5*occupants; }

  function qeOptimiserSearch(dailyLoad){
    const panelMin=12,panelMax=120,maxUnits=40;
    let bestSig=null,bestDeye=null;
    for(const brand of ['Sigenergy','Deye']){
      const inc=brand==='Sigenergy'?A.sigBatteryKwh:A.deyeBatteryKwh;
      let bestForBrand=null;
      for(let p=panelMin;p<=panelMax;p++){
        for(let u=1;u<=maxUnits;u++){
          const sim=simulate(p,u*inc,dailyLoad);
          if(sim.passes){
            const c=costForBest(brand,p,u);
            if(!bestForBrand||c.finalPrice<bestForBrand.finalPrice) bestForBrand={...c,...sim};
            break;
          }
        }
      }
      if(brand==='Sigenergy') bestSig=bestForBrand; else bestDeye=bestForBrand;
    }
    return {bestSig,bestDeye};
  }

  function runQeForPersons(persons,bedrooms){
    const daily=qeLoad(persons);
    const summaryEl=document.getElementById('qeLoadSummary');
    if(summaryEl) summaryEl.style.display='flex';
    const loadValEl=document.getElementById('qeLoadVal');
    if(loadValEl) loadValEl.textContent=daily.toFixed(1)+' kWh/day';
    const bedLabel=bedrooms===0?'Studio':bedrooms+' '+(bedrooms===1?'bedroom':'bedrooms');
    const loadEqEl=document.getElementById('qeLoadEq');
    if(loadEqEl) loadEqEl.textContent=bedLabel+' · '+persons+' '+(persons===1?'person':'people');
    const lbEl=document.getElementById('qeLoadBreakdown');
    if(lbEl) lbEl.innerHTML='<strong>'+bedLabel+'</strong> → '+persons+' '+(persons===1?'person':'people')+'<br>5 kWh base load<br>+ '+persons+' × 5 kWh per person<br>= <strong>'+daily+' kWh/day</strong>';

    const resultEl=document.getElementById('qeResult');
    if(resultEl) resultEl.innerHTML='<div class="qe-no-result" style="color:var(--sc-muted)">⏳ Calculating…</div>';
    setTimeout(()=>{
      const {bestSig,bestDeye}=qeOptimiserSearch(daily);
      renderQeResult(bestSig,bestDeye,daily,persons,bedrooms);
    },30);
  }

  window.qeSelectOccupants = function(count,btnIdx){
    document.querySelectorAll('[id^="occ_btn_"]').forEach((b,i)=>b.classList.toggle('active',i===btnIdx));
    const bedIdx=Math.min(count-1,QE_BEDROOM_CONFIGS.length-1);
    document.querySelectorAll('[id^="bed_btn_"]').forEach((b,i)=>b.classList.toggle('active',i===bedIdx));
    runQeForPersons(count,count-1);
  };
  window.qeSelectBedrooms = function(bedrooms,btnIdx){
    document.querySelectorAll('[id^="bed_btn_"]').forEach((b,i)=>b.classList.toggle('active',i===btnIdx));
    const persons=bedrooms+1;
    const occIdx=Math.min(persons-1,QE_OCCUPANT_CONFIGS.length-1);
    document.querySelectorAll('[id^="occ_btn_"]').forEach((b,i)=>b.classList.toggle('active',i===occIdx));
    runQeForPersons(persons,bedrooms);
  };

  function renderQeResult(sig,deye,daily,occupants,bedrooms){
    const resultEl=document.getElementById('qeResult');
    const disclaimerEl=document.getElementById('qeDisclaimer');
    if(!resultEl) return;
    if(!sig&&!deye){
      resultEl.innerHTML='<div class="qe-no-result">No passing system found within search range.</div>';
      if(disclaimerEl) disclaimerEl.style.display='none';
      return;
    }
    const minPrice=deye?deye.finalPrice:sig.finalPrice;
    const maxPrice=sig?sig.finalPrice:deye.finalPrice;
    const rangePct=maxPrice>0?Math.round((minPrice/maxPrice)*100):50;
    const ref=sig||deye;
    const panelCountDisplay=(sig&&deye)?(sig.panelCount===deye.panelCount?sig.panelCount+' panels':deye.panelCount+'–'+sig.panelCount+' panels'):ref.panelCount+' panels';
    const solarKwDisplay=(sig&&deye)?(Math.abs(sig.solarKw-deye.solarKw)<0.15?kw(ref.solarKw):kw(Math.min(sig.solarKw,deye.solarKw))+'–'+kw(Math.max(sig.solarKw,deye.solarKw))):kw(ref.solarKw);
    const battKwhDisplay=(sig&&deye)?(Math.abs(sig.batteryKwh-deye.batteryKwh)<0.5?kwh(ref.batteryKwh):kwh(Math.min(sig.batteryKwh,deye.batteryKwh))+'–'+kwh(Math.max(sig.batteryKwh,deye.batteryKwh))):kwh(ref.batteryKwh);

    resultEl.innerHTML=`
      <div class="qe-result-panel">
        <div class="qe-result-head">
          <div class="qe-result-label">Recommended system · ${bedrooms===0?'Studio':bedrooms+' bed'} · ${occupants} ${occupants===1?'person':'people'}</div>
          <div class="qe-result-mode">July hourly survival model · ${daily} kWh/day</div>
        </div>
        <div class="qe-specs">
          <div class="qe-spec"><div class="qe-spec-label">Solar array</div><div class="qe-spec-val">${solarKwDisplay}</div><div class="qe-spec-unit">${panelCountDisplay} · ${A.panelW}W each</div></div>
          <div class="qe-spec"><div class="qe-spec-label">Battery storage</div><div class="qe-spec-val">${battKwhDisplay}</div><div class="qe-spec-unit">Usable capacity</div></div>
          <div class="qe-spec"><div class="qe-spec-label">Daily load</div><div class="qe-spec-val">${daily}</div><div class="qe-spec-unit">kWh/day estimated</div></div>
        </div>
        <div class="qe-price-bar">
          ${deye?`<div class="qe-price-cell deye-cell"><div class="qe-price-brand">Deye — budget option</div><div class="qe-price-amount">${money(deye.finalPrice)}</div><div class="qe-price-note">${deye.panelCount} panels · ${kw(deye.solarKw)} · ${kwh(deye.batteryKwh)} · ${deye.invCount}× ${deye.invKw}kW</div></div>`:''}
          ${sig?`<div class="qe-price-cell sig-cell"><div class="qe-price-brand">Sigenergy — premium option</div><div class="qe-price-amount">${money(sig.finalPrice)}</div><div class="qe-price-note">${sig.panelCount} panels · ${kw(sig.solarKw)} · ${kwh(sig.batteryKwh)} · ${sig.invCount}× ${sig.invKw}kW + ${sig.gatewayCount} gateway</div></div>`:''}
        </div>
        ${(sig&&deye)?`<div class="qe-range-bar"><div class="qe-range-label">Price range</div><div style="flex:1;min-width:120px"><div class="qe-range-track"><div class="qe-range-fill" style="width:${rangePct}%"></div></div><div class="qe-range-vals"><span class="qe-range-min">${money(minPrice)} Deye</span><span class="qe-range-max">${money(maxPrice)} Sigenergy</span></div></div></div>`:''}
      </div>`;
    if(disclaimerEl) disclaimerEl.style.display='block';
  }

  function buildQeOccupantPicker(){
    const picker=document.getElementById('occPicker');
    if(!picker) return;
    picker.innerHTML=QE_OCCUPANT_CONFIGS.map((cfg,i)=>
      `<button class="occ-btn" id="occ_btn_${i}" onclick="qeSelectOccupants(${cfg.count},${i})">
        <div class="occ-check">✓</div><div class="occ-icon">${cfg.icon}</div><div class="occ-label">${cfg.label}</div>
      </button>`
    ).join('');
  }
  function buildQeBedroomPicker(){
    const picker=document.getElementById('bedroomPicker');
    if(!picker) return;
    picker.innerHTML=QE_BEDROOM_CONFIGS.map((cfg,i)=>
      `<button class="occ-btn" id="bed_btn_${i}" onclick="qeSelectBedrooms(${cfg.bedrooms},${i})">
        <div class="occ-check">✓</div><div class="occ-icon">${cfg.icon}</div><div class="occ-label">${cfg.label}</div>
      </button>`
    ).join('');
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    buildQeOccupantPicker();
    buildQeBedroomPicker();
    scRunMain();
    scRunMain3ph();
    scRunOptimiser();
  });

})();
