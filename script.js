// script.js - interactive behaviour

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confettiCanvas = document.getElementById('confettiCanvas');

let noMoveCount = 0;

// Move the NO button to a random position (keeps inside viewport)
function moveNoButton() {
  const btn = noBtn;
  const rect = btn.getBoundingClientRect();
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const margin = 20;

  const maxX = Math.max(0, vw - rect.width - margin);
  const maxY = Math.max(0, vh - rect.height - margin);

  const x = Math.floor(Math.random() * maxX) + margin;
  const y = Math.floor(Math.random() * maxY) + margin;

  btn.style.position = 'fixed';
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
  noMoveCount++;
}

// When user tries to hover NO, move it
noBtn.addEventListener('mouseenter', (e) => {
  // first time - small nudge, later bigger jumps
  moveNoButton();
});

// If user clicks YES
yesBtn.addEventListener('click', () => {
  showModal();
  startConfetti();
});

// Show modal
function showModal(){
  modal.classList.remove('hidden');
}

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// If user resizes, reset NO button style (so it doesn't get stuck off-screen)
window.addEventListener('resize', () => {
  noBtn.style.position = '';
  noBtn.style.left = '';
  noBtn.style.top = '';
});

// -----------------------------
// Simple confetti implementation
// -----------------------------
function startConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const pieces = [];
  const colors = [
    '#ff4d7e','#ffb3c7','#ffd6e0','#ffd27a','#ffc17a','#a6ffcb'
  ];

  function random(min, max) { return Math.random() * (max - min) + min; }

  for (let i=0;i<120;i++){
    pieces.push({
      x: random(0, confettiCanvas.width),
      y: random(-confettiCanvas.height, 0),
      w: random(6, 12),
      h: random(8, 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      r: random(0, Math.PI*2),
      s: random(1, 3),
      rx: random(-0.05, 0.05)
    });
  }

  let running = true;
  const gravity = 0.04;

  function update(){
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    for (const p of pieces){
      p.y += p.s;
      p.x += Math.sin(p.r) * 0.8;
      p.r += p.rx;
      p.s += gravity * 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }
  }

  let frames = 0;
  function loop(){
    if (!running) return;
    update();
    frames++;
    if (frames > 300) {
      running = false;
      ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
      return;
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// Optional: small Easter-egg: click card to change text temporarily
document.querySelector('.card').addEventListener('click', (e) => {
  const t = document.querySelector('.title');
  const original = t.textContent;
  t.textContent = "Be my date? 💕";
  setTimeout(()=> t.textContent = original, 1600);
});
