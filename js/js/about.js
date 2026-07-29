/* ==========================================================================
   STACKLY - ABOUT PAGE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAboutHero();
  initAboutReveal();
  initAboutTestimonials();
  initAboutParallax();
  initAboutCounters();
});

/* ── HERO FADE-IN ── */
function initAboutHero() {
  const hero = document.querySelector('.ab-hero');
  if (!hero) return;
  const tag = hero.querySelector('.ab-hero-tag');
  const title = hero.querySelector('.ab-hero-title');
  const sub = hero.querySelector('.ab-hero-sub');
  const breadcrumb = hero.querySelector('.ab-hero-breadcrumb');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (tag) setTimeout(() => tag.classList.add('visible'), 0);
        if (title) setTimeout(() => title.classList.add('visible'), 150);
        if (sub) setTimeout(() => sub.classList.add('visible'), 300);
        if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 450);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(hero);

  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    if (tag) setTimeout(() => tag.classList.add('visible'), 100);
    if (title) setTimeout(() => title.classList.add('visible'), 250);
    if (sub) setTimeout(() => sub.classList.add('visible'), 400);
    if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 550);
  }
}

/* ── SCROLL REVEAL ── */
function initAboutReveal() {
  const els = document.querySelectorAll('.ab-fade-up, .ab-fade-left, .ab-fade-right, .ab-zoom-in');
  if (els.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach((el) => observer.observe(el));
}


/* ── PARALLAX ── */
function initAboutParallax() {
  const hero = document.querySelector('.ab-hero');
  if (!hero) return;
  const items = hero.querySelectorAll('.ab-hero-shape, .ab-hero-icon, .ab-hero-line');
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

/* ── COUNTER ANIMATION ── */
function initAboutCounters() {
  const nums = document.querySelectorAll('.ab-achievement-num');
  if (nums.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const raw = entry.target.textContent.trim();
        const suffix = raw.replace(/[\d.,]/g, '');
        const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const isDecimal = raw.includes('.');
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(interval); }
          entry.target.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        }, 25);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => observer.observe(n));
}
