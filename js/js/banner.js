/* ==========================================================================
   STACKLY - INNER PAGE BANNER (VANILLA JAVASCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBannerAnimations();
  initBannerParallax();
});

/* Banner Fade-in Animations on Page Load */
function initBannerAnimations() {
  const banner = document.querySelector('.page-banner');
  if (!banner) return;

  // Observe banner entry for scroll reveal (re-trigger if scrolled away and back)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children with delays
          const tag = banner.querySelector('.banner-tag');
          const title = banner.querySelector('.banner-title');
          const subtext = banner.querySelector('.banner-subtext');
          const breadcrumb = banner.querySelector('.banner-breadcrumb');

          if (tag) setTimeout(() => tag.classList.add('visible'), 0);
          if (title) setTimeout(() => title.classList.add('visible'), 150);
          if (subtext) setTimeout(() => subtext.classList.add('visible'), 300);
          if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 450);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(banner);

  // Also trigger immediately if already visible on load
  const rect = banner.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const tag = banner.querySelector('.banner-tag');
    const title = banner.querySelector('.banner-title');
    const subtext = banner.querySelector('.banner-subtext');
    const breadcrumb = banner.querySelector('.banner-breadcrumb');

    if (tag) setTimeout(() => tag.classList.add('visible'), 100);
    if (title) setTimeout(() => title.classList.add('visible'), 250);
    if (subtext) setTimeout(() => subtext.classList.add('visible'), 400);
    if (breadcrumb) setTimeout(() => breadcrumb.classList.add('visible'), 550);
  }
}

/* Mouse Parallax Effect on Banner Floating Shapes */
function initBannerParallax() {
  const banner = document.querySelector('.page-banner');
  if (!banner) return;

  const floatItems = banner.querySelectorAll('.banner-float-item, .banner-icon, .banner-line');

  // Only enable on devices that support hover (not touch)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice || floatItems.length === 0) return;

  banner.addEventListener('mousemove', (e) => {
    const rect = banner.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized delta from center (-1 to 1)
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    floatItems.forEach((el, index) => {
      const speed = 8 + (index * 4); // varying speeds for depth
      const moveX = deltaX * speed;
      const moveY = deltaY * speed;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Reset on mouse leave
  banner.addEventListener('mouseleave', () => {
    floatItems.forEach((el) => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

