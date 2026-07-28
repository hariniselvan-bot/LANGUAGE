/* ==========================================================================
   STACKLY - BLOG PAGE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBlogHero();
  initBlogReveal();
  initBlogParallax();
  initBlogSearch();
});

/* ── HERO ── */
function initBlogHero() {
  const hero = document.querySelector('.bl-hero');
  if (!hero) return;
  const els = [
    { sel: '.bl-hero-tag', delay: 0 },
    { sel: '.bl-hero-title', delay: 150 },
    { sel: '.bl-hero-sub', delay: 300 },
    { sel: '.bl-hero-breadcrumb', delay: 450 },
    { sel: '.bl-hero-search', delay: 550 },
  ];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        els.forEach(({ sel, delay }) => {
          const el = hero.querySelector(sel);
          if (el) setTimeout(() => el.classList.add('visible'), delay);
        });
      }
    });
  }, { threshold: 0.15 });
  observer.observe(hero);
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    els.forEach(({ sel, delay }) => {
      const el = hero.querySelector(sel);
      if (el) setTimeout(() => el.classList.add('visible'), delay + 100);
    });
  }
}

/* ── REVEAL ── */
function initBlogReveal() {
  const els = document.querySelectorAll('.bl-fade-up, .bl-fade-left, .bl-fade-right, .bl-zoom-in');
  if (els.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach((el) => observer.observe(el));
}

/* ── PARALLAX ── */
function initBlogParallax() {
  const hero = document.querySelector('.bl-hero');
  if (!hero) return;
  const items = hero.querySelectorAll('.bl-hero-shape, .bl-hero-icon, .bl-hero-line');
  if (items.length === 0) return;
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    items.forEach((el, i) => {
      const speed = 10 + i * 5;
      el.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    items.forEach((el) => el.style.transform = 'translate(0, 0)');
  });
}

/* ── SEARCH ── */
function initBlogSearch() {
  const input = document.querySelector('.bl-hero-search input');
  const btn = document.querySelector('.bl-hero-search button');
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (val) alert(`Searching for: "${val}"`);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      alert(`Searching for: "${input.value.trim()}"`);
    }
  });
}

/* ── TAG FILTER ── */
function initBlogTags() {
  const tags = document.querySelectorAll('.bl-tag');
  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      tags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });
}
