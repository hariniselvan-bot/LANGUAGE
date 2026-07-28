/* ==========================================================================
   STACKLY - ANIMATIONS & SCROLL REVEAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollObserver();
  initTypingEffect();
  initCardTilt();
});

/* IntersectionObserver for Scroll Reveals */
function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .zoom-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* Typing text animation for Hero Subtitle */
function initTypingEffect() {
  const typingEl = document.querySelector('.typing-text');
  if (!typingEl) return;

  const phrases = [
    'Master 15+ languages with native expert tutors.',
    'Interactive lessons designed for your fast-paced life.',
    'Join 10,000+ fluent speakers worldwide today.'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    typingEl.textContent = currentPhrase.substring(0, charIdx);

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === currentPhrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* Mouse 3D Tilt Effect on Cards */
function initCardTilt() {
  const cards = document.querySelectorAll('.stat-card, .course-card, .why-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      card.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}
