/* ============================================
   AHMED HAMOUDA — PREMIUM RESUME v3.0
   Pure Vanilla JS · Performance-First
   ============================================ */

(() => {
  'use strict';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        revealOnLoad();
      }, 300);
    }
    if (loaderProgress) loaderProgress.style.width = progress + '%';
  }, 120);

  document.body.style.overflow = 'hidden';

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header Scroll ---------- */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    backTop.classList.toggle('visible', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (y / docHeight) * 100;
    scrollProgress.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile Menu (Dropdown Bar) ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navDropdown = document.getElementById('navDropdown');
  const nav = document.getElementById('nav');
  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    navDropdown.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    const navHeight = nav.offsetHeight;
    navDropdown.style.height = (navHeight + 60) + 'px';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    navDropdown.style.height = '0';
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      if (!isMenuOpen) {
        navDropdown.classList.remove('open');
        document.body.style.overflow = '';
      }
    }, 400);
  }

  menuToggle.addEventListener('click', () => {
    if (isMenuOpen) { closeMenu(); } else { openMenu(); }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { closeMenu(); });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) { closeMenu(); }
  });

  /* ---------- Back To Top ---------- */
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Cursor Glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  /* ---------- Typing Effect ---------- */
  const typingEl = document.getElementById('typingText');
  const roles = [
    'Customer Operations Professional',
    'Accounts Receivable Specialist',
    'AI-Assisted Business Systems Developer',
    'Founder of Axentro'
  ];
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  const type = () => {
    const current = roles[roleIndex];
    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 2400);
        return;
      }
      setTimeout(type, 60);
    }
  };
  setTimeout(type, 1200);

  /* ---------- Reveal Observer ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  function revealOnLoad() {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Skill & Language Bars ---------- */
  const fillBars = document.querySelectorAll('.skill__fill, .lang__fill');
  const fillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.dataset.level;
        setTimeout(() => { fill.style.width = level + '%'; }, 80);
        fillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  fillBars.forEach(f => fillObserver.observe(f));

  /* ---------- Magnetic Buttons ---------- */
  const magnetics = document.querySelectorAll('.magnetic');
  const STRONG = 0.35;

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * STRONG}px, ${y * STRONG}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- Copy To Clipboard ---------- */
  const copyButtons = document.querySelectorAll('.contact__copy');
  const toast = document.getElementById('toast');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      } catch {
        const ta = document.createElement('textarea');
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied to clipboard');
      }
    });
  });

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  /* ---------- Parallax On Hero Orb ---------- */
  const orb = document.querySelector('.hero__orb');
  if (orb) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---------- Active Nav Highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));

  /* ---------- Project/GitHub Card 3D Tilt ---------- */
  const tiltCards = document.querySelectorAll('.project, .github__card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Download CV Button Feedback ---------- */
  const downloadBtn = document.getElementById('downloadCvBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Preparing CV download...');
    });
  }

  /* ---------- Keyboard Accessibility ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

})();
