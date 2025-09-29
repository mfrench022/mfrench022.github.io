function setupCanvasToParent(p, parentId, useWebGL = false) {
  const parent = document.getElementById(parentId);
  if (!parent) {
    console.warn(`[setupCanvasToParent] Missing parent element: #${parentId}`);
    return;
  }

  const renderer = useWebGL ? p.WEBGL : undefined;

  // Create initial canvas sized to parent’s box.
  function sizeFromParent() {
    const rect = parent.getBoundingClientRect();
    // Guard against 0x0 boxes on first layout pass.
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    return { w, h };
  }

  const { w, h } = sizeFromParent();

  // Keep pixel density reasonable for performance on high-DPI screens.
  p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  p.createCanvas(w, h, renderer).parent(parentId);

  // Resize handler keeps canvas in sync with CSS changes / viewport changes.
  function resizeToParent() {
    const { w: nw, h: nh } = sizeFromParent();
    if (nw !== p.width || nh !== p.height) {
      p.resizeCanvas(nw, nh);
    }
  }

  // Respond to window resizes.
  window.addEventListener('resize', resizeToParent);

  // Respond to parent box changes not caused by window events.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => resizeToParent());
    ro.observe(parent);
    // Store to detach if p5 instance is removed (optional)
    p._clockpitRO = ro;
  }
}

/* ==============================
   Clock 1: Single circle with 3 arcs
   ============================== */
let makeClock1 = (opts) => (p) => {
  p.setup = () => {
    setupCanvasToParent(p, opts.parent, false);
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    const cx = p.width / 2, cy = p.height / 2;
    const d = Math.min(p.width, p.height);

    // Proportional sizes (relative to d)
    const outer    = d * 0.74; // ~370 @ 500
    const ringBig  = d * 0.61; // ~304 @ 500
    const ringMain = d * 0.60; // ~300 @ 500
    const center   = d * 0.10; // ~50  @ 500

    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hrs = now.getHours() + min / 60;

    const oneMinute = sec / 60;
    const oneHour   = min / 60;
    const oneDay    = (hrs * 3600) / 86400;

    const minCap  = p.map(oneMinute, 0, 1, 0, 120);
    const hourCap = p.map(oneHour,   0, 1, 120, 240);
    const dayCap  = p.map(oneDay,    0, 1, 240, 360);

    p.clear(); // avoid trails if using transparency elsewhere

    p.stroke('#0c0c0cff');
    p.strokeWeight(d * 0.036); // ~18 @ 500
    p.fill('#FFFBED');
    p.circle(cx, cy, outer);

    p.strokeWeight(d * 0.004); // ~2 @ 500
    p.fill('#E4FFFF');
    p.arc(cx, cy, ringBig, ringBig, 240, 360, p.PIE);

    p.fill('#FF9B80');
    p.arc(cx, cy, ringBig, ringBig, 0, 120, p.PIE);

    p.fill('#C8FFC9');
    p.arc(cx, cy, ringBig, ringBig, 120, 240, p.PIE);

    p.strokeWeight(d * 0.012); // ~6 @ 500
    p.fill('lightblue');
    p.arc(cx, cy, ringMain, ringMain, 240, dayCap, p.PIE);

    p.fill('tomato');
    p.arc(cx, cy, ringMain, ringMain, 0, minCap, p.PIE);

    p.fill('lightgreen');
    p.arc(cx, cy, ringMain, ringMain, 120, hourCap, p.PIE);

    p.fill('#FFFBED');
    p.circle(cx, cy, center);
  };
};

/* ==============================
   Clock 2: Concentric circles
   ============================== */
let makeClock2 = (opts) => (p) => {
  p.setup = () => {
    setupCanvasToParent(p, opts.parent, false);
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    const cx = p.width / 2, cy = p.height / 2;
    const d = Math.min(p.width, p.height);

    const outer  = d * 0.74; // ~370
    const ringL  = d * 0.61; // ~304
    const ringM  = d * 0.37; // ~184
    const ringS  = d * 0.21; // ~104
    const ringXS = d * 0.20; // ~100
    const center = d * 0.10; // ~50

    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hrs = now.getHours() + min / 60;

    const oneMinute = sec / 60;
    const oneHour   = min / 60;
    const oneDay    = (hrs * 3600) / 86400;

    const minCap  = p.map(oneMinute, 0, 1, 0, 360);
    const hourCap = p.map(oneHour,   0, 1, 0, 360);
    const dayCap  = p.map(oneDay,    0, 1, 0, 360);

    p.clear();

    p.stroke('#0c0c0cff');
    p.strokeWeight(d * 0.036);
    p.fill('#FFFBED');
    p.circle(cx, cy, outer);

    p.strokeWeight(d * 0.004);
    p.fill('#E4FFFF');
    p.arc(cx, cy, ringL, ringL, 0, 360, p.PIE);

    p.strokeWeight(d * 0.012);
    p.fill('lightblue');
    p.arc(cx, cy, ringL, ringL, 0, dayCap, p.PIE);

    p.strokeWeight(d * 0.004);
    p.fill('#C8FFC9');
    p.arc(cx, cy, ringM, ringM, 0, 360, p.PIE);

    p.strokeWeight(d * 0.012);
    p.fill('lightgreen');
    p.arc(cx, cy, ringM, ringM, 0, hourCap, p.PIE);

    p.strokeWeight(d * 0.004);
    p.fill('#FF9B80');
    p.arc(cx, cy, ringS, ringS, 0, 360, p.PIE);

    p.strokeWeight(d * 0.012);
    p.fill('tomato');
    p.arc(cx, cy, ringXS, ringXS, 0, minCap, p.PIE);

    p.fill('#FFFBED');
    p.circle(cx, cy, center);
  };
};

/* ==============================
   Clock 3: “Compass” WEBGL sphere
   ============================== */
let makeClock3 = (opts) => (p) => {
  p.setup = () => {
    setupCanvasToParent(p, opts.parent, true); // WEBGL
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    const d = Math.min(p.width, p.height);

    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const oneMinute = sec / 60;

    const minCap = p.map(oneMinute, 0, 1, 0, 14);
    const rot    = p.map(oneMinute, 0, 1, 0, 360);

    p.clear();
    p.strokeWeight(minCap);
    p.stroke('#fcff5cff');
    p.fill('#0c0c0cff');

    const axis = p.createVector(1, 1, 0);
    p.rotate(rot, axis);

    const radius = d * 0.30; // ~150 @ 500
    p.sphere(radius, 24, 24);
  };
};

/* ==============================
   Instantiate sketches (CSS controls size)
   ============================== */
let clockSketch1 = new p5(makeClock1({ parent: 'clock1' }));
let clockSketch2 = new p5(makeClock2({ parent: 'clock2' }));
let clockSketch3 = new p5(makeClock3({ parent: 'clock3' }));

/* ==============================
   Viz #4: Background color day/night cycle
   ============================== */
const COLOR_NIGHT = [0x00, 0x05, 0x45]; // #000545
const COLOR_DAY   = [0xD6, 0xF3, 0xFF]; // #D6F3FF

function lerp(a, b, t) { return a + (b - a) * t; }
function toHex(n) { return n.toString(16).padStart(2, '0'); }
function rgbToHex(r, g, b) { return `#${toHex(r)}${toHex(g)}${toHex(b)}`; }

// Smooth, symmetric weighting peaking at noon, trough at midnight.
function dayWeight(t) {
  return 0.5 * (1 - Math.cos(2 * Math.PI * t));
}

function getDayFraction(now = new Date()) {
  const s = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
  return s / 86400;
}

function computeSkyColor() {
  let w = dayWeight(getDayFraction());
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