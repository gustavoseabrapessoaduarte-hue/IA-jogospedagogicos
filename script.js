/* ===========================
   PRESENTATION CONTROLLER
=========================== */

const TOTAL_SLIDES = 10;
let currentIndex = 1;
let isAnimating = false;

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildNavDots();
  updateUI();
  createParticles('particles-1', 30);
  createParticles('particles-10', 20);
  hideKeyHint();
});

// ── Build Navigation Dots ─────────────────────────
function buildNavDots() {
  const nav = document.getElementById('nav-dots');
  document.getElementById('total-slides').textContent = TOTAL_SLIDES;
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 1 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i}`);
    dot.dataset.slide = i;
    dot.addEventListener('click', () => goToSlide(i));
    nav.appendChild(dot);
  }
}

// ── Change Slide ──────────────────────────────────
function changeSlide(dir) {
  const next = currentIndex + dir;
  if (next < 1 || next > TOTAL_SLIDES || isAnimating) return;
  goToSlide(next);
}

function goToSlide(target) {
  if (target === currentIndex || isAnimating) return;
  isAnimating = true;

  const current = document.getElementById(`slide-${currentIndex}`);
  const next    = document.getElementById(`slide-${target}`);

  // Remove animate-in classes so they re-trigger
  resetAnimations(next);

  current.classList.remove('active');
  current.classList.add('slide-out');

  setTimeout(() => {
    current.classList.remove('slide-out');
    next.classList.add('active');
    currentIndex = target;
    updateUI();
    isAnimating = false;
  }, 300);

  setTimeout(() => {
    triggerAnimations(next);
  }, 350);
}

// ── Reset & Trigger Animations ────────────────────
function resetAnimations(slide) {
  slide.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  });
}

function triggerAnimations(slide) {
  slide.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });
}

// ── Update UI ─────────────────────────────────────
function updateUI() {
  // Progress bar
  const pct = ((currentIndex) / TOTAL_SLIDES) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  // Counter
  document.getElementById('current-slide').textContent = currentIndex;

  // Nav dots
  document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.classList.toggle('active', parseInt(dot.dataset.slide) === currentIndex);
  });

  // Prev/Next buttons
  document.getElementById('btn-prev').style.opacity = currentIndex === 1 ? '0.3' : '1';
  document.getElementById('btn-next').style.opacity = currentIndex === TOTAL_SLIDES ? '0.3' : '1';
}

// ── Keyboard Navigation ───────────────────────────
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      changeSlide(1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault();
      changeSlide(-1);
      break;
    case 'Home':
      goToSlide(1);
      break;
    case 'End':
      goToSlide(TOTAL_SLIDES);
      break;
  }
});

// ── Touch / Swipe Support ─────────────────────────
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = touchStartX - e.changedTouches[0].screenX;
  const dy = touchStartY - e.changedTouches[0].screenY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    changeSlide(dx > 0 ? 1 : -1);
  }
}, { passive: true });

// ── Particles ─────────────────────────────────────
function createParticles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const colors = ['#6366f1', '#a78bfa', '#38bdf8', '#34d399', '#f472b6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      opacity: ${Math.random() * 0.6 + 0.1};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// ── Prompt Card Toggle ────────────────────────────
function togglePrompt(card) {
  const isOpen = card.classList.contains('open');
  // Close all
  document.querySelectorAll('.prompt-card.open').forEach(c => c.classList.remove('open'));
  // Toggle clicked
  if (!isOpen) card.classList.add('open');
}

// ── Phase Accordion Toggle (Slide 9) ─────────────
function togglePhase(phase) {
  const isOpen = phase.classList.contains('open');
  document.querySelectorAll('.s9-phase.open').forEach(p => p.classList.remove('open'));
  if (!isOpen) phase.classList.add('open');
}


// ── Hide key hint after 5 seconds ────────────────
function hideKeyHint() {
  setTimeout(() => {
    const hint = document.getElementById('key-hint');
    if (hint) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 1s ease';
    }
  }, 5000);
}

// ── Scroll wheel support ──────────────────────────
let wheelCooldown = false;
document.addEventListener('wheel', e => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  changeSlide(e.deltaY > 0 ? 1 : -1);
  setTimeout(() => { wheelCooldown = false; }, 900);
}, { passive: true });
