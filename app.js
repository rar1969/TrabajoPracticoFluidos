/* ═══════════════════════════════════════════════════════
   TRABAJO PRÁCTICO INTERACTIVO — MECÁNICA DE FLUIDOS
   Application Logic
   ═══════════════════════════════════════════════════════ */

const G = 9.8; // aceleración de gravedad [m/s²]
const P_ATM = 101325; // presión atmosférica [Pa]

// ─── TAB NAVIGATION ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('visible'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('visible');
  });
});

// ─── RANGE SLIDER LIVE VALUES ───
document.querySelectorAll('input[type="range"]').forEach(slider => {
  const valSpan = document.getElementById(slider.id + '-val');
  if (valSpan) {
    slider.addEventListener('input', () => { valSpan.textContent = slider.value; });
  }
});

// ─── UTILITY: format number ───
function fmt(n, decimals = 2) {
  if (Math.abs(n) >= 1e6) return n.toExponential(decimals);
  return parseFloat(n.toFixed(decimals)).toLocaleString('es-AR');
}

function buildSteps(container, lines) {
  container.innerHTML = '';
  lines.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.style.animationDelay = `${i * 0.08}s`;
    div.innerHTML = line;
    container.appendChild(div);
  });
}

// ═══════════════════════════════════════════════
// EJEMPLO 1 — Presión a profundidad
// ═══════════════════════════════════════════════
document.getElementById('btn-ex1').addEventListener('click', () => {
  const h = parseFloat(document.getElementById('ex1-h').value);
  const rho = parseFloat(document.getElementById('ex1-fluid').value);
  const Pman = rho * G * h;
  const Pabs = P_ATM + Pman;
  buildSteps(document.getElementById('steps-ex1'), [
    `<strong>Datos:</strong> <em>δ</em> = ${rho} kg/m³ &nbsp;|&nbsp; h = ${h} m &nbsp;|&nbsp; g = ${G} m/s² &nbsp;|&nbsp; P₀ = ${fmt(P_ATM,0)} Pa`,
    `<strong>Paso 1 — Presión manométrica o hidrostática:</strong><br>P<sub>man</sub> = <em>δ</em>·g·h = ${rho} × ${G} × ${h} = <strong>${fmt(Pman)} Pa</strong> (${fmt(Pman/1000)} kPa)`,
    `<strong>Paso 2 — Presión absoluta:</strong><br>P<sub>abs</sub> = P₀ + P<sub>man</sub> = ${fmt(P_ATM,0)} + ${fmt(Pman)} = <strong>${fmt(Pabs)} Pa</strong>`,
    `<div class="result-line">✓ P<sub>man</sub> ≈ ${fmt(Pman/1000)} kPa &nbsp;&nbsp;|&nbsp;&nbsp; P<sub>abs</sub> ≈ ${fmt(Pabs/1000)} kPa (${fmt(Pabs/P_ATM)} atm)</div>`
  ]);
});

// ═══════════════════════════════════════════════
// EJEMPLO 2 — Prensa Hidráulica (Pascal)
// ═══════════════════════════════════════════════
document.getElementById('btn-ex2').addEventListener('click', () => {
  const F1 = parseFloat(document.getElementById('ex2-F').value);
  const d1 = parseFloat(document.getElementById('ex2-d1').value);
  const d2 = parseFloat(document.getElementById('ex2-d2').value);
  const ratio = (d2 / d1) ** 2;
  const F2 = F1 * ratio;
  buildSteps(document.getElementById('steps-ex2'), [
    `<strong>Datos:</strong> F₁ = ${F1} N &nbsp;|&nbsp; d₁ = ${d1} cm &nbsp;|&nbsp; d₂ = ${d2} cm`,
    `<strong>Paso 1 — Relación de áreas:</strong><br>A₂/A₁ = (d₂/d₁)² = (${d2}/${d1})² = ${fmt(ratio)}`,
    `<strong>Paso 2 — Fuerza de salida:</strong><br>F₂ = F₁ · (A₂/A₁) = ${F1} × ${fmt(ratio)} = <strong>${fmt(F2)} N</strong>`,
    `<div class="result-line">✓ F₂ = ${fmt(F2)} N &nbsp;&nbsp;|&nbsp;&nbsp; Ventaja mecánica = ${fmt(ratio)}</div>`
  ]);
});

// ═══════════════════════════════════════════════
// EJEMPLO 3 — Arquímedes (Bloque flotante)
// ═══════════════════════════════════════════════
document.getElementById('btn-ex3').addEventListener('click', () => {
  const rhoBlock = parseFloat(document.getElementById('ex3-rho').value);
  const V = parseFloat(document.getElementById('ex3-vol').value);
  const rhoWater = 998;
  const m = rhoBlock * V;
  const W = m * G;

  let lines = [
    `<strong>Datos:</strong> <em>δ</em><sub>bloque</sub> = ${rhoBlock} kg/m³ &nbsp;|&nbsp; V = ${V} m³ &nbsp;|&nbsp; <em>δ</em><sub>agua</sub> = ${rhoWater} kg/m³`,
    `<strong>Paso 1 — Masa y Peso:</strong><br>m = <em>δ</em>·V = ${rhoBlock} × ${V} = ${fmt(m)} kg<br>P = m·g = ${fmt(m)} × ${G} = <strong>${fmt(W)} N</strong>`,
  ];

  if (rhoBlock <= rhoWater) {
    const frac = rhoBlock / rhoWater;
    const Vsum = V * frac;
    const E = W; // en equilibrio E=W
    lines.push(
      `<strong>Paso 2 — Condición:</strong> <em>δ</em><sub>bloque</sub> < <em>δ</em><sub>agua</sub> → <strong>FLOTA</strong>`,
      `<strong>Paso 3 — Fracción sumergida:</strong><br>V<sub>sum</sub>/V<sub>total</sub> = <em>δ</em><sub>bloque</sub>/<em>δ</em><sub>agua</sub> = ${rhoBlock}/${rhoWater} = <strong>${fmt(frac, 4)}</strong> (${fmt(frac*100)}%)`,
      `<strong>Paso 4 — Volumen sumergido:</strong><br>V<sub>sum</sub> = ${V} × ${fmt(frac,4)} = <strong>${fmt(Vsum,4)} m³</strong>`,
      `<div class="result-line">✓ E = ${fmt(E)} N &nbsp;|&nbsp; V<sub>sum</sub> = ${fmt(Vsum,4)} m³ (${fmt(frac*100)}% sumergido)</div>`
    );
  } else {
    const E = rhoWater * V * G;
    const Wap = W - E;
    lines.push(
      `<strong>Paso 2 — Condición:</strong> <em>δ</em><sub>bloque</sub> > <em>δ</em><sub>agua</sub> → <strong>SE HUNDE</strong>`,
      `<strong>Paso 3 — Empuje (totalmente sumergido):</strong><br>E = <em>δ</em><sub>agua</sub>·V·g = ${rhoWater} × ${V} × ${G} = <strong>${fmt(E)} N</strong>`,
      `<strong>Paso 4 — Peso aparente:</strong><br>P<sub>ap</sub> = P − E = ${fmt(W)} − ${fmt(E)} = <strong>${fmt(Wap)} N</strong>`,
      `<div class="result-line">✓ Se hunde &nbsp;|&nbsp; E = ${fmt(E)} N &nbsp;|&nbsp; Peso aparente = ${fmt(Wap)} N</div>`
    );
  }

  buildSteps(document.getElementById('steps-ex3'), lines);

  // Animate SVG block position
  const blockEl = document.getElementById('arq-block');
  if (blockEl) {
    const fraction = Math.min(rhoBlock / rhoWater, 1);
    // water surface is at y=120, block height=80
    // When fully floating on surface: block top at y=120-80=40, but fraction of 80px is submerged
    // fraction=0 → block on top (y=40), fraction=1 → fully submerged (y=120)
    const blockY = 40 + fraction * 80;
    blockEl.setAttribute('y', Math.min(blockY, 200));
  }
});

// ═══════════════════════════════════════════════
// EJEMPLO 4 — Continuidad
// ═══════════════════════════════════════════════
document.getElementById('btn-ex4').addEventListener('click', () => {
  const d1 = parseFloat(document.getElementById('ex4-d1').value);
  const v1 = parseFloat(document.getElementById('ex4-v1').value);
  const d2 = parseFloat(document.getElementById('ex4-d2').value);

  const ratio = (d1 / d2) ** 2;
  const v2 = v1 * ratio;
  const A1 = Math.PI * (d1 / 200) ** 2; // m²
  const Q = A1 * v1; // m³/s
  const Q_Ls = Q * 1000; // L/s

  buildSteps(document.getElementById('steps-ex4'), [
    `<strong>Datos:</strong> d₁ = ${d1} cm &nbsp;|&nbsp; v₁ = ${v1} m/s &nbsp;|&nbsp; d₂ = ${d2} cm`,
    `<strong>Paso 1 — Relación de áreas:</strong><br>A₁/A₂ = (d₁/d₂)² = (${d1}/${d2})² = ${fmt(ratio)}`,
    `<strong>Paso 2 — Velocidad v₂:</strong><br>v₂ = v₁ · (A₁/A₂) = ${v1} × ${fmt(ratio)} = <strong>${fmt(v2)} m/s</strong>`,
    `<strong>Paso 3 — Caudal Q:</strong><br>A₁ = π·(${fmt(d1/200,4)})² = ${fmt(A1,6)} m²<br>Q = A₁·v₁ = ${fmt(A1,6)} × ${v1} = <strong>${fmt(Q,5)} m³/s</strong> = ${fmt(Q_Ls)} L/s = ${fmt(Q_Ls*60)} L/min`,
    `<div class="result-line">✓ v₂ = ${fmt(v2)} m/s &nbsp;&nbsp;|&nbsp;&nbsp; Q = ${fmt(Q_Ls)} L/s</div>`
  ]);
});

// ═══════════════════════════════════════════════
// EJEMPLO 5 — Bernoulli / Torricelli
// ═══════════════════════════════════════════════
document.getElementById('btn-ex5').addEventListener('click', () => {
  const h = parseFloat(document.getElementById('ex5-h').value);
  const d = parseFloat(document.getElementById('ex5-d').value); // cm
  const v = Math.sqrt(2 * G * h);
  const A = Math.PI * (d / 200) ** 2;
  const Q = A * v;
  const Q_Ls = Q * 1000;

  buildSteps(document.getElementById('steps-ex5'), [
    `<strong>Datos:</strong> h = ${h} m &nbsp;|&nbsp; d<sub>salida</sub> = ${d} cm &nbsp;|&nbsp; g = ${G} m/s²`,
    `<strong>Paso 1 — Simplificación de Bernoulli (Torricelli):</strong><br>P₁ = P₂ = P<sub>atm</sub> (tanque abierto y salida al aire) &nbsp;|&nbsp; v₁ ≈ 0 (tanque grande)<br><em>δ</em>·g·h = ½·<em>δ</em>·v₂² → <strong>v = √(2·g·h)</strong>`,
    `<strong>Paso 2 — Velocidad de salida:</strong><br>v = √(2 × ${G} × ${h}) = √(${fmt(2*G*h)}) = <strong>${fmt(v)} m/s</strong>`,
    `<strong>Paso 3 — Caudal de descarga:</strong><br>A = π·(${fmt(d/200,4)})² = ${fmt(A,6)} m²<br>Q = A·v = ${fmt(A,6)} × ${fmt(v)} = <strong>${fmt(Q,5)} m³/s</strong> = ${fmt(Q_Ls)} L/s = ${fmt(Q_Ls*60)} L/min`,
    `<div class="result-line">✓ v = ${fmt(v)} m/s &nbsp;&nbsp;|&nbsp;&nbsp; Q = ${fmt(Q_Ls)} L/s (${fmt(Q_Ls*60)} L/min)</div>`
  ]);
});

// ═══════════════════════════════════════════════
// VERIFICACIÓN DE EJERCICIOS PROPUESTOS
// ═══════════════════════════════════════════════

// Correct answers with tolerance
const ANSWERS = {
  '1-1': { vals: () => [P_ATM + 998*G*3.5], ids: ['ans-1-1'], hint: 'P_abs = P_atm + δ·g·h = 101325 + 998×9.8×3.5' },
  '1-2': { vals: () => [1025*G*120*Math.PI*(0.15)**2], ids: ['ans-1-2'], hint: 'F = P_man · A = (δ·g·h) · (π·r²)' },
  '1-3': { vals: () => [44100/(750*G)], ids: ['ans-1-3'], hint: 'h = P_man / (δ·g)' },
  '2-1': {
    vals: () => [120*(320/8), 320/8],
    ids: ['ans-2-1a', 'ans-2-1b'],
    hint: 'F₂ = F₁·(A₂/A₁), VM = A₂/A₁'
  },
  '2-2': {
    vals: () => {
      const ratioNeeded = 250/44100;
      return [30 * Math.sqrt(ratioNeeded)];
    },
    ids: ['ans-2-2'],
    hint: 'd₁ = d₂ · √(F₁/F₂)'
  },
  '2-3': { vals: () => [90*(18/4.5)], ids: ['ans-2-3'], hint: 'F₂ = F₁·(A₂/A₁)' },
  '3-1': {
    vals: () => [20/1000, 1000*0.5 - 20*0.5],
    ids: ['ans-3-1a', 'ans-3-1b'],
    hint: 'Fracción = δ_cuerpo/δ_fluido. Carga_max = δ_agua·V − m_boya'
  },
  '3-2': {
    vals: () => [2600*0.04*G, 998*0.04*G, 2600*0.04*G - 998*0.04*G],
    ids: ['ans-3-2a', 'ans-3-2b', 'ans-3-2c'],
    hint: 'P = δ·V·g, E = δ_agua·V·g, P_ap = P − E'
  },
  '3-3': {
    vals: () => {
      const E = 1.2;
      const V = E / (1000 * G);
      const m = 5.0 / G;
      const rho = m / V;
      return [E, V, rho];
    },
    ids: ['ans-3-3a', 'ans-3-3b', 'ans-3-3c'],
    hint: 'E = P_aire − P_agua. V = E/(δ·g). δ = m/V'
  },
  '4-1': {
    vals: () => {
      const v2 = 1.2 * (2/0.5)**2;
      const A1 = Math.PI * (0.01)**2;
      const Q = A1 * 1.2;
      return [v2, Q * 1000 * 60];
    },
    ids: ['ans-4-1a', 'ans-4-1b'],
    hint: 'v₂ = v₁·(d₁/d₂)². Q = A₁·v₁, convertir a L/min'
  },
  '4-2': {
    vals: () => {
      const Q = 20 / (1.5 * 60) / 1000; // m³/s
      const A = Math.PI * (0.0075)**2;
      return [Q / A];
    },
    ids: ['ans-4-2'],
    hint: 'Q = V/t. v = Q/A'
  },
  '4-3': { vals: () => [2.5], ids: ['ans-4-3'], hint: 'A_main·v = 4·A_rama·v_rama, con A_rama = A_main/4' },
  '5-1': {
    vals: () => {
      const v2 = 2 * (60/15);
      const P2 = 180000 + 0.5*998*(4 - v2*v2);
      return [v2, P2];
    },
    ids: ['ans-5-1a', 'ans-5-1b'],
    hint: 'Continuidad: v₂ = v₁·(A₁/A₂). Bernoulli: P₂ = P₁ + ½δ(v₁²−v₂²)'
  },
  '5-2': {
    vals: () => {
      const v = Math.sqrt(2*G*2);
      const A = Math.PI*(0.025)**2;
      const Q_Ls = A * v * 1000;
      const t_min = 20000 / Q_Ls / 60;
      return [v, Q_Ls, t_min];
    },
    ids: ['ans-5-2a', 'ans-5-2b', 'ans-5-2c'],
    hint: 'v = √(2gh). Q = A·v. t = Volumen/Q'
  },
  '5-3': {
    vals: () => {
      // P1_man + 0.5*rho*v1² = 0 + 0.5*rho*v2²
      // 50000 + 500*1.44 = 500*v2²
      const v2sq = (50000 + 500*1.44) / 500;
      const v2 = Math.sqrt(v2sq);
      const A2 = 200 * 1.2 / v2; // cm²
      return [A2];
    },
    ids: ['ans-5-3'],
    hint: 'Bernoulli: P₁+½δv₁² = P₂+½δv₂². Luego A₂ = A₁·v₁/v₂'
  }
};

const TOLERANCE = 0.03; // 3% tolerance for rounding differences

function checkClose(userVal, correctVal) {
  if (correctVal === 0) return Math.abs(userVal) < 0.01;
  return Math.abs((userVal - correctVal) / correctVal) <= TOLERANCE;
}

document.querySelectorAll('.btn-check').forEach(btn => {
  btn.addEventListener('click', () => {
    const exId = btn.dataset.exercise;
    const answer = ANSWERS[exId];
    if (!answer) return;

    const correctVals = answer.vals();
    const fbEl = document.getElementById('fb-' + exId);
    let allCorrect = true;
    let anyEmpty = false;

    answer.ids.forEach((id, i) => {
      const input = document.getElementById(id);
      const userVal = parseFloat(input.value);
      if (isNaN(userVal) || input.value.trim() === '') {
        anyEmpty = true;
        input.classList.remove('correct', 'wrong');
        return;
      }
      if (checkClose(userVal, correctVals[i])) {
        input.classList.add('correct');
        input.classList.remove('wrong');
      } else {
        input.classList.add('wrong');
        input.classList.remove('correct');
        allCorrect = false;
      }
    });

    if (anyEmpty) {
      fbEl.className = 'feedback wrong';
      fbEl.innerHTML = '⚠️ Completá todos los campos antes de verificar.';
    } else if (allCorrect) {
      fbEl.className = 'feedback correct';
      fbEl.innerHTML = '✅ ¡Correcto! Excelente trabajo.';
    } else {
      fbEl.className = 'feedback wrong';
      fbEl.innerHTML = `❌ Revisá tu cálculo. <em>Pista: ${answer.hint}</em>`;
    }
  });
});

// ─── Auto-calculate first examples on load ───
document.getElementById('btn-ex1').click();
