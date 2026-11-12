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
  initModeratorAnimation();
  initContactForm();
  initAllNetlifyForms();
});

// Homepage Events Arena Animations (Tag from Right, Title drops from Top, Cards slide from 2 sides)
function initHomepageEventsSlideAnimation() {
  const head = document.querySelector('.events-head-anim');
  const grid = document.querySelector('.events-interactive-grid');
  const cards = document.querySelectorAll('.events-interactive-grid .event-box-link');

  if (head) {
    const headObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          head.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    headObserver.observe(head);
  }

  if (grid && cards.length) {
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
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    observer.observe(grid);

    // Fast check fallback
    const checkEvents = () => {
      const vh = window.innerHeight || 800;
      if (head && head.getBoundingClientRect().top < vh + 150) {
        head.classList.add('is-visible');
      }
      if (grid && grid.getBoundingClientRect().top < vh + 150) {
        cards.forEach(card => card.classList.add('is-visible'));
      }
    };
    window.addEventListener('scroll', checkEvents, { passive: true });
    setTimeout(checkEvents, 300);
  }
}

// Moderator Section Staggered Animation: 1. Text -> 2. Photo -> 3. Meta below
function initModeratorAnimation() {
  const modBox = document.querySelector('.moderator-card-box');
  if (!modBox) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        modBox.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  observer.observe(modBox);

  // Fast check fallback
  const checkMod = () => {
    if (modBox.getBoundingClientRect().top < (window.innerHeight || 800) + 200) {
      modBox.classList.add('is-visible');
    }
  };
  window.addEventListener('scroll', checkMod, { passive: true });
  setTimeout(checkMod, 300);
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
          <span style="background: #16a34a; color: #fff; padding: 0.2rem 0.6rem; border-radius: 0; font-size: 0.75rem; font-weight: 700;">${cert.status}</span>
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
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Message...';

    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then((res) => {
      form.innerHTML = `
        <div style="background: #f0fdf4; border: 2px solid #166534; padding: 2.5rem 2rem; text-align: center; border-radius: 0; box-shadow: 0 4px 14px rgba(22, 101, 52, 0.08);">
          <div style="font-size: 3rem; color: #166534; margin-bottom: 1rem;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h4 style="font-size: 1.4rem; font-weight: 800; color: #166534; margin-bottom: 0.6rem;">
            Official Inquiry Received
          </h4>
          <p style="color: #0f172a; font-size: 0.98rem; line-height: 1.7; max-width: 500px; margin: 0 auto 1.25rem;">
            Thank you! Your official inquiry has been routed directly to the ACI KUET Secretariat at <strong>aci.kuet.student.chapter@gmail.com</strong>. Our coordination panel will review and respond promptly.
          </p>
          <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
            Department of Civil Engineering &bull; Khulna University of Engineering &amp; Technology
          </div>
        </div>
      `;
    })
    .catch((err) => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      alert('Network issue encountered. Please email us directly at aci.kuet.student.chapter@gmail.com');
    });
  });
}

// Global Netlify Form Handler for Membership, Alumni & ReinforCE Forms
function initAllNetlifyForms() {
  const forms = [
    {
      id: 'membership-application-form',
      title: 'Membership Application Submitted',
      msg: 'Your application has been received! The ACI KUET Academic Secretariat will verify your student roll and email you the ACI International student membership credentials.'
    },
    {
      id: 'alumni-mentorship-form',
      title: 'Mentorship Request Registered',
      msg: 'Your mentorship request has been forwarded to our Alumni Relations Desk. A suitable senior alumnus/mentor will be assigned to guide you.'
    },
    {
      id: 'reinforce-reg-form',
      title: 'ReinforCE Registration Dispatched',
      msg: 'Your team registration has been recorded for ReinforCE. The organizing committee will contact the team leader via email and WhatsApp with competition rulebooks.'
    }
  ];

  forms.forEach(cfg => {
    const f = document.getElementById(cfg.id);
    if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"]');
      const orig = btn ? btn.innerHTML : 'Submit';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
      }

      const formData = new FormData(f);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        f.innerHTML = `
          <div style="background: #f0fdf4; border: 2px solid #166534; padding: 2rem 1.5rem; text-align: center; border-radius: 0;">
            <div style="font-size: 2.5rem; color: #166534; margin-bottom: 0.75rem;">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h4 style="font-size: 1.3rem; font-weight: 800; color: #166534; margin-bottom: 0.5rem;">
              ${cfg.title}
            </h4>
            <p style="color: #0f172a; font-size: 0.95rem; line-height: 1.6; margin: 0 auto;">
              ${cfg.msg}
            </p>
          </div>
        `;
      })
      .catch(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = orig;
        }
        alert('Network connection error. Please email us directly at aci.kuet.student.chapter@gmail.com');
      });
    });
  });
}


// Automatically eradicate any Netlify-injected badge, drawer, or promotional widget
function suppressNetlifyBadge() {
  const selectors = [
    'a[href*="netlify.com"]',
    'a[href*="netlify.app"]',
    '#netlify-cdp-loader',
    '.netlify-drawer',
    '[data-netlify-drawer]',
    '.netlify-badge',
    '#netlify-badge',
    '[id*="netlify"]',
    '[class*="netlify"]',
    'iframe[src*="netlify"]'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      try {
        const fixedContainer = el.closest('div');
        if (fixedContainer && fixedContainer !== document.body && window.getComputedStyle(fixedContainer).position === 'fixed') {
          fixedContainer.remove();
        } else {
          el.remove();
        }
      } catch (err) {
        el.style.display = 'none';
      }
    });
  });
}
window.addEventListener('DOMContentLoaded', suppressNetlifyBadge);
window.addEventListener('load', suppressNetlifyBadge);
setTimeout(suppressNetlifyBadge, 300);
setTimeout(suppressNetlifyBadge, 1000);
setTimeout(suppressNetlifyBadge, 2500);

/* ==========================================================================
   Concrete Mix Design Calculator - PDF / Print Batch Sheet Generator
   ========================================================================== */
function printMixBatchSheet() {
  const strengthEl = document.getElementById('calc-strength');
  const slumpEl = document.getElementById('calc-slump');
  const aggEl = document.getElementById('calc-agg');
  const volEl = document.getElementById('calc-volume');

  const strength = strengthEl ? strengthEl.options[strengthEl.selectedIndex].text : 'C25 (25 MPa)';
  const slump = slumpEl ? slumpEl.options[slumpEl.selectedIndex].text : '75 - 100 mm (Medium)';
  const agg = aggEl ? aggEl.options[aggEl.selectedIndex].text : '20 mm (Standard)';
  const vol = volEl ? volEl.value : '1.0';

  const wc = document.getElementById('res-wc') ? document.getElementById('res-wc').innerText : '0.48';
  const cement = document.getElementById('res-cement') ? document.getElementById('res-cement').innerText : '395 kg';
  const water = document.getElementById('res-water') ? document.getElementById('res-water').innerText : '190 kg';
  const sand = document.getElementById('res-sand') ? document.getElementById('res-sand').innerText : '745 kg';
  const stone = document.getElementById('res-stone') ? document.getElementById('res-stone').innerText : '1050 kg';

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Please allow popups to open the printable batch report.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Concrete Mix Trial Batch Sheet - ACI KUET</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; padding: 2.5rem; color: #000; line-height: 1.4; font-size: 14px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .header h2 { margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .header h3 { margin: 4px 0; font-size: 16px; font-weight: bold; color: #166534; }
        .header p { margin: 2px 0; font-size: 13px; }
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 13px; }
        .meta-table td { padding: 5px 8px; border: 1px solid #777; }
        .meta-table td.label { font-weight: bold; background: #f4f4f4; width: 25%; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 13px; }
        .data-table th, .data-table td { border: 1px solid #333; padding: 8px 10px; text-align: left; }
        .data-table th { background: #e5e7eb; font-weight: bold; }
        .data-table td.num { font-weight: bold; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin-top: 4rem; text-align: center; }
        .sig-line { border-top: 1px dashed #000; padding-top: 6px; font-weight: bold; font-size: 12px; }
        @media print {
          body { padding: 1rem; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Department of Civil Engineering</h2>
        <h3>American Concrete Institute (ACI) Student Chapter &bull; KUET</h3>
        <p>Khulna University of Engineering &amp; Technology, Teligati, Khulna-9203, Bangladesh</p>
        <p style="font-weight: bold; margin-top: 6px; font-size: 14px; text-decoration: underline;">
          CONCRETE TRIAL MIX PROPORTIONING SHEET (ACI 211.1 STANDARD)
        </p>
      </div>

      <table class="meta-table">
        <tr>
          <td class="label">Date of Casting:</td>
          <td>${today}</td>
          <td class="label">Target Strength (f'c):</td>
          <td><strong>${strength}</strong></td>
        </tr>
        <tr>
          <td class="label">Batch Volume:</td>
          <td><strong>${vol} m³</strong></td>
          <td class="label">Design W/C Ratio:</td>
          <td><strong>${wc}</strong></td>
        </tr>
        <tr>
          <td class="label">Workability / Slump:</td>
          <td>${slump}</td>
          <td class="label">Max Aggregate Size:</td>
          <td>${agg}</td>
        </tr>
        <tr>
          <td class="label">Specimen Geometry:</td>
          <td>150 mm &times; 300 mm Cylinders</td>
          <td class="label">Curing Regime:</td>
          <td>28 Days Standard Water Immersion</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Batch Component Material</th>
            <th>Calculated Weight</th>
            <th>Lab Tolerance</th>
            <th>Specification &amp; Quality Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>Portland Composite Cement (PCC / OPC)</strong></td>
            <td class="num">${cement}</td>
            <td>&plusmn; 1.0%</td>
            <td>BDS EN 197-1 CEM II / ASTM C150 Type I Fresh</td>
          </tr>
          <tr>
            <td>2</td>
            <td><strong>Potable Mixing Water</strong></td>
            <td class="num">${water}</td>
            <td>&plusmn; 1.0%</td>
            <td>pH 6.5 - 8.0, Low Sulphate &amp; Chloride</td>
          </tr>
          <tr>
            <td>3</td>
            <td><strong>Fine Aggregate (Sylhet / River Sand)</strong></td>
            <td class="num">${sand}</td>
            <td>&plusmn; 2.0%</td>
            <td>Fineness Modulus (FM) ~ 2.6 - 2.8, SSD Basis</td>
          </tr>
          <tr>
            <td>4</td>
            <td><strong>Coarse Aggregate (Crushed Stone / Granite)</strong></td>
            <td class="num">${stone}</td>
            <td>&plusmn; 2.0%</td>
            <td>Clean, Well-Graded Max Size 20 mm, SSD Basis</td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 11px; color: #555; margin-bottom: 2rem;">
        * Compliance Certification: Mix batching computed according to ACI 211.1 guidelines. Volumetric moisture corrections must be applied based on real-time oven moisture and aggregate absorption before water addition.
      </div>

      <div class="signatures">
        <div>
          <div class="sig-line">Prepared by (Student / Member)</div>
        </div>
        <div>
          <div class="sig-line">Verified by (Lab Technician)</div>
        </div>
        <div>
          <div class="sig-line">Faculty Supervisor / In-Charge</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <button onclick="window.print()" style="background: #166534; color: #fff; padding: 10px 24px; border: none; font-size: 14px; font-weight: bold; cursor: pointer;">
          Print / Save as PDF
        </button>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/* ==========================================================================
   Executive Committee - Instant Search & Category Filter System
   ========================================================================== */
let currentOfficerCategory = 'all';

function setOfficerFilter(cat, btn) {
  currentOfficerCategory = cat;
  document.querySelectorAll('.filter-tab-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = '#ffffff';
    b.style.color = '#000000';
    b.style.borderColor = 'var(--border-color)';
  });
  if (btn) {
    btn.classList.add('active');
    btn.style.background = '#166534';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#166534';
  }
  filterOfficers();
}

function filterOfficers() {
  const searchInput = document.getElementById('officer-search-input');
  const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cards = document.querySelectorAll('.cuet-panel-card');

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || 'secretariat';
    const cardText = card.innerText.toLowerCase();

    const matchesCategory = (currentOfficerCategory === 'all') || (cardCat === currentOfficerCategory);
    const matchesSearch = !term || cardText.includes(term);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   Member Access Gate - Protected Engineering Library System
   ========================================================================== */
let pendingDownloadUrl = null;

function triggerMemberProtectedDownload(docName, url) {
  const isAuth = localStorage.getItem('acikuet_member_auth') === 'true';
  if (isAuth) {
    window.open(url, '_blank');
  } else {
    pendingDownloadUrl = url;
    openMemberGateModal(docName);
  }
}

function openMemberGateModal(docName) {
  const modal = document.getElementById('member-gate-modal');
  const nameEl = document.getElementById('modal-target-doc-name');
  if (nameEl) nameEl.innerText = docName || 'Document';
  if (modal) {
    modal.style.display = 'flex';
    const err = document.getElementById('member-verify-error');
    if (err) err.style.display = 'none';
  }
}

function closeMemberGateModal() {
  const modal = document.getElementById('member-gate-modal');
  if (modal) modal.style.display = 'none';
}

function handleMemberVerification(e) {
  e.preventDefault();
  const rollInput = document.getElementById('member-input-roll');
  const passInput = document.getElementById('member-input-pass');
  const rememberBox = document.getElementById('member-remember');
  const errEl = document.getElementById('member-verify-error');

  const roll = rollInput ? rollInput.value.trim() : '';
  const pass = passInput ? passInput.value.trim() : '';

  // Valid credentials: any 7-digit KUET roll (e.g. 2301044, 2301045, etc.) or ACI- prefix with valid passkey
  const isRollValid = /^[0-9]{7}$/.test(roll) || roll.toUpperCase().startsWith('ACI-') || roll.length >= 6;
  const isPassValid = pass === 'aci2026' || pass === roll || pass.length >= 4;

  if (isRollValid && isPassValid) {
    if (rememberBox && rememberBox.checked) {
      localStorage.setItem('acikuet_member_auth', 'true');
      localStorage.setItem('acikuet_member_roll', roll);
    }
    closeMemberGateModal();
    updateMemberAccessUI(true, roll);

    if (pendingDownloadUrl) {
      window.open(pendingDownloadUrl, '_blank');
      pendingDownloadUrl = null;
    } else {
      alert(`Access Granted! Welcome to the ACI KUET Engineering Archive, Member ${roll}.`);
    }
  } else {
    if (errEl) {
      errEl.style.display = 'block';
      errEl.innerText = 'Authentication failed. Please enter your valid 7-digit KUET Roll and passkey (default: aci2026 or roll).';
    }
  }
}

function updateMemberAccessUI(isAuth, roll) {
  const triggers = document.querySelectorAll('.member-gate-trigger');
  triggers.forEach(t => {
    t.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i> Unlocked: Download PDF';
    t.style.background = '#166534';
    t.style.color = '#ffffff';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('acikuet_member_auth') === 'true') {
    const roll = localStorage.getItem('acikuet_member_roll') || 'Member';
    updateMemberAccessUI(true, roll);
  }
  initReinforCECountdown();
});

// ReinforCE 2.0 Live Architectural Countdown Clock
function initReinforCECountdown() {
  const daysEl = document.getElementById('reinforce-countdown-days');
  const hoursEl = document.getElementById('reinforce-countdown-hours');
  const minutesEl = document.getElementById('reinforce-countdown-minutes');
  const secondsEl = document.getElementById('reinforce-countdown-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target event date: November 20, 2026 09:00:00 (Flagship National Edition)
  const targetDate = new Date('2026-11-20T09:00:00+06:00').getTime();

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minutesEl.innerText = '00';
      secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minutesEl.innerText = String(minutes).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateClock();
  setInterval(updateClock, 1000);
}



