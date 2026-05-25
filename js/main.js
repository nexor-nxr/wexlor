 // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .service-card, .proj, .tech-pill, .process-step').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(201,168,76,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(201,168,76,0.5)';
    });
  });

  // HAMBURGER
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
    });
  });

  // SCROLL REVEAL
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  // NAV SCROLL EFFECT
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(8,8,10,0.97)';
      nav.style.borderBottom = '1px solid rgba(201,168,76,0.1)';
    } else {
      nav.style.background = '';
      nav.style.borderBottom = '';
    }
  });

  // FORM
  function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Envoyé ✓';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = 'Envoyer la demande →';
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3000);
  }

  // SMOOTH SCROLLING
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
