/* ==========================================================================
   STACKLY - SERVICES PAGE (VANILLA JS)
   ========================================================================== */



/* ── HERO FADE-IN ── */
function initServicesHero() {
  const hero = document.querySelector('.srv-hero');
  if (!hero) return;

  const tag = hero.querySelector('.srv-hero-tag');
  const title = hero.querySelector('.srv-hero-title');
  const sub = hero.querySelector('.srv-hero-sub');
  const breadcrumb = hero.querySelector('.srv-hero-breadcrumb');
  const cta = hero.querySelector('.srv-hero-cta');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (tag) setTimeout(() => tag.classList.add('visible'), 0);
          if (title) setTimeout(() => title.classList.add('visible'), 150);
          if (sub) setTimeout(() => sub.classList.add('visible'), 300);
          if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 450);
          if (cta) setTimeout(() => cta.classList.add('visible'), 500);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(hero);

  // Immediate trigger if visible
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    if (tag) setTimeout(() => tag.classList.add('visible'), 100);
    if (title) setTimeout(() => title.classList.add('visible'), 250);
    if (sub) setTimeout(() => sub.classList.add('visible'), 400);
    if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 550);
    if (cta) setTimeout(() => cta.classList.add('visible'), 600);
  }
}

/* ── SCROLL REVEAL (Intersection Observer) ── */
function initServicesReveal() {
  const revealEls = document.querySelectorAll(
    '.srv-fade-up, .srv-fade-left, .srv-fade-right, .srv-zoom-in'
  );

  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initServicesFaq() {
  const items = document.querySelectorAll('.faq-item');

  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach((i) => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}


/* ── MOUSE PARALLAX ON HERO SHAPES ── */
function initServicesParallax() {
  const hero = document.querySelector('.srv-hero');
  if (!hero) return;

  const shapes = hero.querySelectorAll('.srv-hero-shape, .srv-hero-lang-icon, .srv-hero-line');
  if (shapes.length === 0) return;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    shapes.forEach((el, i) => {
      const speed = 10 + i * 5;
      el.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    shapes.forEach((el) => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initServicesHero();
  initServicesReveal();
  initServicesFaq();
  initServicesParallax();
});
