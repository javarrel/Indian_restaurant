// ===== PAGE NAVIGATION =====
  function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(page + '-page');
    if (target) { target.classList.add('active'); }
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initReveal, 200);
    return false;
  }

  // ===== NAVBAR SCROLL =====
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (window.scrollY > 50) nb.classList.add('scrolled'); else nb.classList.remove('scrolled');
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 400) btn.classList.add('visible'); else btn.classList.remove('visible');
  });

  document.getElementById('back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  });
  function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // ===== DARK MODE =====
  const darkToggle = document.getElementById('dark-toggle');
  let dark = localStorage.getItem('spice-dark') === 'true';
  if (dark) { document.documentElement.setAttribute('data-theme', 'dark'); darkToggle.textContent = '☀️'; }
  darkToggle.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
    darkToggle.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('spice-dark', dark);
  });

  // ===== TESTIMONIAL SLIDER =====
  let currentSlide = 0;
  const totalSlides = 4;
  function updateSlider() {
    document.getElementById('testimonial-track').style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
      d.setAttribute('aria-selected', i === currentSlide);
    });
  }
  document.getElementById('prev-btn').addEventListener('click', () => { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlider(); });
  document.getElementById('next-btn').addEventListener('click', () => { currentSlide = (currentSlide + 1) % totalSlides; updateSlider(); });
  function goToSlide(n) { currentSlide = n; updateSlider(); }
  setInterval(() => { currentSlide = (currentSlide + 1) % totalSlides; updateSlider(); }, 6000);

  // ===== MENU FILTER =====
  function filterMenu(filter, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => {
      if (filter === 'all') { item.classList.remove('hidden'); return; }
      const type = item.dataset.type || '';
      const tags = item.dataset.tags || '';
      const match = (filter === 'veg' && type === 'veg') ||
                    (filter === 'nonveg' && type === 'nonveg') ||
                    (filter === 'spicy' && tags.includes('spicy')) ||
                    (filter === 'popular' && tags.includes('popular'));
      item.classList.toggle('hidden', !match);
    });
  }

  // ===== SCROLL REVEAL =====
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
  }
  initReveal();

  // ===== FORM VALIDATION =====
  function validateField(fieldId, errId, validator) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errId);
    if (!field || !err) return true;
    const valid = validator(field.value.trim());
    field.classList.toggle('error', !valid);
    err.style.display = valid ? 'none' : 'block';
    return valid;
  }

  document.getElementById('reservation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const valid = [
      validateField('res-first', 'res-first-err', v => v.length > 0),
      validateField('res-last', 'res-last-err', v => v.length > 0),
      validateField('res-phone', 'res-phone-err', v => v.length >= 7),
      validateField('res-email', 'res-email-err', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validateField('res-date', 'res-date-err', v => v.length > 0),
      validateField('res-time', 'res-time-err', v => v.length > 0),
      validateField('res-guests', 'res-guests-err', v => v.length > 0),
    ].every(Boolean);
    if (valid) {
      document.getElementById('res-success').classList.add('show');
      this.reset();
      setTimeout(() => document.getElementById('res-success').classList.remove('show'), 5000);
    }
  });

  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const valid = [
      validateField('con-name', 'con-name-err', v => v.length > 1),
      validateField('con-email', 'con-email-err', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validateField('con-subject', 'con-subject-err', v => v.length > 2),
      validateField('con-message', 'con-message-err', v => v.length > 10),
    ].every(Boolean);
    if (valid) {
      document.getElementById('con-success').classList.add('show');
      this.reset();
      setTimeout(() => document.getElementById('con-success').classList.remove('show'), 5000);
    }
  });

  // Real-time validation clear
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errEl = document.getElementById(el.id + '-err');
      if (errEl) errEl.style.display = 'none';
    });
  });

  // ===== NEWSLETTER =====
  function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email');
    if (!email) return;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value)) { email.style.border = '1px solid #E53935'; return; }
    email.style.border = '';
    document.getElementById('newsletter-success').classList.add('show');
    email.value = '';
    setTimeout(() => document.getElementById('newsletter-success').classList.remove('show'), 4000);
  }

  // ===== SET MIN DATE for reservation =====
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ===== ADD-TO-ORDER FEEDBACK =====
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const original = this.textContent;
      this.textContent = '✓';
      this.style.background = '#2E7D32';
      setTimeout(() => { this.textContent = original; this.style.background = ''; }, 1500);
    });
  });
