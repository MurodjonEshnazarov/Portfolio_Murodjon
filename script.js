document.addEventListener('DOMContentLoaded', () => {
    // --- header height CSS variable for scroll offset ---
    const header = document.querySelector('header');
    function setHeaderHeightVar() {
      const h = header ? header.getBoundingClientRect().height : 72;
      document.documentElement.style.setProperty('--header-height', `${Math.round(h)}px`);
    }
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);
  
    // --- Elements ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section, section');
    const darkToggle = document.getElementById('darkModeToggle');
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
  
    // --- IntersectionObserver to highlight active nav link ---
    if (sections.length && navLinks.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = document.querySelector(`.nav-link[href="#${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            // remove active on all then set
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            localStorage.setItem('activeSection', id);
          }
        });
      }, { threshold: 0.56 });
  
      sections.forEach(s => observer.observe(s));
    }
  
    // --- Nav link clicks: smooth scroll + close mobile menu ---
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        if (!target) return;
  
        // close mobile menu (if open)
        if (navLinksContainer.classList.contains('open')) {
          navLinksContainer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
  
        // smooth scroll
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        localStorage.setItem('activeSection', targetId);
      });
    });
  
    // restore last active section (on load)
    const last = localStorage.getItem('activeSection');
    if (last) {
      const el = document.getElementById(last);
      if (el) {
        // allow layout to settle
        setTimeout(() => el.scrollIntoView({ behavior: 'auto', block: 'start' }), 60);
      }
    }
  
    // --- Dark mode (persist) ---
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.body.classList.add('dark');
        darkToggle.textContent = '☀️';
        darkToggle.setAttribute('aria-pressed', 'true');
      } else {
        document.body.classList.remove('dark');
        darkToggle.textContent = '🌙';
        darkToggle.setAttribute('aria-pressed', 'false');
      }
    }
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
  
    if (darkToggle) {
      darkToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        applyTheme(isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  
    // --- Hamburger toggle ---
    if (hamburger && navLinksContainer) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });
  
      // close when clicking any link inside mobile menu
      navLinksContainer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (navLinksContainer.classList.contains('open')) {
            navLinksContainer.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  
    // --- Contact form submission to Formspree (AJAX) ---
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contactForm.action) return;
  
        formMessage.textContent = '';
        try {
          const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
          });
  
          if (res.ok) {
            formMessage.textContent = 'Message sent successfully! ✅';
            contactForm.reset();
            setTimeout(() => formMessage.textContent = '', 5000);
          } else {
            const data = await res.json().catch(() => ({}));
            formMessage.textContent = data.error || 'Submission failed — please try again.';
          }
        } catch (err) {
          formMessage.textContent = 'Network error — could not send message.';
        }
      });
    }
  });
  const legoModal = document.getElementById('legoModal');
const viewLegoBtn = document.getElementById('viewLegoPhotos');
const closeBtn = legoModal.querySelector('.close');

viewLegoBtn.addEventListener('click', () => {
  legoModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  legoModal.style.display = 'none';
});

// Close modal if user clicks outside content
window.addEventListener('click', (e) => {
  if (e.target === legoModal) {
    legoModal.style.display = 'none';
  }
});
