// ===============================
// MOCKUP TIME ENGINE (24h in 24s)
// ===============================
// Speed so a full day (86400s) completes in 24s:
const SPEED = 3600; // 86400 / 24
const DAY_SECONDS = 86400;

const t0 = performance.now();

/**
 * Returns simulated seconds since midnight [0, 86400)
 * advancing at SPEED × real time.
 */
function simSecondsOfDay() {
  const elapsedRealSec = (performance.now() - t0) / 1000;
  const simSec = (elapsedRealSec * SPEED) % DAY_SECONDS;
  return simSec < 0 ? simSec + DAY_SECONDS : simSec;
}

/**
 * Returns simulated H/M/S (H 0–23, M 0–59, S 0–59.xxx)
 */
function simHMS() {
  const s = simSecondsOfDay();
  const hrs = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  const sec = s % 60; // fractional seconds
  return { hrs, min, sec };
}

/**
 * Returns day fraction [0,1) based on simulated time.
 */
function getSimDayFraction() {
  return simSecondsOfDay() / DAY_SECONDS;
}

// =========================================
// CLOCKS 1–3 (unchanged drawing; just time)
// =========================================

let makeClock1 = (opts) => (p) => {
  p.setup = () => {
    p.createCanvas(opts.w || 300, opts.h || 300).parent(opts.parent);
    p.angleMode(p.DEGREES);
  };
  p.draw = () => {
    let lengthx = p.width / 2;
    let lengthy = p.height / 2;

    // --- simulated time ---
    const { hrs, min, sec } = simHMS();

    // Build the same derived values you already use
    let secFloat = sec;                         // 0..59.999
    let minFloat = min + secFloat / 60;         // 0..59.999
    let oneMinute = secFloat / 60;              // 0..1
    let oneHour   = minFloat / 60;              // 0..1
    let oneDay    = (hrs * 3600 + min * 60 + secFloat) / 86400; // 0..1

    let minCap  = p.map(oneMinute, 0, 1,   0, 120);
    let hourCap = p.map(oneHour,   0, 1, 120, 240);
    let dayCap  = p.map(oneDay,    0, 1, 240, 360);

    p.stroke('#0c0c0cff');

    p.strokeWeight(18);
    p.fill('#FFFBED');
    p.circle(lengthx, lengthy, 370);

    p.strokeWeight(2);
    p.fill('#E4FFFF');
    p.arc(lengthx, lengthy, 304, 304, 240, 360, p.PIE);

    p.fill('#FF9B80');
    p.arc(lengthx, lengthy, 304, 304, 0, 120, p.PIE);

    p.fill('#C8FFC9');
    p.arc(lengthx, lengthy, 304, 304, 120, 240, p.PIE);

    p.strokeWeight(6);
    p.fill('lightblue');
    p.arc(lengthx, lengthy, 300, 300, 240, dayCap, p.PIE);

    p.fill('tomato');
    p.arc(lengthx, lengthy, 300, 300, 0, minCap, p.PIE);

    p.fill('lightgreen');
    p.arc(lengthx, lengthy, 300, 300, 120, hourCap, p.PIE);

    p.fill('#FFFBED');
    p.circle(lengthx, lengthy, 50);
  };
};

let makeClock2 = (opts) => (p) => {
  p.setup = () => {
    p.createCanvas(opts.w || 300, opts.h || 300).parent(opts.parent);
    p.angleMode(p.DEGREES);
  };
  p.draw = () => {
    let lengthx = p.width / 2;
    let lengthy = p.height / 2;

    // --- simulated time ---
    const { hrs, min, sec } = simHMS();

    let secFloat = sec;
    let minFloat = min + secFloat / 60;
    let oneMinute = secFloat / 60;
    let oneHour   = minFloat / 60;
    let oneDay    = (hrs * 3600 + min * 60 + secFloat) / 86400;

    let minCap  = p.map(oneMinute, 0, 1, 0, 360);
    let hourCap = p.map(oneHour,   0, 1, 0, 360);
    let dayCap  = p.map(oneDay,    0, 1, 0, 360);

    p.stroke('#0c0c0cff');
    p.strokeWeight(18);
    p.fill('#FFFBED');
    p.circle(lengthx, lengthy, 370);

    p.strokeWeight(2);
    p.fill('#E4FFFF');
    p.arc(lengthx, lengthy, 304, 304, 0, 360, p.PIE);

    p.strokeWeight(6);
    p.fill('lightblue');
    p.arc(lengthx, lengthy, 300, 300, 0, dayCap, p.PIE);

    p.strokeWeight(2);
    p.fill('#C8FFC9');
    p.arc(lengthx, lengthy, 184, 184, 0, 360, p.PIE);

    p.strokeWeight(6);
    p.fill('lightgreen');
    p.arc(lengthx, lengthy, 180, 180, 0, hourCap, p.PIE);

    p.strokeWeight(2);
    p.fill('#FF9B80');
    p.arc(lengthx, lengthy, 104, 104, 0, 360, p.PIE);

    p.strokeWeight(6);
    p.fill('tomato');
    p.arc(lengthx, lengthy, 100, 100, 0, minCap, p.PIE);

    p.fill('#FFFBED');
    p.circle(lengthx, lengthy, 50);
  };
};

let makeClock3 = (opts) => (p) => {
  p.setup = () => {
    p.createCanvas(opts.w || 300, opts.h || 300, p.WEBGL).parent(opts.parent);
    p.angleMode(p.DEGREES);
  };
  p.draw = () => {
    // --- simulated time (minute cycle) ---
    const { sec } = simHMS();
    let oneMinute = sec / 60;

    let minCap  = p.map(oneMinute, 0, 1, 0, 14);
    let minCap2 = p.map(oneMinute, 0, 1, 0, 360);

    p.strokeWeight(minCap);
    p.stroke('#fcff5cff');
    p.fill('#0c0c0cff');

    let axis = p.createVector(1, 1, 0);
    p.rotate(minCap2, axis);
    p.sphere(150, 24, 24);
  };
};

// Instantiate
let clockSketch1 = new p5(makeClock1({ parent: 'clock1', w: 500, h: 500 }));
let clockSketch2 = new p5(makeClock2({ parent: 'clock2', w: 500, h: 500 }));
let clockSketch3 = new p5(makeClock3({ parent: 'clock3', w: 500, h: 500 }));

// =====================================
// BACKGROUND CLOCK (uses simulated time)
// =====================================

let COLOR_NIGHT = [0x00, 0x05, 0x45]; // #000545
let COLOR_DAY   = [0xD6, 0xF3, 0xFF]; // #D6F3FF

function lerp(a, b, t) { return a + (b - a) * t; }
function toHex(n) { return n.toString(16).padStart(2, '0'); }
function rgbToHex(r, g, b) { return `#${toHex(r)}${toHex(g)}${toHex(b)}`; }

// Smooth noon-midnight weighting
function dayWeight(t) {
  return 0.5 * (1 - Math.cos(2 * Math.PI * t));
}

function computeSkyColor() {
  let w = dayWeight(getSimDayFraction()); // << use simulated day fraction
  let r = Math.round(lerp(COLOR_NIGHT[0], COLOR_DAY[0], w));
  let g = Math.round(lerp(COLOR_NIGHT[1], COLOR_DAY[1], w));
  let b = Math.round(lerp(COLOR_NIGHT[2], COLOR_DAY[2], w));
  return rgbToHex(r, g, b);
}

function applySkyColor() {
  let color = computeSkyColor();
  document.body.style.backgroundColor = color;

  document.querySelectorAll('em.background').forEach(el => {
    el.style.color = color;
    el.style.fontStyle = 'normal';
  });

  requestAnimationFrame(applySkyColor);
}

document.addEventListener('DOMContentLoaded', applySkyColor);
