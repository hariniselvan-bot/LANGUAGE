/* ==========================================================================
   STACKLY - AUTHENTICATION (PREMIUM)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAuthRoleSelector();
  initAuthPasswordToggle();
  initAuthPasswordStrength();
  initAuthRipple();
  initAuthLogin();
  initAuthSignup();
  initAuthAnimations();
});

/* ── Role Selector ── */
function initAuthRoleSelector() {
  const groups = document.querySelectorAll('.au-role-selector');
  groups.forEach((group) => {
    const btns = group.querySelectorAll('.au-role-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('au-active'));
        btn.classList.add('au-active');
        // Update hidden input
        const form = btn.closest('form') || document.querySelector('form');
        if (form) {
          let hidden = form.querySelector('input[name="role"]');
          if (!hidden) {
            hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = 'role';
            form.appendChild(hidden);
          }
          hidden.value = btn.dataset.role;
        }
      });
    });
  });
}

/* ── Password Toggle ── */
function initAuthPasswordToggle() {
  document.querySelectorAll('.au-pw-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.au-input-wrap').querySelector('input');
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.querySelector('i').className = isPw ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  });
}

/* ── Password Strength ── */
function initAuthPasswordStrength() {
  document.querySelectorAll('input[type="password"][data-strength]').forEach((input) => {
    input.addEventListener('input', () => {
      const val = input.value;
      const wrap = input.closest('.au-input-wrap');
      const bars = wrap.querySelectorAll('.au-strength-bar');
      const text = wrap.querySelector('.au-strength-text');
      if (!bars.length) return;

      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const levels = ['', 'weak', 'medium', 'strong', 'strong', 'strong'];
      const label = ['', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Excellent'];
      const level = levels[score] || 'weak';

      bars.forEach((bar, i) => {
        bar.className = 'au-strength-bar';
        if (i < score) bar.classList.add(level);
      });

      if (text) {
        text.textContent = val.length ? label[score] || '' : '';
        text.className = 'au-strength-text';
        if (val.length) text.classList.add(level);
      }
    });
  });
}

/* ── Button Ripple ── */
function initAuthRipple() {
  document.querySelectorAll('.au-submit').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'au-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ── Show Loading State ── */
function showLoading(btn) {
  btn.classList.add('au-loading');
  btn.disabled = true;
}

function hideLoading(btn) {
  btn.classList.remove('au-loading');
  btn.disabled = false;
}

/* ── Display Field Error ── */
function showError(input, msg) {
  const wrap = input.closest('.au-input-wrap');
  if (!wrap) return;
  wrap.classList.add('au-error');
  const errEl = wrap.querySelector('.au-error-msg');
  if (errEl) errEl.textContent = msg;
}

function clearError(input) {
  const wrap = input.closest('.au-input-wrap');
  if (!wrap) return;
  wrap.classList.remove('au-error');
}

function clearAllErrors(container) {
  container.querySelectorAll('.au-input-wrap').forEach((w) => w.classList.remove('au-error'));
}

/* ── Email Validation ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Phone Validation ── */
function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

/* ── LOGIN FORM ── */
function initAuthLogin() {
  const form = document.querySelector('#auLoginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const email = form.querySelector('#auEmail');
    const password = form.querySelector('#auPassword');
    const role = (form.querySelector('input[name="role"]') || {}).value || 'student';

    let valid = true;

    if (!email.value.trim()) {
      showError(email, 'Email is required');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    if (!password.value) {
      showError(password, 'Password is required');
      valid = false;
    } else if (password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.au-submit');
    showLoading(btn);

    // Store login state
    localStorage.setItem('stackly_user', JSON.stringify({
      email: email.value.trim(),
      role: role,
      loggedIn: true,
      timestamp: Date.now()
    }));

    setTimeout(() => {
      hideLoading(btn);
      if (role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
      } else {
        window.location.href = 'student-dashboard.html';
      }
    }, 1200);
  });

  // Clear errors on input
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });
}

/* ── SIGNUP FORM ── */
function initAuthSignup() {
  const form = document.querySelector('#auSignupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors(form);

    const firstName = form.querySelector('#auFirstName');
    const lastName = form.querySelector('#auLastName');
    const email = form.querySelector('#auEmail');
    const phone = form.querySelector('#auPhone');
    const country = form.querySelector('#auCountry');
    const lang = form.querySelector('#auLang');
    const password = form.querySelector('#auPassword');
    const confirm = form.querySelector('#auConfirm');
    const terms = form.querySelector('#auTerms');
    const role = (form.querySelector('input[name="role"]') || {}).value || 'student';

    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, 'First name is required');
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, 'Last name is required');
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }
    if (phone.value.trim() && !isValidPhone(phone.value.trim())) {
      showError(phone, 'Please enter a valid phone number');
      valid = false;
    }
    if (!country.value) {
      showError(country, 'Please select your country');
      valid = false;
    }
    if (!lang.value) {
      showError(lang, 'Please select a language');
      valid = false;
    }
    if (!password.value) {
      showError(password, 'Password is required');
      valid = false;
    } else if (password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters');
      valid = false;
    }
    if (password.value !== confirm.value) {
      showError(confirm, 'Passwords do not match');
      valid = false;
    }
    if (!terms.checked) {
      // Show inline message
      const wrap = terms.closest('.au-terms');
      if (wrap) {
        let err = wrap.querySelector('.au-error-msg');
        if (!err) {
          err = document.createElement('div');
          err.className = 'au-error-msg';
          err.style.display = 'block';
          wrap.appendChild(err);
        }
        err.textContent = 'Please accept the Terms & Conditions';
      }
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.au-submit');
    showLoading(btn);

    // Store user state
    localStorage.setItem('stackly_user', JSON.stringify({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      role: role,
      loggedIn: true,
      timestamp: Date.now()
    }));

    setTimeout(() => {
      hideLoading(btn);
      if (role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
      } else {
        window.location.href = 'student-dashboard.html';
      }
    }, 1500);
  });

  form.querySelectorAll('input, select').forEach((el) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });
}

/* ── Animations (Fade In / Slide Up) ── */
function initAuthAnimations() {
  const els = document.querySelectorAll('.au-fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('au-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el) => observer.observe(el));

  // Trigger visible immediately if already in view
  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('au-visible'), 200);
    }
  });
}
