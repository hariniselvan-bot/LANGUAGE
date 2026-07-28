/* ==========================================================================
   STACKLY - PRICING TOGGLE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPricingToggle();
});

function initPricingToggle() {
  const toggle = document.querySelector('.toggle-switch');
  const priceValues = document.querySelectorAll('.pricing-value');
  const periodTexts = document.querySelectorAll('.pricing-period');

  if (!toggle || !priceValues.length) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('yearly');
    const isYearly = toggle.classList.contains('yearly');

    priceValues.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const yearly = el.getAttribute('data-yearly');

      if (isYearly && yearly) {
        el.textContent = '$' + yearly;
      } else if (monthly) {
        el.textContent = '$' + monthly;
      }
    });

    periodTexts.forEach(el => {
      el.textContent = isYearly ? '/year' : '/month';
    });
  });
}
