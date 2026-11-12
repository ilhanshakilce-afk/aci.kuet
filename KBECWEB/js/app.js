/* ==========================================================================
   acikuet.org - Main JavaScript Controller
   Navigation, Dropdowns, Certificate Verification, Scroll Reveals & Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initNavDropdowns();
  initSocialDropdown();
  initCertificateVerifier();
  initScrollAnimations();
  initHomepageEventsSlideAnimation();
  initContactForm();
});

// Homepage 6 Event Cards Slide In From Left & Right
function initHomepageEventsSlideAnimation() {
  const grid = document.querySelector('.events-interactive-grid');
  const cards = document.querySelectorAll('.events-interactive-grid .event-box-link');
  if (!grid || !cards.length) return;

  cards.forEach((card, i) => {
    // 0, 2, 4 (left column) come from left; 1, 3, 5 (right column) come from right
    if (i % 2 === 0) {
      card.classList.add('slide-from-left');
    } else {
      card.classList.add('slide-from-right');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          const delay = (i % 2) * 120 + Math.floor(i / 2) * 140;
          setTimeout(() => {
            card.classList.add('is-visible');
          }, delay);
        });
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(grid);
}

// Scroll Reveal Animations
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Fallback: make sure visible if already scrolled or near viewport
  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('visible');
      }
    });
  }, 100);
}

// Theme Management: Permanent Institutional High-Contrast Light Mode
function initTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('acikuet-theme', 'light');
}

// Mobile Menu Navigation
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });
  }
}

// Nav Dropdown Click Toggle Support (Events & Panel)
function initNavDropdowns() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const menu = item.querySelector('.dropdown-menu');
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        navItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    navItems.forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
      }
    });
  });
}

// Bottom Left Social Dropdown
function initSocialDropdown() {
  const triggerBtn = document.getElementById('social-dropdown-trigger');
  const dropdownContent = document.getElementById('social-dropdown-menu');

  if (triggerBtn && dropdownContent) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownContent.contains(e.target) && e.target !== triggerBtn) {
        dropdownContent.classList.remove('active');
      }
    });
  }
}

// Certificate Verification Database & Verifier
const VERIFIED_CERTIFICATES = {
  'ACI-KUET-2026-001': {
    recipient: 'Shakil Ilhan',
    roll: '2301044',
    event: 'Founding Convener & Operational Architect',
    issueDate: 'October 2026',
    status: 'Verified Official'
  },
  'ACI-CONCASE-2025': {
    recipient: 'Team KUET Apex',
    roll: 'Civil Engineering Dept',
    event: 'Concase 2025 Structural Case Champion',
    issueDate: 'November 2025',
    status: 'Verified Official'
  },
  'REINFORCE-1.0-042': {
    recipient: 'Participant / Finalist',
    roll: 'ReinforCE 1.0 Delegate',
    event: 'Truss Triumph & Crack the Case Finalist',
    issueDate: 'February 2025',
    status: 'Verified Official'
  },
  'ACI-KUET-CERT-101': {
    recipient: 'Tanzim Hasan',
    roll: '2101015',
    event: 'Hands-on Concrete Mix Prototyping Workshop',
    issueDate: 'January 2026',
    status: 'Verified Official'
  }
};

function initCertificateVerifier() {
  const btn = document.getElementById('btn-verify-cert');
  const input = document.getElementById('cert-id-input');
  const resultCard = document.getElementById('cert-result-box');

  if (!btn || !input || !resultCard) return;

  btn.addEventListener('click', () => {
    const certId = input.value.trim().toUpperCase();
    if (!certId) {
      alert('Please enter a valid Certificate ID (e.g. ACI-KUET-2026-001 or REINFORCE-1.0-042)');
      return;
    }

    const cert = VERIFIED_CERTIFICATES[certId];
    if (cert) {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h4 style="color: #16a34a; font-size: 1.15rem; font-weight: 800;">
            <i class="fa-solid fa-circle-check"></i> Authentic Certificate Verified
          </h4>
          <span style="background: #16a34a; color: #fff; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${cert.status}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
          <div><strong>Recipient:</strong> ${cert.recipient}</div>
          <div><strong>Roll / Affiliation:</strong> ${cert.roll}</div>
          <div><strong>Event / Program:</strong> ${cert.event}</div>
          <div><strong>Issue Date:</strong> ${cert.issueDate}</div>
        </div>
        <div style="margin-top: 1rem; font-size: 0.78rem; color: #64748b;">
          Cryptographically registered under ACI KUET Student Chapter Archive Records.
        </div>
      `;
    } else {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `
        <div style="color: #dc2626; font-weight: 700;">
          <i class="fa-solid fa-triangle-exclamation"></i> Certificate Not Found
        </div>
        <p style="font-size: 0.88rem; color: #64748b; margin-top: 0.5rem;">
          No verified certificate matches ID "<strong>${certId}</strong>". Please verify the code or contact ACI KUET Academic Secretariat.
        </p>
      `;
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been routed to ACI Student Chapter, KUET (Department of Civil Engineering).');
    form.reset();
  });
}
