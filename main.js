// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1400);
});

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const curR = document.getElementById('curRing');
document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  curR.style.left = e.clientX + 'px';
  curR.style.top  = e.clientY + 'px';
});

// ── NAVBAR SCROLL + BACK-TO-TOP ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('btt').classList.toggle('show', window.scrollY > 400);
});

// ── HAMBURGER TOGGLE (with X animation) ──
const ham     = document.getElementById('ham');
const mobMenu = document.getElementById('mobMenu');

ham.addEventListener('click', () => {
  const isOpen = mobMenu.classList.toggle('open');
  ham.classList.toggle('open', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMob() {
  mobMenu.classList.remove('open');
  ham.classList.remove('open');
  document.body.style.overflow = '';
}

// Close menu on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMob();
});

// ── SCROLL REVEAL ──
const revObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 90);
      revObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revObserver.observe(el));

// ── CONTACT FORM SUBMIT ──
function handleSubmit() {
  alert('Thank you! We will contact you within 24 hours to confirm your appointment. ✦\n\nSee you soon at Shreeminfinity!');
}

// ── BACK TO TOP ──
document.getElementById('btt').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
/* ═══════════════════════════════════════════════════════════
   main.js  –  Shreeminfinity  (shared across all pages)
   Paste this entire block into your existing main.js,
   or replace main.js with this file.
   ═══════════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('curRing');
  if (!cur || !curR) return;
  document.addEventListener('mousemove', e => {
    cur.style.left  = e.clientX + 'px';
    cur.style.top   = e.clientY + 'px';
    curR.style.left = e.clientX + 'px';
    curR.style.top  = e.clientY + 'px';
  });
})();

/* ── NAV SCROLL SHRINK ── */
(function initNavScroll() {
  const navbar = document.getElementById('navbar');
  const btt    = document.getElementById('btt');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
})();

/* ── BACK TO TOP ── */
(function initBtt() {
  const btt = document.getElementById('btt');
  if (!btt) return;
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── HAMBURGER / MOBILE MENU ── */
(function initMobileMenu() {
  const ham      = document.getElementById('ham');
  const mobMenu  = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');
  if (!ham || !mobMenu) return;

  function openMenu() {
    mobMenu.classList.add('open');
    ham.classList.add('open');
    mobMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobMenu.classList.remove('open');
    ham.classList.remove('open');
    mobMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', () =>
    mobMenu.classList.contains('open') ? closeMenu() : openMenu()
  );
  if (mobClose) mobClose.addEventListener('click', closeMenu);

  // Close when any nav link inside the menu is tapped
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right';
  const elements  = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const ro = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling cards that appear at the same time
        const delay = i * 80;
        setTimeout(() => entry.target.classList.add('in'), delay);
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  elements.forEach(el => ro.observe(el));
})();

/* ── CONTACT FORM SUBMIT (if form exists on this page) ── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.fsub');
    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    }
  });
})();
/* ═══════════════════════════════════════════════════════════
   gallery.js  –  Shreeminfinity Gallery Page
   Add this block to the bottom of your main.js,
   OR load it as a separate <script src="gallery.js"></script>
   after main.js in gallery.html only.
   ═══════════════════════════════════════════════════════════ */

/* ── GALLERY FILTER ── */
(function initFilter() {
  const tabs  = document.querySelectorAll('.ftab');
  const items = document.querySelectorAll('.masonry-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        // Use visibility + height:0 so masonry columns reflow cleanly
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
})();

/* ── LIGHTBOX ── */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  if (!lightbox) return;

  const items = Array.from(document.querySelectorAll('.masonry-item'));
  const imgs  = items.map(item => item.querySelector('img'));
  let currentIdx = 0;

  function getVisibleImgs() {
    return items
      .map((item, i) => ({ item, img: imgs[i] }))
      .filter(({ item }) => item.style.display !== 'none');
  }

  function open(idx) {
    currentIdx = idx;
    lbImg.src = imgs[idx].src;
    lbCaption.textContent = imgs[idx].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    const visible = getVisibleImgs();
    const visIdx  = visible.findIndex(({ img }) => img === imgs[currentIdx]);
    const nextVis = (visIdx + direction + visible.length) % visible.length;
    const globalIdx = imgs.indexOf(visible[nextVis].img);
    open(globalIdx);
  }

  // Open on item click
  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click',  e => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click',  e => { e.stopPropagation(); navigate(+1); });

  // Click backdrop to close
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(+1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  });
})();
/* =====================================================
   SHREEMINFINITY — scripts.js
   Shared JS for all pages (services, index, gallery,
   ratecard, about, contact). Link this at the bottom
   of every page's <body> with:
     <script src="scripts.js"></script>
   ===================================================== */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('curRing');
  if (!cur || !curR) return;

  document.addEventListener('mousemove', function (e) {
    cur.style.left  = e.clientX + 'px';
    cur.style.top   = e.clientY + 'px';
    curR.style.left = e.clientX + 'px';
    curR.style.top  = e.clientY + 'px';
  });
})();

/* ── NAV SCROLL BEHAVIOUR + SERVICE TAB ACTIVE STATE ── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const btt    = document.getElementById('btt');

  // Service tab section IDs (only relevant on services.html)
  const svcSections = ['bridal-makeup', 'hair-styling', 'skin-care', 'saree-draping', 'party-glam'];
  const svcTabs     = document.querySelectorAll('.svc-tab');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    // Sticky nav style
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);

    // Back-to-top button
    if (btt) btt.classList.toggle('show', scrollY > 400);

    // Active service tab highlight
    if (svcTabs.length) {
      let current = '';
      svcSections.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - 200) current = id;
      });
      svcTabs.forEach(function (tab) {
        tab.classList.toggle('active', tab.getAttribute('href') === '#' + current);
      });
    }
  });
})();

/* ── HAMBURGER MOBILE MENU ── */
(function initHamburger() {
  const ham     = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');
  if (!ham || !mobMenu) return;

  ham.addEventListener('click', function () {
    mobMenu.classList.toggle('open');
    ham.classList.toggle('open');
  });
})();

/* ── SCROLL REVEAL (Intersection Observer) ── */
(function initReveal() {
  const ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () {
          e.target.classList.add('in');
        }, i * 80);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    ro.observe(el);
  });
})();

/* ── SMOOTH SCROLL for service tab links ── */
(function initSvcTabScroll() {
  document.querySelectorAll('.svc-tab').forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute('href'));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();

/* ── BACK TO TOP button ── */
(function initBtt() {
  const btt = document.getElementById('btt');
  if (!btt) return;
  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── GALLERY LIGHTBOX (gallery.html only) ── */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg   = lightbox.querySelector('.lb-img');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbPrev  = lightbox.querySelector('.lb-prev');
  const lbNext  = lightbox.querySelector('.lb-next');
  const items   = Array.from(document.querySelectorAll('.masonry-item'));
  let current   = 0;

  function open(index) {
    current = index;
    const img = items[index].querySelector('img');
    if (img) lbImg.src = img.src;
    lightbox.classList.add('open');
  }

  function close() { lightbox.classList.remove('open'); }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click',  function () { open((current - 1 + items.length) % items.length); });
  if (lbNext)  lbNext.addEventListener('click',  function () { open((current + 1) % items.length); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') open((current - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') open((current + 1) % items.length);
  });
})();

/* ── GALLERY FILTER TABS (gallery.html only) ── */
(function initGalleryFilter() {
  const tabs  = document.querySelectorAll('.ftab');
  const items = document.querySelectorAll('.masonry-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(function (item) {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

/* ── PRELOADER (index.html only) ── */
(function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 1600);
  });
})();

/* ── CONTACT FORM (contact.html only) ── */
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Replace with your actual form submission logic (e.g. fetch to a backend).
    const btn = form.querySelector('.fsub');
    if (btn) {
      btn.textContent = 'Sent ✓';
      btn.disabled = true;
    }
  });
})();