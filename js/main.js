/* ══════════════════════════════════════════
   TORTUCROCHET MX · main.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ─────────────────────── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    let mx = -100, my = -100;
    let cx = -100, cy = -100;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const lerp = (a, b, t) => a + (b - a) * t;
    const moveCursor = () => {
      cx = lerp(cx, mx, 0.18);
      cy = lerp(cy, my, 0.18);
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(moveCursor);
    };
    moveCursor();

    document.querySelectorAll('a, button, .p-card, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
  }

  /* ── NAV SCROLL ────────────────────────── */
  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('solid', window.scrollY > 50);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── MOBILE TOGGLE ─────────────────────── */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');

  toggle.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
  });
  drawer.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
    })
  );

  /* ── SMOOTH SCROLL ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight,
        behavior: 'smooth'
      });
    });
  });

  /* ── SCROLL REVEAL ─────────────────────── */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('.rose-rule').forEach(r => r.style.transform = 'scaleX(1)');
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  document.querySelectorAll('.section-header').forEach(header => {
    const sRo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      header.classList.add('in');
      header.querySelectorAll('.rose-rule').forEach(r => {
        r.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s';
        r.style.transform = 'scaleX(1)';
      });
      sRo.unobserve(header);
    }, { threshold: 0.2 });
    sRo.observe(header);
  });

  /* ── HERO PARALLAX ─────────────────────── */
  const heroBg = document.querySelector('.hero-image');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = `scale(1) translateY(${y * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ── CONTACT FORM ──────────────────────── */
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');
    let ok = true;

    if (!name.value.trim()) {
      setError('nameErr', name, 'Por favor ingresa tu nombre.'); ok = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError('emailErr', email, 'Ingresa un correo válido.'); ok = false;
    }
    if (!message.value.trim()) {
      setError('messageErr', message, 'Por favor escribe tu mensaje.'); ok = false;
    }
    if (!ok) return;

    const btn     = document.getElementById('submitBtn');
    const label   = btn.querySelector('.btn-label');
    const loading = btn.querySelector('.btn-loading');
    label.hidden = true; loading.hidden = false; btn.disabled = true;

    setTimeout(() => {
      btn.hidden = true;
      document.getElementById('formSuccess').hidden = false;
      form.reset();
    }, 1500);
  });

  form.querySelectorAll('input, textarea').forEach(f =>
    f.addEventListener('input', () => f.classList.remove('err'))
  );

  function setError(id, field, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    field.classList.add('err');
  }
  function clearErrors() {
    document.querySelectorAll('.form-err').forEach(e => e.textContent = '');
    document.querySelectorAll('.err').forEach(e => e.classList.remove('err'));
  }

});
