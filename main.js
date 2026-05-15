/* ═══════════════════════════════════════════════════════════
   SHREEMINFINITY — Shared JavaScript
   ═══════════════════════════════════════════════════════════ */

/* ── Custom Cursor ─────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

/* ── Nav Scroll ────────────────────────────────────────────── */
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── FAQ Accordion ─────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Parallax Hero Photo ───────────────────────────────────── */
const heroBg = document.querySelector('.hero-main-photo');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}

/* ── Gallery Filter ────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Lightbox ──────────────────────────────────────────────── */
const items = Array.from(document.querySelectorAll('[data-lightbox]'));
const lb    = document.getElementById('lightbox');

if (lb && items.length) {
  const lbImg     = document.getElementById('lightboxImg');
  const lbCat     = document.getElementById('lightboxCat');
  const lbTitle   = document.getElementById('lightboxTitle');
  const lbCounter = document.getElementById('lightboxCounter');
  let current     = 0;

  function openLightbox(idx) {
    current = idx;
    const el = items[idx];
    lbImg.src            = el.querySelector('img').src;
    lbCat.textContent    = el.dataset.cat   || '';
    lbTitle.textContent  = el.dataset.title || '';
    lbCounter.textContent = (idx + 1) + ' / ' + items.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));

  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', () => openLightbox((current - 1 + items.length) % items.length));
  if (nextBtn)  nextBtn.addEventListener('click', () => openLightbox((current + 1) % items.length));

  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   openLightbox((current - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight')  openLightbox((current + 1) % items.length);
  });
}