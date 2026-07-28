/* ==========================================================================
   STACKLY - NUMBER COUNTER ANIMATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const text = el.textContent.trim();
  const target = parseInt(text.replace(/\D/g, ''));
  if (isNaN(target)) return;

  const suffix = text.replace(/[0-9]/g, '');
  let current = 0;
  const duration = 1800; // ms
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, stepTime);
}
