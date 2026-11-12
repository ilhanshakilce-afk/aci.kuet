/**
 * ACI-KUET Civil Engineering & Building Estimation Knowledge Base & Document Registry
 * Portal Controller & Client-Side Interactive Engine
 * 95 Official Government Documents • PWD SoR 2022 • BNBC 2020 • ACI 318-19 • CPTU PPR 2008
 */

(function () {
  'use strict';

  // Master Document Registry Store
  const docs = window.ACI_KUET_DOCUMENTS || [];

  // State Management
  const state = {
    activeRoute: 'overview', // 'overview', 'codes', 'rates', 'planning', 'clearances', 'estimator'
    searchQuery: '',
    selectedAuthority: 'ALL',
    selectedGroup: 'ALL',
    rateCategory: 'ALL' // 'ALL', 'PWD-CIVIL', 'PWD-EM', 'LGED', 'RHD'
  };

  // Authority Color Palette
  const authorityColors = {
    'Public Works Department (PWD)': { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
    'RAJUK': { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
    'RAJUK / MoHPW': { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
    'MoHPW / RAJUK': { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
    'Department of Environment (DoE)': { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
    'DoE / MoEFCC': { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
    'FSCD / Ministry of Home Affairs': { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
    'Local Government Engineering Department (LGED)': { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },
    'Roads and Highways Department (RHD)': { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' },
    'MoHPW / National Assembly': { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
    'Housing and Building Research Institute (HBRI)': { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    'Ministry of Housing and Public Works': { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
    'Central Procurement Technical Unit (CPTU) / IMED': { bg: '#e0e7ff', text: '#4338ca', border: '#a5b4fc' },
    'National Parliament of Bangladesh': { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
    'Chittagong Development Authority (CDA)': { bg: '#fae8ff', text: '#86198f', border: '#f0abfc' },
    'National Parliament / CDA': { bg: '#fae8ff', text: '#86198f', border: '#f0abfc' },
    'Khulna Development Authority (KDA)': { bg: '#cffafe', text: '#0e7490', border: '#67e8f9' },
    'Local Government Division (LGD)': { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' }
  };

  // Route Definitions
  const routeCategoryMap = {
    'codes': ['Codes & Standards'],
    'rates': ['Estimating & Rates', 'PWD Civil Chapters', 'PWD E/M Subheads'],
    'planning': ['Planning & Approval', 'Procurement & Law'],
    'clearances': ['Fire & Environmental']
  };

  // DOM Elements Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initRouting();
    initSearchAndFilter();
    initEstimator();
    initModal();
    handleHashChange();
  });

  // Routing Handler
  function initRouting() {
    window.addEventListener('hashchange', handleHashChange);

    const navButtons = document.querySelectorAll('.est-nav-tab');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = btn.getAttribute('data-route');
        window.location.hash = route;
      });
    });
  }

  function handleHashChange() {
    let hash = window.location.hash.replace('#', '') || 'overview';
    const validRoutes = ['overview', 'codes', 'rates', 'planning', 'clearances', 'estimator'];
    if (!validRoutes.includes(hash)) hash = 'overview';

    state.activeRoute = hash;

    // Update Tab Styles
    document.querySelectorAll('.est-nav-tab').forEach(tab => {
      if (tab.getAttribute('data-route') === hash) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Toggle Views
    const overviewView = document.getElementById('view-overview');
    const catalogView = document.getElementById('view-catalog');
    const estimatorView = document.getElementById('view-estimator');

    if (hash === 'overview') {
      overviewView.style.display = 'block';
      catalogView.style.display = 'none';
      estimatorView.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash === 'estimator') {
      overviewView.style.display = 'none';
      catalogView.style.display = 'none';
      estimatorView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      overviewView.style.display = 'none';
      catalogView.style.display = 'block';
      estimatorView.style.display = 'none';
      updateCatalogSectionHeader(hash);
      renderDocuments();
    }
  }

  function updateCatalogSectionHeader(route) {
    const titles = {
      'codes': {
        title: 'National Building Codes & Structural Standards',
        bn: 'বাংলাদেশ জাতীয় বিল্ডিং কোড (BNBC), পিডব্লিউডি স্ট্যান্ডার্ড স্পেসিফিকেশন ও কোড অব প্র্যাকটিস',
        desc: 'Statutory design guidelines, live/dead load combinations, seismic coefficients, concrete mix quality specifications, and structural assessment manuals.'
      },
      'rates': {
        title: 'Government Schedule of Rates (Civil & Electro-Mechanical)',
        bn: 'গণপূর্ত (PWD) সিভিল ৩৩টি অধ্যায়, ই/এম ২৫টি সাবহেড, এলজিইডি ও আরএইচডি রেট শিডিউল',
        desc: 'Official 2022 PWD Schedule of Rates (2nd Revised Latest), Civil Chapters 01-33, E/M Subheads 01-21, 2026 Lift/Escalator rates, LGED and RHD highway rates.'
      },
      'planning': {
        title: 'Land Planning, Approval Bylaws & Procurement Acts',
        bn: 'রাজউক ইমারত বিধিমালা ২০০৮/২০২৫, ড্যাপ ২০১৬-২০৩৫, পৌরসভা, সিডিএ, কেডিএ ও পিপিআর ২০০৮',
        desc: 'Mandatory FAR, MGC, setback requirements, road widths, metropolitan zoning grids, Pourashabha rules, and Public Procurement Act & Rules.'
      },
      'clearances': {
        title: 'Fire Safety & Environmental Statutory Clearances',
        bn: 'ফায়ার সার্ভিস ও পরিবেশ অধিদপ্তর (DoE) সরকারি ছাড়পত্র, ইসিআর ২০২৩ ও বায়ু/বর্জ্য বিধিমালা',
        desc: 'Statutory fire plan approvals, hydrants, down-comers, DoE building clearance guidelines, ETP/STP thresholds, dust suppression, and waste management.'
      }
    };

    const header = titles[route] || { title: 'Civil Engineering Documents Registry', bn: '', desc: '' };
    const titleEl = document.getElementById('catalog-title');
    const bnEl = document.getElementById('catalog-bn-title');
    const descEl = document.getElementById('catalog-desc');

    if (titleEl) titleEl.innerText = header.title;
    if (bnEl) bnEl.innerText = header.bn;
    if (descEl) descEl.innerText = header.desc;

    // Show/hide rate sub-tabs for 'rates' route
    const rateSubTabs = document.getElementById('rates-sub-filters');
    if (rateSubTabs) {
      rateSubTabs.style.display = (route === 'rates') ? 'flex' : 'none';
    }
  }

  // Search & Filter Initialization
  function initSearchAndFilter() {
    const searchInput = document.getElementById('doc-search-input');
    const clearBtn = document.getElementById('doc-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        if (clearBtn) clearBtn.style.display = state.searchQuery ? 'block' : 'none';
        renderDocuments();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        state.searchQuery = '';
        clearBtn.style.display = 'none';
        renderDocuments();
      });
    }

    // Authority filter buttons
    const authPills = document.querySelectorAll('.auth-pill');
    authPills.forEach(pill => {
      pill.addEventListener('click', () => {
        authPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedAuthority = pill.getAttribute('data-auth') || 'ALL';
        renderDocuments();
      });
    });

    // Rate Sub-tabs (when on Rates route)
    const ratePills = document.querySelectorAll('.rate-sub-pill');
    ratePills.forEach(pill => {
      pill.addEventListener('click', () => {
        ratePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.rateCategory = pill.getAttribute('data-rate-sub') || 'ALL';
        renderDocuments();
      });
    });
  }

  // Filter Document Collection
  function getFilteredDocuments() {
    let list = docs;

    // 1. Filter by Active Route
    if (state.activeRoute !== 'overview' && state.activeRoute !== 'estimator') {
      const allowedGroups = routeCategoryMap[state.activeRoute] || [];
      list = list.filter(d => allowedGroups.includes(d.group));
    }

    // 2. Filter by Rates Sub-Category
    if (state.activeRoute === 'rates' && state.rateCategory !== 'ALL') {
      if (state.rateCategory === 'PWD-CIVIL') {
        list = list.filter(d => d.group === 'PWD Civil Chapters' || d.id === 'SOR-CIV-MASTER' || d.id === 'SOR-RETROFIT');
      } else if (state.rateCategory === 'PWD-EM') {
        list = list.filter(d => d.group === 'PWD E/M Subheads' || d.id === 'SOR-EM-MASTER' || d.id === 'SOR-EM-LIFT-2026');
      } else if (state.rateCategory === 'LGED') {
        list = list.filter(d => d.id.includes('LGED'));
      } else if (state.rateCategory === 'RHD') {
        list = list.filter(d => d.id.includes('RHD'));
      }
    }

    // 3. Filter by Authority
    if (state.selectedAuthority !== 'ALL') {
      const auth = state.selectedAuthority;
      list = list.filter(d => {
        if (auth === 'PWD') return d.authority.includes('PWD') || d.authority.includes('Public Works');
        if (auth === 'RAJUK') return d.authority.includes('RAJUK');
        if (auth === 'DOE') return d.authority.includes('DoE') || d.authority.includes('Environment');
        if (auth === 'LGED') return d.authority.includes('LGED') || d.authority.includes('Local Government Engineering');
        if (auth === 'RHD') return d.authority.includes('RHD') || d.authority.includes('Roads and Highways');
        if (auth === 'FSCD') return d.authority.includes('FSCD') || d.authority.includes('Fire');
        if (auth === 'MOHPW') return d.authority.includes('MoHPW') || d.authority.includes('Housing and Public Works');
        if (auth === 'REGIONAL') return d.authority.includes('CDA') || d.authority.includes('KDA') || d.authority.includes('LGD');
        if (auth === 'CPTU') return d.authority.includes('CPTU') || d.authority.includes('IMED') || d.authority.includes('Parliament');
        return true;
      });
    }

    // 4. Text Search Query
    if (state.searchQuery) {
      const q = state.searchQuery;
      list = list.filter(d => {
        return (
          d.title_en.toLowerCase().includes(q) ||
          d.title_bn.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.authority.toLowerCase().includes(q) ||
          d.scope.toLowerCase().includes(q) ||
          d.rate_application.toLowerCase().includes(q) ||
          d.filename.toLowerCase().includes(q) ||
          d.group.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }

  // Render Document Cards
  function renderDocuments() {
    const grid = document.getElementById('document-grid');
    const counter = document.getElementById('results-counter');
    if (!grid) return;

    const filtered = getFilteredDocuments();

    if (counter) {
      counter.innerText = `Showing ${filtered.length} of ${docs.length} Official Government Documents`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border: 2px dashed #cbd5e1;">
          <i class="fa-solid fa-file-circle-xmark" style="font-size: 3rem; color: #94a3b8; margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: #000000; margin-bottom: 0.5rem;">No Matching Documents Found</h3>
          <p style="color: #64748b; font-size: 1rem; max-width: 500px; margin: 0 auto 1.5rem;">
            No government codes or rate schedules matched your search query "${state.searchQuery}". Try searching for keywords like "RCC", "Beam", "DAP", "BNBC", "Pile", or "Tile".
          </p>
          <button class="btn-clear-search" onclick="document.getElementById('doc-search-clear').click();" style="background: #166534; color: #ffffff; border: 2px solid #000000; padding: 0.65rem 1.5rem; font-weight: 700; cursor: pointer;">
            Reset Search Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(d => {
      const authStyle = authorityColors[d.authority] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };

      return `
        <article class="doc-card" id="card-${d.id}" data-id="${d.id}">
          <div class="doc-card-header">
            <span class="doc-auth-badge" style="background: ${authStyle.bg}; color: ${authStyle.text}; border: 1px solid ${authStyle.border};">
              <i class="fa-solid fa-landmark"></i> ${escapeHTML(d.authority)}
            </span>
            <span class="doc-size-badge">
              <i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> ${d.size_str}
            </span>
          </div>

          <div class="doc-card-body">
            <div class="doc-item-id">${d.id} • ${escapeHTML(d.group)}</div>
            <h3 class="doc-title-en">${escapeHTML(d.title_en)}</h3>
            <div class="doc-title-bn">${escapeHTML(d.title_bn)}</div>

            <div class="doc-scope-box">
              <strong>Technical Scope:</strong> ${escapeHTML(d.scope)}
            </div>

            <div class="doc-rate-box">
              <strong>Rate &amp; BOQ Application:</strong> ${escapeHTML(d.rate_application)}
            </div>
          </div>

          <div class="doc-card-actions">
            <a href="${d.source_url}" target="_blank" rel="noopener noreferrer" class="btn-doc-download">
              <i class="fa-solid fa-cloud-arrow-down"></i> Official Gazette / Cloud PDF
            </a>
            <button type="button" class="btn-doc-detail" onclick="window.openDocModal('${d.id}')">
              <i class="fa-solid fa-circle-nodes"></i> Connections &amp; Specs
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Document Detail Modal System
  function initModal() {
    window.openDocModal = function (docId) {
      const doc = docs.find(d => d.id === docId);
      if (!doc) return;

      const modal = document.getElementById('doc-modal');
      const content = document.getElementById('doc-modal-content');
      if (!modal || !content) return;

      const authStyle = authorityColors[doc.authority] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };

      // Render connected documents tags
      const connectedHtml = (doc.connections && doc.connections.length > 0)
        ? doc.connections.map(c => {
          return `<span class="modal-conn-tag" onclick="window.filterByConnection('${escapeHTML(c)}')"><i class="fa-solid fa-link"></i> ${escapeHTML(c)}</span>`;
        }).join('')
        : '<span style="color: #64748b; font-style: italic;">No specific cross-connections indexed.</span>';

      content.innerHTML = `
        <div class="modal-header-banner">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
            <span class="doc-auth-badge" style="background: ${authStyle.bg}; color: ${authStyle.text}; border: 1px solid ${authStyle.border};">
              <i class="fa-solid fa-landmark"></i> ${escapeHTML(doc.authority)}
            </span>
            <span class="doc-size-badge" style="font-size: 0.9rem;">
              <i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> ${doc.size_str}
            </span>
          </div>
          <h2 style="font-family: 'Merriweather', serif; font-size: 1.6rem; font-weight: 900; color: #000000; margin-bottom: 0.35rem; line-height: 1.3;">
            ${escapeHTML(doc.title_en)}
          </h2>
          <div style="font-size: 1.1rem; font-weight: 700; color: #166534; margin-bottom: 0.75rem;">
            ${escapeHTML(doc.title_bn)}
          </div>
          <div style="font-family: 'Space Mono', monospace; font-size: 0.82rem; color: #475569; background: #f8fafc; padding: 0.4rem 0.75rem; border: 1px solid #e2e8f0; display: inline-block;">
            Item ID: <strong>${doc.id}</strong> | Directory: ${escapeHTML(doc.category)}
          </div>
        </div>

        <div class="modal-body-content" style="padding: 1.5rem 0;">
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #000000; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fa-solid fa-compass-drafting" style="color: #166534;"></i> Technical Scope &amp; Applicable Clauses
            </h4>
            <p style="font-size: 0.98rem; line-height: 1.7; color: #1e293b; background: #f8fafc; padding: 1.25rem; border-left: 4px solid #166534; border: 1px solid #e2e8f0; border-left-width: 4px;">
              ${escapeHTML(doc.scope)}
            </p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #000000; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fa-solid fa-calculator" style="color: #166534;"></i> Rate Analysis &amp; BOQ Connection
            </h4>
            <p style="font-size: 0.98rem; line-height: 1.7; color: #1e293b; background: #f0fdf4; padding: 1.25rem; border-left: 4px solid #15803d; border: 1px solid #bbf7d0; border-left-width: 4px;">
              ${escapeHTML(doc.rate_application)}
            </p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #000000; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fa-solid fa-diagram-project" style="color: #166534;"></i> Interconnected Government Documents (${doc.connections.length})
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${connectedHtml}
            </div>
          </div>
        </div>

        <div class="modal-footer-actions" style="border-top: 2px solid #000000; padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="${doc.source_url}" target="_blank" rel="noopener noreferrer" class="btn-doc-download" style="padding: 0.85rem 1.75rem; font-size: 1.05rem;">
            <i class="fa-solid fa-cloud-arrow-down"></i> Download Official Gazette PDF
          </a>
          <button type="button" class="btn-modal-close" onclick="window.closeDocModal()" style="background: #ffffff; color: #000000; border: 2px solid #000000; padding: 0.85rem 1.5rem; font-weight: 800; cursor: pointer;">
            Close Window
          </button>
        </div>
      `;

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    window.closeDocModal = function () {
      const modal = document.getElementById('doc-modal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    window.filterByConnection = function (connFilename) {
      window.closeDocModal();
      const searchInput = document.getElementById('doc-search-input');
      const cleanName = connFilename.replace('.pdf', '').replace(/_/g, ' ');
      if (searchInput) {
        searchInput.value = cleanName;
        state.searchQuery = cleanName.toLowerCase();
        // If on overview or estimator, switch to codes or rates
        if (state.activeRoute === 'overview' || state.activeRoute === 'estimator') {
          window.location.hash = 'rates';
        } else {
          renderDocuments();
        }
      }
    };
  }

  // ACI-KUET G+3 Building BOQ Estimator Engine
  function initEstimator() {
    const sftInput = document.getElementById('est-input-sft');
    const storiesInput = document.getElementById('est-input-stories');
    const steelInput = document.getElementById('est-input-steel-price');
    const cementInput = document.getElementById('est-input-cement-price');
    const stoneInput = document.getElementById('est-input-stone-price');
    const sandInput = document.getElementById('est-input-sand-price');
    const brickInput = document.getElementById('est-input-brick-price');

    const inputs = [sftInput, storiesInput, steelInput, cementInput, stoneInput, sandInput, brickInput];
    inputs.forEach(inp => {
      if (inp) {
        inp.addEventListener('input', recalculateEstimate);
      }
    });

    recalculateEstimate();
  }

  function recalculateEstimate() {
    const sft = parseFloat(document.getElementById('est-input-sft')?.value) || 8406;
    const stories = parseInt(document.getElementById('est-input-stories')?.value) || 4;
    const steelPrice = parseFloat(document.getElementById('est-input-steel-price')?.value) || 94500;
    const cementPrice = parseFloat(document.getElementById('est-input-cement-price')?.value) || 530;
    const stonePrice = parseFloat(document.getElementById('est-input-stone-price')?.value) || 220;
    const sandPrice = parseFloat(document.getElementById('est-input-sand-price')?.value) || 55;
    const brickPrice = parseFloat(document.getElementById('est-input-brick-price')?.value) || 12.5;

    // Consumption Factors (Derived from KUET Standard G+3 Model per Sft)
    const steelTons = (sft * 3.551) / 1000;
    const cementBags = Math.round(sft * 0.3747);
    const stoneCft = Math.round(sft * 1.368);
    const sandSylhetCft = Math.round(sft * 0.9338);
    const sandLocalCft = Math.round(sft * 1.118);
    const bricksNos = Math.round(sft * 5.056);
    const tilesSft = Math.round(sft * 1.1765);

    // Cost Breakdown Components
    const steelCost = steelTons * steelPrice;
    const cementCost = cementBags * cementPrice;
    const stoneCost = stoneCft * stonePrice;
    const sandCost = (sandSylhetCft * sandPrice) + (sandLocalCft * (sandPrice * 0.55));
    const brickCost = bricksNos * brickPrice;
    const tilesCost = tilesSft * 165.0; // standard benchmark per sft
    const doorsWindowsCost = (sft / 8406) * 2400000;
    const plumbingCost = (sft / 8406) * 2850000;
    const laborMasonryElecCost = (sft / 8406) * 6000000;

    // Total Direct Cost
    const totalDirectCost = steelCost + cementCost + stoneCost + sandCost + brickCost + tilesCost + doorsWindowsCost + plumbingCost + laborMasonryElecCost;

    // Six Standard Cost Sections Breakdown (Proportional to PWD 2022 Benchmark)
    const part1SubStructure = totalDirectCost * 0.1571;
    const part2Superstructure = totalDirectCost * 0.3618;
    const part3MasonryPlaster = totalDirectCost * 0.1282;
    const part4Finishes = totalDirectCost * 0.1673;
    const part5Plumbing = totalDirectCost * 0.0652;
    const part6Electrical = totalDirectCost * 0.1204;

    // Statutory and Overheads
    const statutoryPermits = 350000 * (sft / 8406);
    const qualityControl = totalDirectCost * 0.02; // 2% testing & supervision
    const contingency = totalDirectCost * 0.03; // 3% contingency

    const grandTotal = totalDirectCost + statutoryPermits + qualityControl + contingency;
    const unitRatePerSft = grandTotal / sft;

    // Update Output Displays
    updateText('est-out-grand-total', formatBDT(grandTotal));
    updateText('est-out-unit-rate', `BDT ${formatNumber(Math.round(unitRatePerSft))} / Sft`);
    updateText('est-out-steel-tons', `${steelTons.toFixed(2)} Tons`);
    updateText('est-out-cement-bags', `${formatNumber(cementBags)} Bags`);
    updateText('est-out-stone-cft', `${formatNumber(stoneCft)} Cft`);
    updateText('est-out-bricks-nos', `${formatNumber(bricksNos)} Nos`);

    // Table Part Breakdown Updates
    updateText('part1-cost', formatBDT(part1SubStructure));
    updateText('part2-cost', formatBDT(part2Superstructure));
    updateText('part3-cost', formatBDT(part3MasonryPlaster));
    updateText('part4-cost', formatBDT(part4Finishes));
    updateText('part5-cost', formatBDT(part5Plumbing));
    updateText('part6-cost', formatBDT(part6Electrical));
    updateText('direct-total-cost', formatBDT(totalDirectCost));

    updateText('statutory-cost', formatBDT(statutoryPermits));
    updateText('qc-cost', formatBDT(qualityControl));
    updateText('contingency-cost', formatBDT(contingency));
    updateText('final-grand-total', formatBDT(grandTotal));

    // Material Table Updates
    updateText('mat-steel-qty', `${steelTons.toFixed(2)} Metric Tons`);
    updateText('mat-steel-cost', formatBDT(steelCost));
    updateText('mat-cement-qty', `${formatNumber(cementBags)} Bags`);
    updateText('mat-cement-cost', formatBDT(cementCost));
    updateText('mat-stone-qty', `${formatNumber(stoneCft)} Cft`);
    updateText('mat-stone-cost', formatBDT(stoneCost));
    updateText('mat-sand-qty', `${formatNumber(sandSylhetCft + sandLocalCft)} Cft`);
    updateText('mat-sand-cost', formatBDT(sandCost));
    updateText('mat-brick-qty', `${formatNumber(bricksNos)} Nos`);
    updateText('mat-brick-cost', formatBDT(brickCost));
    updateText('mat-tile-qty', `${formatNumber(tilesSft)} Sft`);
    updateText('mat-tile-cost', formatBDT(tilesCost));
  }

  function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }

  function formatBDT(num) {
    return 'BDT ' + Math.round(num).toLocaleString('en-US');
  }

  function formatNumber(num) {
    return Math.round(num).toLocaleString('en-US');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Print Project BOQ Sheet
  window.printEstimationBOQ = function () {
    const sft = document.getElementById('est-input-sft')?.value || 8406;
    const grandTotal = document.getElementById('est-out-grand-total')?.innerText || '';
    const unitRate = document.getElementById('est-out-unit-rate')?.innerText || '';

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Please allow popups to generate the printable BOQ sheet.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ACI-KUET Standard G+3 BOQ Project Estimate</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #000; font-size: 13px; line-height: 1.5; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
          .header h2 { font-size: 14px; font-weight: normal; margin: 5px 0 0; }
          .meta-table, .boq-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .meta-table td { padding: 6px 10px; border: 1px solid #ccc; font-size: 12px; }
          .boq-table th, .boq-table td { border: 1px solid #000; padding: 8px 10px; text-align: left; }
          .boq-table th { background: #f0f0f0; font-weight: bold; text-transform: uppercase; font-size: 11px; }
          .text-right { text-align: right; }
          .grand-total-row { font-weight: bold; font-size: 14px; background: #fafafa; }
          .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
          .sig-box { width: 220px; border-top: 1px solid #000; text-align: center; padding-top: 6px; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>American Concrete Institute (ACI) Student Chapter &bull; KUET</h1>
          <h2>Department of Civil Engineering &bull; Building Estimation &amp; BOQ Registry Benchmark</h2>
          <p style="margin: 5px 0 0; font-size: 11px; font-style: italic;">Benchmarks: PWD Schedule of Rates 2022 (2nd Revised) | BNBC 2020 | ACI 318-19</p>
        </div>

        <table class="meta-table">
          <tr>
            <td><strong>Project Model:</strong> ACI-KUET Standard G+3 Residential</td>
            <td><strong>Gross Built-Up Area:</strong> ${sft} Sq.Ft</td>
          </tr>
          <tr>
            <td><strong>Structural Spec:</strong> f'c = 3,000 psi | fy = 72.5 ksi (Grade 500D)</td>
            <td><strong>Foundation Type:</strong> Isolated/Combined Footing on BFS</td>
          </tr>
          <tr>
            <td><strong>Grand Total Budget:</strong> ${grandTotal}</td>
            <td><strong>Turnkey Unit Rate:</strong> ${unitRate}</td>
          </tr>
        </table>

        <h3>Grand Abstract of Cost (PWD 2022 Reference)</h3>
        <table class="boq-table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Category &amp; Scope</th>
              <th>PWD 2022 Chapters</th>
              <th class="text-right">Sub-Total (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Part I</td>
              <td>Sub-Structure (Excavation, Sand Fill, BFS, Footings, Grade Beams)</td>
              <td>Ch. 01, 02, 03, 07, 08, 31</td>
              <td class="text-right">${document.getElementById('part1-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Part II</td>
              <td>Superstructure RCC (Columns, Beams, 5" Slabs, Stairs, OHWT)</td>
              <td>Ch. 07, 08, PWD Specs</td>
              <td class="text-right">${document.getElementById('part2-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Part III</td>
              <td>Masonry &amp; Plaster (10" Ext, 5" Partitions, 1/2" Plaster, Lime Terracing)</td>
              <td>Ch. 04, 15, 17</td>
              <td class="text-right">${document.getElementById('part3-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Part IV</td>
              <td>Finishes &amp; Metals (Tiles, Granite, Teak Doors, Thai Alum Windows, SS Rails)</td>
              <td>Ch. 06, 11-14, 19, 20</td>
              <td class="text-right">${document.getElementById('part4-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Part V</td>
              <td>Plumbing &amp; Water Supply (10,000L UGWR, Septic Tank, Deep Tube-well)</td>
              <td>Ch. 26, 27, Subhead 5</td>
              <td class="text-right">${document.getElementById('part5-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Part VI</td>
              <td>Electrical &amp; Painting (Concealed PVC Wiring, MDB/SDB, LED, Weathercoat)</td>
              <td>Ch. 16, Subhead 1, 4, 6</td>
              <td class="text-right">${document.getElementById('part6-cost')?.innerText || ''}</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td colspan="3">NET DIRECT CIVIL &amp; MEP ESTIMATE</td>
              <td class="text-right">${document.getElementById('direct-total-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Overhead</td>
              <td>Statutory Plan Approval &amp; Departmental Permits</td>
              <td>RAJUK / CDA / DoE / Fire</td>
              <td class="text-right">${document.getElementById('statutory-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>QC</td>
              <td>Quality Control, Cylinder Testing &amp; Resident Site Supervision (2%)</td>
              <td>PWD Code of Practice</td>
              <td class="text-right">${document.getElementById('qc-cost')?.innerText || ''}</td>
            </tr>
            <tr>
              <td>Buffer</td>
              <td>Physical Contingency &amp; Price Escalation (3%)</td>
              <td>PWD Annexure B / DPP</td>
              <td class="text-right">${document.getElementById('contingency-cost')?.innerText || ''}</td>
            </tr>
            <tr class="grand-total-row">
              <td colspan="3">🏆 GRAND TOTAL ESTIMATED PROJECT BUDGET</td>
              <td class="text-right">${document.getElementById('final-grand-total')?.innerText || ''}</td>
            </tr>
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-box">Prepared by Student Engineer<br>ACI KUET Chapter</div>
          <div class="sig-box">Quantity Surveyor / Estimator<br>CE Department, KUET</div>
          <div class="sig-box">Faculty Advisor / PWD Consultant<br>Khulna University of Eng &amp; Tech</div>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

})();
