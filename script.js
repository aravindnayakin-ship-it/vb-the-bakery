/* ══════════════════════════════════════════════════════════════════
   VB THE BAKERY — script.js
   Features:
     • Sticky navbar (scrolled class + bg change)
     • Hamburger mobile menu toggle
     • Scroll-reveal animations (IntersectionObserver)
     • Scroll-to-top button
     • Active nav-link highlight on scroll
     • Smooth anchor clicks
     • Parallax hero text
     • Floating WhatsApp pulse
     • Gallery lightbox-style overlay
══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────
     1. STICKY NAVBAR
  ───────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load


  /* ─────────────────────────────────────────────────────
     2. HAMBURGER MOBILE MENU
  ───────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link, .nav-whatsapp').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ─────────────────────────────────────────────────────
     3. SCROLL-REVEAL ANIMATIONS
  ───────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────────────
     4. SCROLL-TO-TOP BUTTON
  ───────────────────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─────────────────────────────────────────────────────
     5. ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ─────────────────────────────────────────────────────
     6. SMOOTH ANCHOR SCROLL (override default jump)
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────────────
     7. HERO PARALLAX (subtle text depth on scroll)
  ───────────────────────────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight && heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.22}px)`;
      heroContent.style.opacity   = 1 - scrolled / (window.innerHeight * 0.75);
    }
  }, { passive: true });


  /* ─────────────────────────────────────────────────────
     8. FLOATING WHATSAPP – delayed appearance
  ───────────────────────────────────────────────────── */
  const floatingWA = document.getElementById('floating-whatsapp');

  setTimeout(() => {
    floatingWA.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease';
    floatingWA.style.opacity    = '1';
    floatingWA.style.transform  = 'scale(1)';
  }, 2800);

  floatingWA.style.opacity   = '0';
  floatingWA.style.transform = 'scale(0.5)';


  /* ─────────────────────────────────────────────────────
     9. PRODUCT CARD 3D TILT (desktop only)
  ───────────────────────────────────────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.product-card, .bs-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const cx      = rect.width  / 2;
        const cy      = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) *  6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }


  /* ─────────────────────────────────────────────────────
     10. COUNTER ANIMATION (Stats if added later)
  ───────────────────────────────────────────────────── */
  function animateCounter(el, end, duration = 2000) {
    let start     = 0;
    const step    = end / (duration / 16);
    const timer   = setInterval(() => {
      start += step;
      el.textContent = Math.floor(start);
      if (start >= end) {
        el.textContent = end;
        clearInterval(timer);
      }
    }, 16);
  }

  // Attach to any [data-counter] elements if present
  document.querySelectorAll('[data-counter]').forEach(el => {
    const counterObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseInt(el.dataset.counter));
        counterObs.unobserve(el);
      }
    }, { threshold: 0.6 });
    counterObs.observe(el);
  });


  /* ─────────────────────────────────────────────────────
     11. GALLERY ITEM LIGHTBOX-STYLE CLICK RIPPLE
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 6px; height: 6px;
        background: rgba(255,255,255,0.55);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        left: ${e.offsetX - 3}px;
        top:  ${e.offsetY - 3}px;
        z-index: 10;
      `;
      item.style.position = 'relative';
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject ripple keyframes
  const styleSheet = document.styleSheets[0];
  try {
    styleSheet.insertRule(`
      @keyframes rippleAnim {
        to { transform: scale(120); opacity: 0; }
      }
    `, styleSheet.cssRules.length);
  } catch (e) { /* cross-origin guard */ }


  /* ─────────────────────────────────────────────────────
     12. REVIEW CARD STAGGER ON SCROLL
  ───────────────────────────────────────────────────── */
  document.querySelectorAll('.review-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });


  /* ─────────────────────────────────────────────────────
     13. ACTIVE NAV LINK STYLE
  ───────────────────────────────────────────────────── */
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active {
      color: var(--gold-dark) !important;
      background: rgba(212, 175, 55, 0.1);
      border-radius: 8px;
    }
  `;
  document.head.appendChild(activeStyle);


  /* ─────────────────────────────────────────────────────
     14. PAGE LOAD FADE-IN
  ───────────────────────────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  /* ─────────────────────────────────────────────────────
     15. HERO CONTENT INITIAL ANIMATION
  ───────────────────────────────────────────────────── */
  const heroEl = document.querySelector('.hero-content');
  if (heroEl) {
    heroEl.style.opacity   = '0';
    heroEl.style.transform = 'translateY(30px)';
    heroEl.style.transition = 'opacity 1s ease 0.4s, transform 1s ease 0.4s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroEl.style.opacity   = '1';
        heroEl.style.transform = 'translateY(0)';
      });
    });
  }

});
