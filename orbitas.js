
const canvas = document.querySelector('.orbital-field');
const ctx = canvas.getContext('2d');

function drawOrbits() {
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);

  let seed = 84173;
  function random() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const light = ctx.createRadialGradient(width * .69, height * .63, 0, width * .69, height * .63, width * .67);
  light.addColorStop(0, '#2d50a6');
  light.addColorStop(1, '#0d1a35');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 1;
  for (let ring = 0; ring < 30; ring++) {
    const radius = width * (.21 + ring * .016);
    ctx.strokeStyle = ring % 6 === 0 ? '#94b5f887' : '#7a9cef40';
    ctx.beginPath();
    ctx.ellipse(width * .55, height * .6, radius, radius * .37, -.54, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let star = 0; star < 105; star++) {
    const x = random() * width;
    const y = random() * height;
    const size = .7 + random() * 1.65;
    ctx.fillStyle = star % 12 === 0 ? '#c6d8ff' : '#a7b7e466';
    ctx.fillRect(x, y, size, size);
  }
}

if (ctx) new ResizeObserver(drawOrbits).observe(canvas);

