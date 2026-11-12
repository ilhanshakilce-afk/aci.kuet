/* ==========================================================================
   acikuet.org - ACI 211.1 Concrete Mix Design Engine
   Implements American Concrete Institute absolute volume method
   ========================================================================== */

function calculateConcreteMix() {
  const fc = parseFloat(document.getElementById('calc-strength').value) || 25; // Target strength in MPa
  const slump = document.getElementById('calc-slump').value || '75-100';
  const aggSize = parseInt(document.getElementById('calc-agg-size').value, 10) || 20; // in mm
  const airEntrained = document.getElementById('calc-air').value === 'air';

  // 1. Water content (kg/m3 or liters/m3) based on ACI 211.1 Table 6.3.3
  let water = 205; // default for 20mm, 75-100mm slump, non-air entrained
  if (aggSize === 10) {
    if (slump === '25-50') water = airEntrained ? 180 : 205;
    else if (slump === '75-100') water = airEntrained ? 200 : 225;
    else water = airEntrained ? 215 : 240;
  } else if (aggSize === 20) {
    if (slump === '25-50') water = airEntrained ? 165 : 190;
    else if (slump === '75-100') water = airEntrained ? 180 : 205;
    else water = airEntrained ? 190 : 215;
  } else if (aggSize === 25) {
    if (slump === '25-50') water = airEntrained ? 160 : 180;
    else if (slump === '75-100') water = airEntrained ? 175 : 195;
    else water = airEntrained ? 185 : 210;
  } else if (aggSize === 40) {
    if (slump === '25-50') water = airEntrained ? 145 : 165;
    else if (slump === '75-100') water = airEntrained ? 160 : 175;
    else water = airEntrained ? 170 : 190;
  }

  // 2. Water-cement ratio (w/c) estimation based on 28-day cylinder compressive strength (ACI Table 6.3.4a)
  // Approximate standard curve: w/c vs fc'
  let wc = 0.50;
  if (airEntrained) {
    if (fc <= 20) wc = 0.59;
    else if (fc <= 25) wc = 0.52;
    else if (fc <= 30) wc = 0.45;
    else if (fc <= 35) wc = 0.40;
    else wc = 0.35;
  } else {
    if (fc <= 20) wc = 0.69;
    else if (fc <= 25) wc = 0.62;
    else if (fc <= 30) wc = 0.54;
    else if (fc <= 35) wc = 0.47;
    else if (fc <= 40) wc = 0.42;
    else wc = 0.38;
  }

  // 3. Cement requirement
  const cement = Math.round(water / wc);

  // 4. Coarse Aggregate content (ACI Table 6.3.6: volume of coarse agg per unit vol of concrete for FM=2.60)
  let volCoarse = 0.62;
  if (aggSize === 10) volCoarse = 0.46;
  else if (aggSize === 20) volCoarse = 0.62;
  else if (aggSize === 25) volCoarse = 0.67;
  else if (aggSize === 40) volCoarse = 0.71;

  const dryRoddedBulkDensity = 1600; // kg/m3 typical for stone chips
  const coarseAgg = Math.round(volCoarse * dryRoddedBulkDensity);

  // 5. Absolute Volume Method for Fine Aggregate (Sand)
  const spGravCement = 3.15;
  const spGravCoarse = 2.65;
  const spGravFine = 2.60;
  const entrappedAir = airEntrained ? 0.05 : 0.02; // 5% or 2% air

  const volWater = water / 1000.0;
  const volCement = cement / (spGravCement * 1000.0);
  const volCoarseAgg = coarseAgg / (spGravCoarse * 1000.0);

  const volFineAgg = 1.0 - (volWater + volCement + volCoarseAgg + entrappedAir);
  const fineAgg = Math.max(400, Math.round(volFineAgg * spGravFine * 1000.0));

  const totalBatch = water + cement + coarseAgg + fineAgg;

  // Update UI Elements
  document.getElementById('res-wc').textContent = wc.toFixed(2);
  document.getElementById('res-water').textContent = `${water} L/m³`;
  document.getElementById('res-cement').textContent = `${cement} kg/m³`;
  document.getElementById('res-sand').textContent = `${fineAgg} kg/m³`;
  document.getElementById('res-gravel').textContent = `${coarseAgg} kg/m³`;
  document.getElementById('res-ratio').textContent = `1 : ${(fineAgg / cement).toFixed(2)} : ${(coarseAgg / cement).toFixed(2)}`;
  
  const psiStrength = Math.round(fc * 145.038);
  document.getElementById('res-psi').textContent = `${psiStrength} psi (${fc} MPa)`;

  // Update visual proportion bar
  const pctWater = ((water / totalBatch) * 100).toFixed(1);
  const pctCement = ((cement / totalBatch) * 100).toFixed(1);
  const pctSand = ((fineAgg / totalBatch) * 100).toFixed(1);
  const pctGravel = ((coarseAgg / totalBatch) * 100).toFixed(1);

  const barWater = document.getElementById('bar-water');
  const barCement = document.getElementById('bar-cement');
  const barSand = document.getElementById('bar-sand');
  const barGravel = document.getElementById('bar-gravel');

  if (barWater) barWater.style.width = `${pctWater}%`;
  if (barCement) barCement.style.width = `${pctCement}%`;
  if (barSand) barSand.style.width = `${pctSand}%`;
  if (barGravel) barGravel.style.width = `${pctGravel}%`;
}

// Auto recalculate on any input change
document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['calc-strength', 'calc-slump', 'calc-agg-size', 'calc-air'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calculateConcreteMix);
      el.addEventListener('input', calculateConcreteMix);
    }
  });

  calculateConcreteMix();
});
