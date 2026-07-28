/* ==========================================================================
   STACKLY - FAQ ACCORDION & SEARCH
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initFaqSearch();
});

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });
}

function initFaqSearch() {
  const searchInput = document.querySelector('#faqSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}
