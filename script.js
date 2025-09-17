class ClubCoastCustomizer {
  constructor() {
    // Product configuration for Club & Coast Seaside Performance Polos
    this.PRODUCT_CONFIG = {
      'CNC-P1000': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - Navy Men\'s', color: 'Navy', gender: 'Men\'s', colorCode: 'NAVM', image: '/images/products/CNCP1000.jpg', alt: 'Navy men\'s performance polo' },
      'CNC-P1001': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - Navy Women\'s', color: 'Navy', gender: 'Women\'s', colorCode: 'NAVF', image: '/images/products/CNCP1001.jpg', alt: 'Navy women\'s performance polo' },
      'CNC-P1002': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - White Men\'s', color: 'White', gender: 'Men\'s', colorCode: 'WHTM', image: '/images/products/CNCP1002.jpg', alt: 'White men\'s performance polo' },
      'CNC-P1003': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - White Women\'s', color: 'White', gender: 'Women\'s', colorCode: 'WHTF', image: '/images/products/CNCP1003.jpg', alt: 'White women\'s performance polo' },
      'CNC-P1004': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - Blue Men\'s', color: 'Blue', gender: 'Men\'s', colorCode: 'BLUM', image: '/images/products/CNCP1004.jpg', alt: 'Blue men\'s performance polo' },
      'CNC-P1005': { name: 'Seaside Performance Polo', description: 'Premium performance polo with UV protection - Blue Women\'s', color: 'Blue', gender: 'Women\'s', colorCode: 'BLUF', image: '/images/products/CNCP1005.jpg', alt: 'Blue women\'s performance polo' }
    };

    // JWT data (from initial URL query param provided by RepSpark)
    this.jwtData = null;

    // Logos (local, root-relative)
    this.allLogos = [
      { id: '1', name: 'Kiawah Island Golf Resort',   preview: '/images/logos/kiawah.png' },
      { id: '2', name: 'Whistling Straits Golf Shop', preview: '/images/logos/whistling-straits.png' },
      { id: '3', name: 'Bandon Dunes Golf Resort',    preview: '/images/logos/bandon-dunes.png' },
      { id: '4', name: 'Augusta National Golf Shop',  preview: '/images/logos/augusta.png' },
      { id: '5', name: 'Pinehurst Resort',            preview: '/images/logos/pinehurst.png' },
      { id: '6', name: 'Torrey Pines Golf Course',    preview: '/images/logos/torrey-pines.png' },
      { id: '7', name: 'TPC Sawgrass',                preview: '/images/logos/tpc-sawgrass.png' },
    ];
    this.initialLogos = this.allLogos.slice(0, 4);

    // Thread colors
    this.threadColors = [
      { id: 'club', name: 'Club colors', description: 'Brand-specific thread colors', swatches: ['#1f2937','#dc2626','#2563eb','#059669'], logoStyle: { filter: 'none' } },
      { id: 'coordinated', name: 'Coordinated', description: 'Complementary color palette', swatches: ['#4f46e5','#06b6d4','#10b981','#f59e0b'], logoStyle: { filter: 'hue-rotate(45deg) saturate(1.2)' } },
      { id: 'tonal', name: 'Tonal', description: 'Matching shirt color tones', swatches: ['#f9fafb','#e5e7eb','#9ca3af','#6b7280'], logoStyle: { filter: 'grayscale(0.8) contrast(1.1)' } },
    ];

    // UI state
    this.state = { selectedLogo: '1', selectedPlacement: 'left', selectedThreadColor: 'club', logoSearchQuery: '' };
    this.isZoomed = false;

    // Embedding / origins
    this.isEmbedded = false;
    this.allowedParentOrigins = [
      'https://app.repspark.com',
      'http://localhost:37803'
    ];
    this.parentOrigin = 'https://app.repspark.com';

    this.init();
  }

  init() {
    this.detectEmbeddedEnvironment();
    this.detectParentOrigin();
    this.setupRepSparkMessageListener();
    this.parseJWTFromURL();     // initial data from RepSpark query param
    this.renderLogos();
    this.renderThreadColors();
    this.bindEvents();
    this.setupProductImageZoom();
    this.updateLogoOverlay();
    console.log('Club & Coast Customizer initialized');
  }

  detectEmbeddedEnvironment() {
    this.isEmbedded = window.parent && window.parent !== window;
    if (this.isEmbedded) console.log('Running in embedded RepSpark environment');
  }

  detectParentOrigin() {
    try {
      const ref = document.referrer ? new URL(document.referrer).origin : null;
      if (ref && this.allowedParentOrigins.includes(ref)) this.parentOrigin = ref;
    } catch {}
  }

  // Only handle ERROR from RepSpark per contract; ignore everything else
  setupRepSparkMessageListener() {
    this._onMessage = (event) => {
      if (!this.allowedParentOrigins.includes(event.origin)) return;
      const data = event.data || {};
      if (typeof data !== 'object') return;

      const { action, payload } = data;

      if (action === 'ERROR') {
        // Text to display to the user
        const msg = typeof payload === 'string' ? payload : 'An error occurred.';
        alert(msg);
      }
      // Any other actions from parent are ignored by contract
    };

    window.addEventListener('message', this._onMessage);
  }

  // Helper: send a message to parent (SAVE | CANCEL | ERROR)
  postToRepSpark(action, payload) {
    if (!this.isEmbedded) return;
    try {
      // Contract: { action, payload } only. payload is a STRING for SAVE and ERROR.
      window.parent.postMessage({ action, payload }, this.parentOrigin);
    } catch (err) {
      console.error('postMessage failed:', err);
    }
  }

  // Parse the initial JWT from ?token=..., no compression handling (per spec)
  parseJWTFromURL() {
    try {
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) {
        // demo default
        this.jwtData = {
          productNumber: 'CNC-P1000',
          productName: 'Seaside Performance Polo - Navy Men\'s',
          productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
        };
        this.updateProductFromJWT();
        return;
      }

      console.log('Raw JWT token received');
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');

      const b64urlToB64 = (s) => s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4);
      const payloadJson = atob(b64urlToB64(parts[1]));
      const claims = JSON.parse(payloadJson);

      // Basic claim checks (no signature verification in browser)
      const now = Math.floor(Date.now() / 1000);
      if (claims.exp && now > claims.exp) throw new Error('JWT token has expired');
      if (claims.nbf && now < claims.nbf) throw new Error('JWT token not yet valid');

      let payloadData = claims.payload;
      // payload may be a JSON string; try to parse
      if (typeof payloadData === 'string') {
        try { payloadData = JSON.parse(payloadData); } catch { /* may be XML or plain string; keep as-is */ }
      }

      this.jwtData = {
        ...(typeof payloadData === 'object' ? payloadData : {}),
        _jwtClaims: { issued: claims.iat, expires: claims.exp, issuer: claims.iss, audience: claims.aud }
      };

      this.updateProductFromJWT();
    } catch (err) {
      console.error('Error parsing JWT:', err);
      this.jwtData = {
        productNumber: 'CNC-P1000',
        productName: 'Seaside Performance Polo - Navy Men\'s',
        productImage: this.PRODUCT_CONFIG['CNC-P1000'].image,
        _error: String(err?.message || err)
      };
      this.updateProductFromJWT();
    }
  }

  getCoordinatedColors(productColor) {
    const colorConfig = {
      'Navy':  { swatches: ['#1e3a8a','#3b82f6','#60a5fa','#93c5fd'], filter: 'hue-rotate(15deg) saturate(1.1) brightness(0.9)' },
      'Blue':  { swatches: ['#1e40af','#2563eb','#3b82f6','#60a5fa'], filter: 'hue-rotate(10deg) saturate(1.2) brightness(0.95)' },
      'White': { swatches: ['#374151','#6b7280','#9ca3af','#d1d5db'],  filter: 'saturate(0.4) brightness(0.85) contrast(1.1)' }
    };
    return colorConfig[productColor] || { swatches: ['#4f46e5','#06b6d4','#10b981','#f59e0b'], filter: 'hue-rotate(10deg) saturate(1.1)' };
  }

  updateProductFromJWT() {
    if (!this.jwtData) return;

    const productId =
      this.jwtData.productNumber ||
      this.jwtData.productId ||
      this.jwtData.product?.id ||
      this.jwtData.product?.productNumber;

    if (productId && this.PRODUCT_CONFIG[productId]) {
      const product = this.PRODUCT_CONFIG[productId];

      const coordinatedOption = this.threadColors.find(c => c.id === 'coordinated');
      if (coordinatedOption) {
        const colorCfg = this.getCoordinatedColors(product.color);
        coordinatedOption.swatches = colorCfg.swatches;
        coordinatedOption.logoStyle.filter = colorCfg.filter;
      }

      const titleEl = document.getElementById('product-title');
      if (titleEl) titleEl.textContent = `${product.gender} ${product.name} - ${product.color}`;

      const imgEl = document.getElementById('product-image');
      if (imgEl) { imgEl.src = product.image; imgEl.alt = product.alt; }

      this.renderThreadColors();
      if (this.state.selectedThreadColor === 'coordinated') this.updateLogoOverlay();
    } else {
      const titleEl = document.getElementById('product-title');
      if (titleEl && this.jwtData.productName) titleEl.textContent = this.jwtData.productName;

      const imgEl = document.getElementById('product-image');
      if (imgEl && this.jwtData.productImage) imgEl.src = this.jwtData.productImage;
    }
  }

  renderLogos() {
    const logoGrid = document.getElementById('logo-grid');
    const filtered = this.getFilteredLogos();

    if (!filtered.length) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();
    this.updateSearchInfo(filtered.length);

    logoGrid.innerHTML = filtered.map(logo => `
      <button class="logo-option ${this.state.selectedLogo === logo.id ? 'selected' : ''}"
              data-logo="${logo.id}" type="button" aria-label="${logo.name}">
        <img class="logo-preview-img" src="${logo.preview}" alt="${logo.name}" loading="lazy"
             onerror="this.onerror=null; this.src='/images/fallback.png';">
        <span class="logo-name">${logo.name}</span>
      </button>
    `).join('');

    logoGrid.querySelectorAll('.logo-option').forEach(option => {
      option.addEventListener('click', () => this.selectLogo(option.dataset.logo));
    });
  }

  renderThreadColors() {
    const container = document.getElementById('thread-color-options');
    container.innerHTML = this.threadColors.map(colorOption => `
      <button class="thread-color-option ${this.state.selectedThreadColor === colorOption.id ? 'selected' : ''}" data-color="${colorOption.id}">
        <div class="thread-color-header">
          <div class="thread-color-info">
            <div class="thread-color-name">${colorOption.name}</div>
            <div class="thread-color-desc">${colorOption.description}</div>
          </div>
          <div class="thread-color-indicator ${this.state.selectedThreadColor === colorOption.id ? '' : 'hidden'}"></div>
        </div>
        <div class="thread-color-swatches">
          ${colorOption.swatches.map(s => `<div class="color-swatch" style="background-color:${s};"></div>`).join('')}
        </div>
      </button>
    `).join('');

    container.querySelectorAll('.thread-color-option').forEach(option => {
      option.addEventListener('click', () => this.selectThreadColor(option.dataset.color));
    });
  }

  getFilteredLogos() {
    if (!this.state.logoSearchQuery.trim()) return this.initialLogos;
    return this.allLogos.filter(logo => logo.name.toLowerCase().includes(this.state.logoSearchQuery.toLowerCase()));
  }

  showNoResults() {
    const logoGrid = document.getElementById('logo-grid');
    const noResults = document.getElementById('no-results');
    const searchInfo = document.getElementById('search-results-info');
    const noResultsText = document.getElementById('no-results-text');

    logoGrid.style.display = 'none';
    noResults.classList.remove('hidden');
    searchInfo.classList.add('hidden');
    noResultsText.textContent = `No logos found matching "${this.state.logoSearchQuery}"`;
  }

  hideNoResults() {
    const logoGrid = document.getElementById('logo-grid');
    const noResults = document.getElementById('no-results');
    logoGrid.style.display = 'grid';
    noResults.classList.add('hidden');
  }

  updateSearchInfo(count) {
    const el = document.getElementById('search-results-info');
    if (this.state.logoSearchQuery.trim() && count > 0) {
      el.textContent = `Showing ${count} of ${this.allLogos.length} logos`;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  bindEvents() {
    const searchInput = document.getElementById('logo-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.logoSearchQuery = e.target.value;
        this.renderLogos();
      });
    }

    document.querySelectorAll('input[name="placement"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.selectedPlacement = e.target.value;
        this.updateLogoOverlay();
      });
    });

    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) addBtn.addEventListener('click', () => this.addToCart());

    const cancelBtn = document.getElementById('cancel-customization');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancel());
  }

  selectLogo(logoId) {
    this.state.selectedLogo = logoId;
    document.querySelectorAll('.logo-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.logo === logoId);
    });
    this.updateLogoOverlay();
  }

  selectThreadColor(colorId) {
    this.state.selectedThreadColor = colorId;
    document.querySelectorAll('.thread-color-option').forEach(option => {
      const isSelected = option.dataset.color === colorId;
      option.classList.toggle('selected', isSelected);
      const indicator = option.querySelector('.thread-color-indicator');
      if (indicator) indicator.classList.toggle('hidden', !isSelected);
    });
    this.updateLogoOverlay();
  }

  setupProductImageZoom() {
    const productImage = document.getElementById('product-image');
    if (!productImage) return;
    const imageContainer = productImage.parentElement;

    const zoomWrapper = document.createElement('div');
    zoomWrapper.id = 'zoom-wrapper';
    zoomWrapper.style.cssText = `
      position: relative; width: 100%; height: 100%;
      transform-origin: center center; transition: transform 0.3s ease-out;
    `;
    const parent = productImage.parentNode;
    parent.insertBefore(zoomWrapper, productImage);
    zoomWrapper.appendChild(productImage);

    imageContainer.style.position = 'relative';
    imageContainer.style.overflow = 'hidden';

    productImage.style.width = '100%';
    productImage.style.height = '100%';
    productImage.style.objectFit = 'cover';
    productImage.style.cursor = 'zoom-in';
    productImage.title = 'Hover to zoom and explore details';

    const handleMouseEnter = () => {
      if (this.isZoomed) return;
      this.isZoomed = true;
      const logoOverlay = document.getElementById('logo-overlay');
      if (logoOverlay && !logoOverlay.classList.contains('hidden')) {
        zoomWrapper.appendChild(logoOverlay);
        logoOverlay.style.pointerEvents = 'none';
      }
      zoomWrapper.style.transform = 'scale(2)';
      productImage.style.cursor = 'zoom-out';
      zoomWrapper.style.zIndex = '100';
    };

    const handleMouseMove = (e) => {
      if (!this.isZoomed) return;
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (centerX - x) * 0.3;
      const moveY = (centerY - y) * 0.3;
      zoomWrapper.style.transform = `scale(2) translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX; const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (!this.isZoomed) return;
        this.isZoomed = false;
        zoomWrapper.style.transform = 'scale(1)';
        productImage.style.cursor = 'zoom-in';
        zoomWrapper.style.zIndex = '1';
        const logoOverlay = document.getElementById('logo-overlay');
        if (logoOverlay) logoOverlay.style.pointerEvents = 'auto';
      }
    };

    imageContainer.addEventListener('mouseenter', handleMouseEnter);
    imageContainer.addEventListener('mousemove', handleMouseMove);
    imageContainer.addEventListener('mouseleave', handleMouseLeave);
  }

  updateLogoOverlay() {
    const overlay = document.getElementById('logo-overlay');
    const selectedLogo = this.allLogos.find(l => l.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(c => c.id === this.state.selectedThreadColor);
    if (!overlay) return;

    if (selectedLogo) {
      overlay.innerHTML = '';
      if (/\.(png|jpg|jpeg|svg)$/i.test(selectedLogo.preview)) {
        const img = document.createElement('img');
        img.src = selectedLogo.preview;
        img.alt = selectedLogo.name;
        img.style.width = '40px';
        img.style.height = '30px';
        img.style.objectFit = 'contain';
        img.style.filter = selectedThreadColor?.logoStyle?.filter || 'none';
        overlay.style.border = 'none';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.padding = '0';
        img.onerror = () => { img.remove(); overlay.textContent = selectedLogo.name; };
        overlay.appendChild(img);
      } else {
        overlay.textContent = selectedLogo.preview;
      }
      overlay.className = `logo-overlay ${this.state.selectedPlacement}`;
      overlay.classList.remove('hidden');

      const zoomWrapper = document.getElementById('zoom-wrapper');
      if (zoomWrapper && overlay.parentElement !== zoomWrapper) zoomWrapper.appendChild(overlay);
    } else {
      overlay.classList.add('hidden');
    }
  }

  // SAVE flow (calls your signer and posts JWT back to RepSpark)
  async addToCart() {
    const validation = this.validateCustomizations();
    if (!validation.isValid) {
      alert('Please complete your customization:\n' + validation.errors.join('\n'));
      return;
    }

    const selectedLogo = this.allLogos.find(l => l.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(c => c.id === this.state.selectedThreadColor);

    const payloadObject = {
      productNumber: this.jwtData?.productNumber || 'CNC-P1000',
      customizations: {
        logo: {
          id: selectedLogo.id,
          name: selectedLogo.name,
          preview: selectedLogo.preview,
          url: this.getFullLogoUrl(selectedLogo.preview)
        },
        placement: this.state.selectedPlacement,
        threadColor: selectedThreadColor
      },
      pricing: { logoFee: 5.00, currency: 'USD' },
      version: '1.0.0'
    };

    try {
      const resp = await fetch('/api/repspark/sign-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: payloadObject })
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Signer ${resp.status}: ${errText}`);
      }
      const { jwt } = await resp.json();
      if (typeof jwt !== 'string' || jwt.split('.').length !== 3) {
        throw new Error('Invalid JWT returned from signer');
      }

      if (this.isEmbedded) {
        // Contract: post { action:'SAVE', payload:'<JWT STRING>' }
        this.postToRepSpark('SAVE', jwt);
      } else {
        // Standalone mode: prove signer works
        this.showSuccessMessage('Signer OK (JWT generated). Opened standalone, so not posting to RepSpark.');
      }
    } catch (error) {
      console.error('[SAVE] error:', error);
      const msg = 'Unable to save customization. Please try again.';
      if (this.isEmbedded) this.postToRepSpark('ERROR', msg);
      alert(msg);
    }
  }

  cancel() {
    // Contract: CANCEL with empty payload
    if (this.isEmbedded) this.postToRepSpark('CANCEL', '');
  }

  // Validation
  validateCustomizations() {
    const errors = [];
    if (!this.state.selectedLogo) errors.push('Logo selection is required');
    if (!this.state.selectedPlacement) errors.push('Logo placement is required');
    if (!this.state.selectedThreadColor) errors.push('Thread color selection is required');

    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    if (this.state.selectedLogo && !selectedLogo) errors.push('Selected logo is no longer available');

    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);
    if (this.state.selectedThreadColor && !selectedThreadColor) errors.push('Selected thread color is no longer available');

    return { isValid: errors.length === 0, errors };
  }

  getFullLogoUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\.\//, '');
    return clean.startsWith('/') ? `${window.location.origin}${clean}` : `${window.location.origin}/${clean}`;
  }

  // Resize + cleanup
  handleResize() {
    if (this.isZoomed) {
      const zoomWrapper = document.getElementById('zoom-wrapper');
      if (zoomWrapper) { zoomWrapper.style.transform = 'scale(1)'; this.isZoomed = false; }
    }
    this.updateLogoOverlay();
  }

  destroy() {
    if (this._onMessage) window.removeEventListener('message', this._onMessage);
    window.removeEventListener('resize', this.handleResize);
    console.log('ClubCoastCustomizer destroyed');
  }
}

// Window events
window.addEventListener('resize', () => { if (window.customizer) window.customizer.handleResize(); });
document.addEventListener('DOMContentLoaded', () => { window.customizer = new ClubCoastCustomizer(); });

// Node/CommonJS export guard (kept for testing)
if (typeof module !== 'undefined' && module.exports) module.exports = ClubCoastCustomizer;
