/* ==========================================================================
   STACKLY - DASHBOARD (STUDENT & TEACHER) - FULL SPA NAVIGATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashSidebar();
  initDashNavigation();
  initDashLogout();
  initDashUserData();
  initDashAnimations();
  initDashCharts();
  initDashSettings();
  initDashPasswordToggle();
  initDashStudentSearch();
  initDashDropdown();
  initDashHeaderScroll();
  initDashDarkMode();
});

/* ── Sidebar Toggle (Mobile) ── */
function initDashSidebar() {
  const toggle = document.querySelector('.db-hamburger');
  const sidebar = document.querySelector('.db-sidebar');
  const overlay = document.querySelector('.db-overlay');
  if (!sidebar) return;

  function open() { sidebar.classList.add('open'); if (overlay) overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function close() { sidebar.classList.remove('open'); if (overlay) overlay.classList.remove('show'); document.body.style.overflow = ''; }

  if (toggle) toggle.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  if (overlay) overlay.addEventListener('click', close);

  window.addEventListener('resize', () => { if (window.innerWidth > 992) close(); });
}

/* ── Section Navigation (SPA) ── */
function initDashNavigation() {
  const menuItems = document.querySelectorAll('.db-menu-item');
  const sections = document.querySelectorAll('.db-section');
  const sectionTitles = {
    'dashboard': 'Dashboard',
    'my-courses': 'My Courses',
    'progress': 'Progress',
    'profile': 'Profile',
    'settings': 'Settings',
    'my-classes': 'My Classes',
    'students': 'Students'
  };

  menuItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const section = this.dataset.section;
      if (!section) return;

      // Update active menu
      menuItems.forEach((m) => m.classList.remove('db-active'));
      this.classList.add('db-active');

      // Show/hide sections
      sections.forEach((s) => s.classList.add('db-hidden'));
      const target = document.querySelector(`#section-${section}`);
      if (target) target.classList.remove('db-hidden');

      // Update header title
      const headerTitle = document.querySelector('.db-header-title');
      if (headerTitle) {
        headerTitle.textContent = sectionTitles[section] || 'Dashboard';
      }

      // Close sidebar on mobile
      if (window.innerWidth <= 992) {
        const sidebar = document.querySelector('.db-sidebar');
        const overlay = document.querySelector('.db-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
      }

      // Re-trigger animations
      if (target) {
        target.querySelectorAll('.db-fade-in').forEach((el, i) => {
          el.classList.remove('db-visible');
          setTimeout(() => el.classList.add('db-visible'), i * 80);
        });
      }
    });
  });

  // Activate default section (first menu item)
  const firstActive = document.querySelector('.db-menu-item.db-active');
  if (firstActive) {
    firstActive.click();
  } else {
    const first = document.querySelector('.db-menu-item');
    if (first) first.click();
  }
}

/* ── Logout ── */
function initDashLogout() {
  document.querySelectorAll('.db-logout-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    });
  });
}

/* ── Load User Data ── */
function initDashUserData() {
  let user = { firstName: 'Alex', lastName: 'Morgan', role: 'student' };
  try {
    const stored = localStorage.getItem('stackly_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.loggedIn) user = parsed;
    }
  } catch (e) { /* use defaults */ }

  document.querySelectorAll('.db-user-name').forEach((el) => { el.textContent = user.firstName || 'Student'; });
  document.querySelectorAll('.db-user-full').forEach((el) => { el.textContent = `${user.firstName || 'Alex'} ${user.lastName || 'Morgan'}`; });
  document.querySelectorAll('.db-user-role').forEach((el) => { el.textContent = user.role === 'teacher' ? 'Teacher' : 'Student'; });
}

/* ── Animations ── */
function initDashAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .db-fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .db-fade-in.db-visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const observe = () => {
    const els = document.querySelectorAll('.db-fade-in:not(.db-visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('db-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    els.forEach((el) => observer.observe(el));

    // Also trigger visible for already visible elements
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => el.classList.add('db-visible'), 100);
      }
    });
  };

  observe();

  // Re-run when sections change
  document.querySelectorAll('.db-menu-item').forEach((item) => {
    item.addEventListener('click', () => setTimeout(observe, 50));
  });
}

/* ── Canvas Charts ── */
function initDashCharts() {
  // Weekly Learning Chart
  const canvas = document.querySelector('#dbStudyChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width || 600;
    const h = 220;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const vals = [2.5, 4.0, 1.8, 3.2, 5.0, 6.5, 4.2];
    const max = 8;
    const pad = 40;
    const cw = w - pad * 2;
    const ch = h - pad * 2;
    const bw = cw / days.length - 16;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = h - pad - (i / 4) * ch;
      ctx.strokeStyle = 'rgba(90,90,64,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(w - pad, y);
      ctx.stroke();
    }

    days.forEach((d, i) => {
      const v = vals[i];
      const x = pad + i * (cw / days.length) + 8;
      const bh = (v / max) * ch;
      const y = h - pad - bh;

      // Bar
      const grad = ctx.createLinearGradient(x, y, x, h - pad);
      grad.addColorStop(0, '#5A5A40');
      grad.addColorStop(1, '#8a8a6a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [6, 6, 0, 0]);
      ctx.fill();

      // Value
      ctx.fillStyle = '#2D2D2A';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${v}h`, x + bw / 2, y - 6);

      // Day
      ctx.fillStyle = '#6E6D6A';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(d, x + bw / 2, h - 12);
    });
  }

  // Daily Study Time mini chart
  const miniCanvas = document.querySelector('#dbDailyChart');
  if (miniCanvas) {
    const ctx = miniCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = miniCanvas.parentElement.getBoundingClientRect();
    const w = rect.width || 300;
    const h = 60;

    miniCanvas.width = w * dpr;
    miniCanvas.height = h * dpr;
    miniCanvas.style.width = w + 'px';
    miniCanvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const vals = [1.2, 0.8, 2.0, 1.5, 0.5, 1.8, 0.9, 2.5, 1.0, 1.6, 0.7, 2.2, 1.3, 1.9];
    const max = 3;
    const bw = (w - 20) / vals.length - 4;

    ctx.clearRect(0, 0, w, h);
    vals.forEach((v, i) => {
      const bh = (v / max) * (h - 16);
      const x = 10 + i * ((w - 20) / vals.length);
      const y = h - 8 - bh;
      ctx.fillStyle = v > 1.5 ? '#5A5A40' : 'rgba(90,90,64,0.2)';
      ctx.beginPath();
      ctx.roundRect(x, y, bw, bh, [2, 2, 0, 0]);
      ctx.fill();
    });
  }
}

/* ── Settings Toggles ── */
function initDashSettings() {
  document.querySelectorAll('.db-toggle').forEach((tog) => {
    tog.addEventListener('click', () => {
      tog.classList.toggle('on');
    });
  });

  // Save Settings button
  document.querySelectorAll('.db-save-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = '✓ Saved!';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 2000);
    });
  });

  // Edit Profile button
  document.querySelectorAll('.db-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Profile Updated!';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = 'Edit Profile';
        btn.style.background = '';
      }, 2000);
    });
  });

  // Create class, Edit, Delete buttons
  document.querySelectorAll('.db-create-btn').forEach((btn) => {
    btn.addEventListener('click', () => alert('Create New Class feature coming soon!'));
  });
  document.querySelectorAll('.db-class-edit').forEach((btn) => {
    btn.addEventListener('click', () => alert('Edit Class feature coming soon!'));
  });
  document.querySelectorAll('.db-class-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this class?')) {
        btn.closest('.db-class-item').remove();
      }
    });
  });
}

/* ── Password Toggle ── */
function initDashPasswordToggle() {
  document.querySelectorAll('.db-pw-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.db-input-wrap').querySelector('input');
      if (!input) return;
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.querySelector('i').className = isPw ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  });
}

/* ── Student Search / Filter ── */
function initDashStudentSearch() {
  const searchInput = document.querySelector('.db-search-input');
  const filterSelect = document.querySelector('.db-filter-select');

  function filterStudents() {
    const query = (searchInput ? searchInput.value.toLowerCase() : '');
    const level = (filterSelect ? filterSelect.value : '');

    document.querySelectorAll('.db-student-item').forEach((item) => {
      const name = item.querySelector('h4')?.textContent.toLowerCase() || '';
      const levelText = item.querySelector('.db-student-level')?.textContent || '';
      let show = true;
      if (query && !name.includes(query)) show = false;
      if (level && levelText !== level) show = false;
      item.style.display = show ? 'flex' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterStudents);
  if (filterSelect) filterSelect.addEventListener('change', filterStudents);
}

/* ── Profile Dropdown ── */
function initDashDropdown() {
  document.querySelectorAll('.db-profile-dropdown').forEach((dropdown) => {
    const avatar = dropdown.querySelector('.db-avatar');
    if (!avatar) return;

    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other dropdowns
      document.querySelectorAll('.db-profile-dropdown.show').forEach((d) => {
        if (d !== dropdown) d.classList.remove('show');
      });
      dropdown.classList.toggle('show');
    });

    // Dropdown items navigation
    dropdown.querySelectorAll('.db-dropdown-item[data-section]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const section = item.dataset.section;
        if (section) {
          const menuItem = document.querySelector(`.db-menu-item[data-section="${section}"]`);
          if (menuItem) menuItem.click();
        }
        dropdown.classList.remove('show');
      });
    });

    // Dropdown logout
    const logoutItem = dropdown.querySelector('.db-dropdown-logout');
    if (logoutItem) {
      logoutItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('stackly_user');
        window.location.href = 'login.html';
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.db-profile-dropdown.show').forEach((d) => d.classList.remove('show'));
  });
}

/* ── Header Scroll Shadow ── */
function initDashHeaderScroll() {
  const header = document.querySelector('.db-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('db-header-scrolled');
    } else {
      header.classList.remove('db-header-scrolled');
    }
  });
}

/* ── Dark Mode Toggle ── */
function initDashDarkMode() {
  // Restore dark mode preference
  const isDark = localStorage.getItem('stackly_dark_mode') === 'true';
  if (isDark) {
    document.body.classList.add('db-dark-mode');
  }

  // Listen for dark mode toggles
  document.querySelectorAll('.db-dark-toggle').forEach((tog) => {
    if (isDark) {
      tog.classList.add('on');
    }
    tog.addEventListener('click', () => {
      const isDarkNow = document.body.classList.toggle('db-dark-mode');
      localStorage.setItem('stackly_dark_mode', isDarkNow);
      // Sync all dark toggles
      document.querySelectorAll('.db-dark-toggle').forEach((t) => {
        if (t !== tog) t.classList.toggle('on', isDarkNow);
      });
    });
  });
}

/* ── Re-draw charts on section change ── */
window.addEventListener('resize', () => {
  setTimeout(initDashCharts, 200);
});
