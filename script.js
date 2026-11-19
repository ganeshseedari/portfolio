/**
 * SEEDARI GANESH - PREMIUM PORTFOLIO JAVASCRIPT
 * Features:
 * - Dynamic Name Typing Animation
 * - Role Rotator / Typewriter Effect
 * - Interactive Particle Background Canvas
 * - Sticky Glassmorphic Navbar & Mobile Menu
 * - Animated Statistics Counter on Scroll
 * - Dynamic Project Filter System
 * - Contact Form Submission Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     THEME ACCENT COLOR SWITCHER
     ========================================================================== */
  const themeBtns = document.querySelectorAll('.theme-color-btn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'gold';

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio-theme', themeName);

    themeBtns.forEach((btn) => {
      if (btn.getAttribute('data-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Apply default or previously saved theme immediately
  applyTheme(savedTheme);

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');
      applyTheme(selectedTheme);
    });
  });

  /* ==========================================================================
     1. TYPING ANIMATION FOR "SEEDARI GANESH" & ROLES
     ========================================================================== */
  const nameElement = document.getElementById('typing-name');
  const nameCursor = document.getElementById('name-cursor');
  const roleElement = document.getElementById('typing-role');
  const roleCursor = document.getElementById('role-cursor');

  const fullName = 'SEEDARI GANESH';
  let nameCharIndex = 0;

  // Typewriter speed settings (ms)
  const typingSpeed = 95;
  const deletingSpeed = 45;
  const pauseBetweenRoles = 2000;

  // Roles to cycle through below the name
  const roles = [
    'Full-Stack Developer',
    'Creative UI/UX Craftsman',
    'Modern Web Engineer',
    'Problem Solver & Builder'
  ];

  let roleIndex = 0;
  let roleCharIndex = 0;
  let isDeletingRole = false;

  // Function to type out the user's name
  function typeName() {
    if (nameElement && nameCharIndex < fullName.length) {
      nameElement.textContent += fullName.charAt(nameCharIndex);
      nameCharIndex++;
      setTimeout(typeName, typingSpeed + Math.random() * 40);
    } else {
      if (nameCursor) {
        nameCursor.classList.add('cursor-finished');
      }
      setTimeout(typeRole, 400);
    }
  }

  // Function to cycle through roles with typing & deleting animation
  function typeRole() {
    if (!roleElement) return;
    const currentRole = roles[roleIndex];

    if (isDeletingRole) {
      roleElement.textContent = currentRole.substring(0, roleCharIndex - 1);
      roleCharIndex--;
    } else {
      roleElement.textContent = currentRole.substring(0, roleCharIndex + 1);
      roleCharIndex++;
    }

    let delay = isDeletingRole ? deletingSpeed : typingSpeed;

    if (!isDeletingRole && roleCharIndex === currentRole.length) {
      delay = pauseBetweenRoles;
      isDeletingRole = true;
    } else if (isDeletingRole && roleCharIndex === 0) {
      isDeletingRole = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500;
    }

    setTimeout(typeRole, delay);
  }

  // Start the name typing animation after a brief initial pause
  setTimeout(typeName, 500);

  /* ==========================================================================
     2. FLOATING AMBIENT PARTICLES CANVAS
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function getThemeColor(alpha) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'gold';
      switch (currentTheme) {
        case 'cyan': return `rgba(0, 242, 254, ${alpha})`;
        case 'emerald': return `rgba(16, 185, 129, ${alpha})`;
        case 'purple': return `rgba(168, 85, 247, ${alpha})`;
        case 'crimson': return `rgba(244, 63, 94, ${alpha})`;
        case 'gold':
        default:
          return `rgba(245, 158, 11, ${alpha})`;
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = getThemeColor(this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 70);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
      const maxDistance = 110;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacityValue = 1 - distance / maxDistance;
            ctx.strokeStyle = getThemeColor(opacityValue * 0.14);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     3. STICKY NAVBAR & ACTIVE NAV LINK HIGHLIGHT
     ========================================================================== */
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    // Header shadow & compact size on scroll
    if (window.scrollY > 40) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     5. STATS COUNTER ANIMATION (Hero & About)
     ========================================================================== */
  function countUp(el) {
    const target = +el.getAttribute('data-target');
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic function for smooth stop
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeOut * target);

      el.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateNumber);
  }

  // Count hero stats on load
  const heroStats = document.querySelectorAll('.hero-stats-row .stat-number');
  setTimeout(() => {
    heroStats.forEach(countUp);
  }, 450);

  // Count about stats on scroll
  const aboutSection = document.getElementById('about');
  const aboutStats = document.querySelectorAll('.about-stats-column .stat-number');
  let aboutStatsCounted = false;

  if (aboutSection && aboutStats.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !aboutStatsCounted) {
            aboutStatsCounted = true;
            aboutStats.forEach(countUp);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(aboutSection);
  }

  /* ==========================================================================
     6. PROJECT CATEGORY FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     7. CONTACT FORM SUBMISSION SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const messageVal = document.getElementById('message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        formFeedback.textContent = 'Please fill out all required fields.';
        formFeedback.style.color = '#ef4444';
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      // Simulate network request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${nameVal}</strong>! Your message has been sent successfully.`;

        setTimeout(() => {
          formFeedback.textContent = '';
        }, 6000);
      }, 1200);
    });
  }
});
