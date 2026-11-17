/* ==========================================================================
   SANKALP CIVIL SERVICES ACADEMY — MAIN INTERACTION ENGINE (ES6)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Toast Notification System ---------- */
  function ensureToastContainer() {
    let container = document.querySelector('.academy-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'academy-toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function (message, iconClass = 'bi-check-circle-fill') {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'academy-toast';
    toast.innerHTML = `<i class="bi ${iconClass} text-gold fs-5"></i><span class="small fw-medium">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  };

  /* ---------- Theme & RTL Toggle ---------- */
  const savedTheme = localStorage.getItem('sankalp_theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function applyDirection(dir) {
    const isRtl = dir === 'rtl';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    const bsLink = document.querySelector('link[href*="bootstrap"][href*=".min.css"]');
    if (bsLink) {
      bsLink.href = isRtl
        ? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css'
        : 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    }
    const rtlBtn = document.getElementById('rtlToggleBtn');
    if (rtlBtn) {
      rtlBtn.innerHTML = '<i class="bi bi-arrows"></i>';
      rtlBtn.setAttribute('aria-label', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
      rtlBtn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
    }
  }

  const savedDir = localStorage.getItem('sankalp_dir') || 'ltr';
  applyDirection(savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    applyDirection(localStorage.getItem('sankalp_dir') || 'ltr');
    const rtlBtn = document.getElementById('rtlToggleBtn');
    if (rtlBtn) {
      rtlBtn.addEventListener('click', () => {
        const nextDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        localStorage.setItem('sankalp_dir', nextDir);
        applyDirection(nextDir);
        window.showToast(`Switched layout direction to ${nextDir.toUpperCase()}`);
      });
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      const updateIcon = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
        themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      };
      updateIcon();
      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('sankalp_theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('sankalp_theme', 'dark');
        }
        updateIcon();
      });
    }

    /* ---------- Sticky Navbar & Mobile Menu Auto-Close ---------- */
    const navbar = document.querySelector('.academy-navbar');
    const backToTop = document.getElementById('backToTopBtn');

    const onScroll = () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }
      if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 420);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const navCollapse = document.getElementById('academyNavMenu');
    if (navCollapse && window.bootstrap) {
      navCollapse.querySelectorAll('a.nav-link:not(.dropdown-toggle), a.dropdown-item, a.btn').forEach((link) => {
        link.addEventListener('click', () => {
          if (navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
            bsCollapse.hide();
          }
        });
      });
    }

    /* ---------- Scroll Reveal & SVG Path Animation ---------- */
    const revealEls = document.querySelectorAll('.reveal-on-scroll, .journey-curve-desktop');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains('journey-curve-desktop')) {
                entry.target.classList.add('in-view');
              } else {
                entry.target.classList.add('revealed');
              }
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('revealed', 'in-view'));
    }

    /* ---------- Animated Number Count-Ups ---------- */
    const counters = document.querySelectorAll('[data-countup]');
    if (counters.length && 'IntersectionObserver' in window) {
      const countObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-countup'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1500;
            const start = performance.now();

            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = target.toLocaleString('en-IN') + suffix;
              }
            };
            requestAnimationFrame(step);
            obs.unobserve(el);
          });
        },
        { threshold: 0.35 }
      );
      counters.forEach((c) => countObserver.observe(c));
    }

    /* ---------- Interactive S-Curve Journey Timeline ---------- */
    const journeyNodes = document.querySelectorAll('.journey-node');
    const spotYear = document.getElementById('journeySpotYear');
    const spotTitle = document.getElementById('journeySpotTitle');
    const spotDesc = document.getElementById('journeySpotDesc');

    if (journeyNodes.length && spotYear && spotTitle && spotDesc) {
      const activateNode = (node) => {
        journeyNodes.forEach((n) => n.classList.remove('active'));
        node.classList.add('active');
        spotYear.textContent = node.dataset.year || '';
        spotTitle.textContent = node.dataset.title || '';
        spotDesc.textContent = node.dataset.desc || '';
      };

      journeyNodes.forEach((node) => {
        node.addEventListener('click', () => activateNode(node));
        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateNode(node);
          }
        });
      });
    }

    /* ---------- Home 2 Interactive Program Tabs ---------- */
    const h2Tabs = document.querySelectorAll('[data-h2-tab]');
    const h2Panels = document.querySelectorAll('[data-h2-panel]');
    if (h2Tabs.length && h2Panels.length) {
      h2Tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-h2-tab');
          h2Tabs.forEach((t) => t.classList.remove('active'));
          h2Panels.forEach((p) => p.classList.add('d-none'));
          tab.classList.add('active');
          const panel = document.querySelector(`[data-h2-panel="${targetId}"]`);
          if (panel) panel.classList.remove('d-none');
        });
      });
    }

    /* ---------- Home 2 Hero Orbit Carousel Dots ---------- */
    const h2OrbitDots = document.querySelectorAll('.h2-orbit-dot');
    const h2OrbitImg = document.getElementById('h2OrbitImage');
    const h2OuterRing = document.querySelector('.h2-outer-gold-ring');
    if (h2OrbitDots.length && h2OrbitImg) {
      let orbitSlide = 0;
      const setOrbitSlide = (idx) => {
        orbitSlide = idx % h2OrbitDots.length;
        h2OrbitDots.forEach((d, i) => d.classList.toggle('active', i === orbitSlide));
        h2OrbitImg.style.transform = 'scale(1.06)';
        if (h2OuterRing) h2OuterRing.style.boxShadow = '0 0 28px rgba(213, 163, 61, 0.55)';
        setTimeout(() => {
          h2OrbitImg.style.transform = 'scale(1.03)';
          if (h2OuterRing) h2OuterRing.style.boxShadow = 'none';
        }, 380);
      };
      h2OrbitDots.forEach((dot) => {
        dot.addEventListener('click', () => {
          setOrbitSlide(parseInt(dot.getAttribute('data-h2-slide') || '0', 10));
        });
      });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => setOrbitSlide(orbitSlide + 1), 4500);
      }
    }

    /* ---------- Home 2 Interactive 6-Step Orbital Engine ---------- */
    const orbitNodes = Array.from(document.querySelectorAll('.engine-orbit-node'));
    if (orbitNodes.length) {
      let activeIdx = 0;
      const cPhase = document.getElementById('orbitCenterPhase');
      const cNum = document.getElementById('orbitCenterNum');
      const cLabel = document.getElementById('orbitCenterLabel');
      const dPhase = document.getElementById('orbitDetailPhase');
      const dStep = document.getElementById('orbitDetailStep');
      const dTitle = document.getElementById('orbitDetailTitle');
      const dDesc = document.getElementById('orbitDetailDesc');
      const dDeliv = document.getElementById('orbitDetailDeliverable');
      const prevOrbit = document.getElementById('orbitPrevBtn');
      const nextOrbit = document.getElementById('orbitNextBtn');

      const setOrbitStep = (idx) => {
        activeIdx = (idx + orbitNodes.length) % orbitNodes.length;
        const node = orbitNodes[activeIdx];
        orbitNodes.forEach((n, i) => n.classList.toggle('active', i === activeIdx));
        const step = node.dataset.step || '01';
        const phase = node.dataset.phase || '';
        if (cPhase) cPhase.textContent = phase.split('•')[0].trim();
        if (cNum) cNum.textContent = step;
        if (cLabel) cLabel.textContent = node.dataset.title || '';
        if (dPhase) dPhase.textContent = phase;
        if (dStep) dStep.textContent = `${step} / 06`;
        if (dTitle) dTitle.textContent = node.dataset.title || '';
        if (dDesc) dDesc.textContent = node.dataset.desc || '';
        if (dDeliv) dDeliv.textContent = node.dataset.deliverable || '';
      };

      orbitNodes.forEach((node, i) => {
        node.addEventListener('click', () => setOrbitStep(i));
      });
      if (prevOrbit) prevOrbit.addEventListener('click', () => setOrbitStep(activeIdx - 1));
      if (nextOrbit) nextOrbit.addEventListener('click', () => setOrbitStep(activeIdx + 1));
    }

    /* ---------- Programs Interactive Desk Planner Calendar ---------- */
    const deskDayBtns = document.querySelectorAll('.desk-day-btn');
    if (deskDayBtns.length) {
      const cBadge = document.getElementById('calActiveBadge');
      const cTitle = document.getElementById('calActiveTitle');
      const cMorn = document.getElementById('calActiveMorn');
      const cAft = document.getElementById('calActiveAft');
      const cEve = document.getElementById('calActiveEve');

      deskDayBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          deskDayBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          if (cBadge) cBadge.textContent = `${btn.dataset.calDay} • DAY ${btn.dataset.calNum}`;
          if (cTitle) cTitle.textContent = btn.dataset.calTitle || '';
          if (cMorn) cMorn.textContent = btn.dataset.calMorn || '';
          if (cAft) cAft.textContent = btn.dataset.calAft || '';
          if (cEve) cEve.textContent = btn.dataset.calEve || '';
        });
      });
    }

    /* ---------- About Page Interactive Core Values ---------- */
    const valBtns = document.querySelectorAll('.values-word-btn');
    if (valBtns.length) {
      const vTag = document.getElementById('valActiveTag');
      const vNum = document.getElementById('valActiveNum');
      const vTitle = document.getElementById('valActiveTitle');
      const vDesc = document.getElementById('valActiveDesc');
      const vPledge = document.getElementById('valActivePledge');

      valBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          valBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          if (vTag) vTag.textContent = btn.dataset.valTag || '';
          if (vNum) vNum.textContent = btn.dataset.valNum || '';
          if (vTitle) vTitle.textContent = btn.dataset.valTitle || '';
          if (vDesc) vDesc.textContent = btn.dataset.valDesc || '';
          if (vPledge) vPledge.textContent = btn.dataset.valPledge || '';
        });
      });
    }

    /* ---------- Campus Gallery Lightbox ---------- */
    const lightbox = document.getElementById('academyLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCap = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');

    if (lightbox && lightboxImg && galleryItems.length) {
      galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
          lightboxImg.src = item.getAttribute('data-lightbox-src');
          lightboxImg.alt = item.getAttribute('data-lightbox-caption') || 'Campus view';
          if (lightboxCap) lightboxCap.textContent = item.getAttribute('data-lightbox-caption') || '';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });

      const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      };
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
      });
    }

    /* ---------- Testimonials Slider ---------- */
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const slideCounter = document.getElementById('testimonialCounter');

    if (slides.length) {
      let currentSlide = 0;
      const showSlide = (idx) => {
        currentSlide = (idx + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        if (slideCounter) {
          slideCounter.textContent = `0${currentSlide + 1} / 0${slides.length}`;
        }
      };
      if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
      showSlide(0);
    }

    /* ---------- Password Visibility Toggle ---------- */
    document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('data-toggle-password'));
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    });

    /* ---------- Contact Form Validation (Frontend Demo) ---------- */
    const contactForm = document.getElementById('contactEnquiryForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const program = document.getElementById('contactProgram').value;
        const message = document.getElementById('contactMessage').value.trim();
        const feedback = document.getElementById('contactFeedback');

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneOk = /^[0-9+\-\s]{10,15}$/.test(phone);

        if (!name || !emailOk || !phoneOk || !program || message.length < 10) {
          feedback.className = 'alert alert-danger mt-3';
          feedback.textContent = 'Please complete all fields with a valid email, 10-digit phone number, and message (min 10 characters).';
          feedback.classList.remove('d-none');
          return;
        }

        feedback.className = 'alert alert-success mt-3';
        feedback.innerHTML = `<strong>Enquiry Submitted:</strong> Thank you, ${name}. Your enquiry for <em>${program}</em> has been received by our Academic Counselling Desk.`;
        feedback.classList.remove('d-none');
        window.showToast('Enquiry submitted successfully.');
        contactForm.reset();
      });
    }

    /* ---------- Demo Login Form ---------- */
    const loginForm = document.getElementById('aspirantLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredName = (document.getElementById('loginName')?.value || '').trim();
        const identifier = document.getElementById('loginIdentifier').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errBox = document.getElementById('loginError');

        if (!identifier || password.length < 6) {
          errBox.textContent = 'Enter a valid registered email/phone and password (minimum 6 characters).';
          errBox.classList.remove('d-none');
          return;
        }
        errBox.classList.add('d-none');
        const existing = JSON.parse(localStorage.getItem('sankalp_aspirant') || '{}');
        const user = {
          name: enteredName || existing.name || 'Aarav Kulkarni',
          email: identifier.includes('@') ? identifier : (existing.email || 'aarav.aspirant@sankalp.edu.in'),
          phone: !identifier.includes('@') ? identifier : (existing.phone || '+91 98100 45120'),
          program: existing.program || 'Integrated GS Foundation 2027',
          targetYear: existing.targetYear || 'UPSC CSE 2027'
        };
        localStorage.setItem('sankalp_aspirant', JSON.stringify(user));
        localStorage.setItem('sankalp_logged_in', 'true');
        window.showToast('Sign-in successful! Redirecting to Aspirant Dashboard...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 700);
      });
    }

    /* ---------- Demo Register Form ---------- */
    const registerForm = document.getElementById('aspirantRegisterForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const pass = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regConfirmPassword').value;
        const program = document.getElementById('regProgram').value;
        const terms = document.getElementById('regTerms').checked;
        const msgBox = document.getElementById('registerFeedback');

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10) {
          msgBox.className = 'alert alert-danger mt-3';
          msgBox.textContent = 'Please provide your full name, a valid email address, and a 10-digit mobile number.';
          msgBox.classList.remove('d-none');
          return;
        }
        if (pass.length < 6 || pass !== confirmPass) {
          msgBox.className = 'alert alert-danger mt-3';
          msgBox.textContent = 'Passwords must be at least 6 characters and match.';
          msgBox.classList.remove('d-none');
          return;
        }
        if (!program || !terms) {
          msgBox.className = 'alert alert-danger mt-3';
          msgBox.textContent = 'Please select a target program and accept the terms and conditions.';
          msgBox.classList.remove('d-none');
          return;
        }

        const user = { name, email, phone, program, targetYear: 'UPSC CSE 2027' };
        localStorage.setItem('sankalp_aspirant', JSON.stringify(user));
        localStorage.setItem('sankalp_logged_in', 'true');

        msgBox.className = 'alert alert-success mt-3';
        msgBox.innerHTML = `<strong>Registration Complete!</strong> Welcome, ${name}. Your aspirant account is ready. <a href="dashboard.html" class="fw-bold text-decoration-underline">Open Aspirant Dashboard</a>.`;
        msgBox.classList.remove('d-none');
        window.showToast('Registration complete!');
      });
    }

    /* ---------- Aspirant Dashboard Engine ---------- */
    const dashShell = document.querySelector('.dashboard-shell');
    if (dashShell) {
      initDashboard();
    }
  });

  function initDashboard() {
    const defaultUser = {
      name: 'Aarav Kulkarni',
      email: 'aarav.aspirant@sankalp.edu.in',
      phone: '+91 98100 45120',
      program: 'Integrated GS Foundation 2027',
      targetYear: 'UPSC CSE 2027'
    };
    const user = Object.assign({}, defaultUser, JSON.parse(localStorage.getItem('sankalp_aspirant') || '{}'));

    const syncUserUI = (u) => {
      document.querySelectorAll('[data-user-name]').forEach((el) => (el.textContent = u.name));
      document.querySelectorAll('[data-user-program]').forEach((el) => (el.textContent = u.program));
      const pName = document.getElementById('profName');
      const pEmail = document.getElementById('profEmail');
      const pPhone = document.getElementById('profPhone');
      const pProgram = document.getElementById('profProgram');
      const pYear = document.getElementById('profTargetYear');
      if (pName) pName.value = u.name;
      if (pEmail) pEmail.value = u.email;
      if (pPhone) pPhone.value = u.phone;
      if (pProgram) pProgram.value = u.program;
      if (pYear) pYear.value = u.targetYear;
    };
    syncUserUI(user);

    // Sidebar Panel Switching
    const navBtns = document.querySelectorAll('[data-dash-target]');
    const panels = document.querySelectorAll('.dash-panel');
    const dashOffcanvas = document.getElementById('dashSidebarOffcanvas');
    navBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-dash-target');
        if (target === 'logout') {
          localStorage.removeItem('sankalp_logged_in');
          window.showToast('Signed out successfully.');
          setTimeout(() => (window.location.href = 'login.html'), 600);
          return;
        }
        navBtns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanel = document.getElementById('panel-' + target);
        if (targetPanel) targetPanel.classList.add('active');
        if (dashOffcanvas && dashOffcanvas.classList.contains('show') && window.bootstrap) {
          bootstrap.Offcanvas.getOrCreateInstance(dashOffcanvas).hide();
        }
      });
    });

    // Study Materials Search & Filter
    const matSearch = document.getElementById('materialSearchInput');
    const matFilter = document.getElementById('materialSubjectFilter');
    const matItems = document.querySelectorAll('[data-material-item]');
    const filterMaterials = () => {
      const q = (matSearch ? matSearch.value : '').toLowerCase();
      const subj = matFilter ? matFilter.value : 'all';
      matItems.forEach((item) => {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const itemSubj = item.getAttribute('data-subject') || '';
        const matchText = title.includes(q);
        const matchSubj = subj === 'all' || itemSubj === subj;
        item.classList.toggle('d-none', !(matchText && matchSubj));
      });
    };
    if (matSearch) matSearch.addEventListener('input', filterMaterials);
    if (matFilter) matFilter.addEventListener('change', filterMaterials);

    // Profile Save Demo
    const profileForm = document.getElementById('dashProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          name: document.getElementById('profName').value.trim() || user.name,
          email: document.getElementById('profEmail').value.trim() || user.email,
          phone: document.getElementById('profPhone').value.trim() || user.phone,
          program: document.getElementById('profProgram').value,
          targetYear: document.getElementById('profTargetYear').value
        };
        localStorage.setItem('sankalp_aspirant', JSON.stringify(updated));
        syncUserUI(updated);
        window.showToast('Profile updated successfully.');
      });
    }

    // Functional Demo Mock Test Engine
    const startTestBtns = document.querySelectorAll('[data-start-mock]');
    const mockModalEl = document.getElementById('demoMockTestArea');
    const mockTitleEl = document.getElementById('mockActiveTitle');
    const mockTimerEl = document.getElementById('mockTimerDisplay');
    const mockQuestionsEl = document.getElementById('mockQuestionsContainer');
    const mockSubmitBtn = document.getElementById('submitMockTestBtn');
    const mockResultBox = document.getElementById('mockResultAlert');

    const sampleQuestions = [
      {
        q: 'Which Article of the Constitution of India empowers the Supreme Court to issue writs for the enforcement of Fundamental Rights?',
        options: ['Article 32', 'Article 136', 'Article 226', 'Article 143'],
        answer: 0
      },
      {
        q: 'With reference to the Monetary Policy Committee (MPC) in India, who chairs the committee ex-officio?',
        options: ['Union Finance Minister', 'Governor of the Reserve Bank of India', 'Chief Economic Adviser', 'Cabinet Secretary'],
        answer: 1
      },
      {
        q: 'The "Doctrine of Basic Structure" was propounded by the Supreme Court of India in which landmark judgment?',
        options: ['Golaknath Case (1967)', 'Minerva Mills Case (1980)', 'Kesavananda Bharati Case (1973)', 'Maneka Gandhi Case (1978)'],
        answer: 2
      },
      {
        q: 'Which Five-Year Plan in India was based on the Mahalanobis model emphasizing heavy industry?',
        options: ['First Plan', 'Second Plan', 'Third Plan', 'Fifth Plan'],
        answer: 1
      },
      {
        q: 'In the context of Indian Polity, a Money Bill can be introduced in:',
        options: ['Either House of Parliament', 'Lok Sabha only', 'Rajya Sabha only', 'Joint Sitting only'],
        answer: 1
      }
    ];

    let timerHandle = null;

    if (startTestBtns.length && mockModalEl) {
      startTestBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const testName = btn.getAttribute('data-start-mock');
          mockTitleEl.textContent = testName;
          mockModalEl.classList.remove('d-none');
          mockResultBox.classList.add('d-none');
          mockQuestionsEl.innerHTML = sampleQuestions
            .map(
              (item, idx) => `
              <div class="p-3 mb-3 rounded-3 border bg-white text-dark">
                <p class="fw-semibold mb-2">Q${idx + 1}. ${item.q}</p>
                ${item.options
                  .map(
                    (opt, oIdx) => `
                  <div class="form-check mb-1">
                    <input class="form-check-input" type="radio" name="mockQ${idx}" id="mockQ${idx}_${oIdx}" value="${oIdx}">
                    <label class="form-check-label" for="mockQ${idx}_${oIdx}">${opt}</label>
                  </div>`
                  )
                  .join('')}
              </div>`
            )
            .join('');

          clearInterval(timerHandle);
          let secondsLeft = 300;
          const renderTime = () => {
            const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
            const s = String(secondsLeft % 60).padStart(2, '0');
            mockTimerEl.textContent = `${m}:${s}`;
          };
          renderTime();
          timerHandle = setInterval(() => {
            secondsLeft--;
            renderTime();
            if (secondsLeft <= 0) {
              clearInterval(timerHandle);
              if (mockSubmitBtn) mockSubmitBtn.click();
            }
          }, 1000);
          mockModalEl.scrollIntoView({ behavior: 'smooth' });
        });
      });

      if (mockSubmitBtn) {
        mockSubmitBtn.addEventListener('click', () => {
          clearInterval(timerHandle);
          let score = 0;
          sampleQuestions.forEach((item, idx) => {
            const chosen = document.querySelector(`input[name="mockQ${idx}"]:checked`);
            if (chosen && parseInt(chosen.value, 10) === item.answer) score++;
          });
          const pct = Math.round((score / sampleQuestions.length) * 100);
          mockResultBox.className = 'alert alert-success mt-3';
          mockResultBox.innerHTML = `<strong>Test Evaluated:</strong> You scored <strong>${score} / ${sampleQuestions.length} (${pct}%)</strong>. Keep practising answer writing and Prelims elimination!`;
          mockResultBox.classList.remove('d-none');
          window.showToast(`Mock test submitted: ${score}/${sampleQuestions.length}`);
        });
      }
    }
  }
})();
