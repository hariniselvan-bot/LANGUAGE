/* ==========================================================================
   STACKLY - MAIN CORE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initLinkValidator();
  initButtonRipples();
});

/* Sticky & Glass Header */
function initStickyNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

/* Mobile Drawer Menu */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  const body = document.body;
  if (!toggle || !nav) return;

  // Measure scrollbar width to prevent layout shift when hiding scrollbar
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  // Save/restore scroll position to prevent page jumping
  let scrollPos = 0;

  function navOpen() {
    return nav.classList.contains('active');
  }

  function openNav() {
    scrollPos = window.scrollY;
    const sbWidth = getScrollbarWidth();

    nav.classList.add('active');
    toggle.classList.add('open');
    document.body.classList.add('nav-open');

    // Lock scroll using position:fixed (reliable across all browsers including mobile Safari).
    // Save current scroll offset via top:-scrollPos so page stays exactly in place.
    // Compensate for scrollbar disappearance with padding-right to prevent layout shift.
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollPos}px`;
    body.style.left = '0';
    body.style.width = '100%';
    if (sbWidth > 0) {
      body.style.paddingRight = `${sbWidth}px`;
    }
    // Also add padding-right to .site-header so the header stays aligned
    const headerEl = document.querySelector('.site-header');
    if (headerEl && sbWidth > 0) {
      headerEl.style.paddingRight = `${sbWidth}px`;
    }
  }

  function closeNav() {
    nav.classList.remove('active');
    toggle.classList.remove('open');
    document.body.classList.remove('nav-open');

    body.style.overflow = '';
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.width = '';
    body.style.paddingRight = '';

    const headerEl = document.querySelector('.site-header');
    if (headerEl) {
      headerEl.style.paddingRight = '';
    }

    // Restore scroll position
    window.scrollTo(0, scrollPos);
  }

  toggle.addEventListener('click', () => {
    if (navOpen()) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', () => {
    closeNav();
  });

  // Close when clicking nav link
  const links = nav.querySelectorAll('.nav-link, .mobile-auth-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // Handle resize: if going back to desktop, reset
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && navOpen()) {
      closeNav();
    }
  });
}

/* Top Progress Bar */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + '%';
  });
}

/* Back To Top Button */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Dead Link / Empty Link Handler -> Redirects to 404.html */
function initLinkValidator() {
  // Only these pages exist as valid navigable pages
  const validPages = [
    'index.html', 'about.html', 'services.html', 'blog.html',
    'contact.html', 'login.html', 'signup.html',
    'student-dashboard.html', 'teacher-dashboard.html', '404.html'
  ];

  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    const linkText = (a.textContent || '').trim().toLowerCase();

    // Skip links that are safe navigation patterns
    if (linkText.includes('back to home') || linkText.includes('\u2190 previous page')) {
      return;
    }

    // Skip JavaScript-based links (like those with onclick that handle navigation)
    if (a.getAttribute('onclick') && a.getAttribute('href') === '#') {
      return;
    }

    // Fix empty / hash-only links
    if (!href || href === '#' || href.trim() === '') {
      a.setAttribute('href', '404.html');
      return;
    }

    // Validate .html links against allowed pages
    if (href.endsWith('.html')) {
      const pageName = href.split('/').pop();
      if (!validPages.includes(pageName)) {
        a.setAttribute('href', '404.html');
      }
    }
  });
}

/* Button Ripple Effect */
function initButtonRipples() {
  document.querySelectorAll('.btn, .hero-cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

