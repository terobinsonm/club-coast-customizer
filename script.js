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
      'https://app.repspark.net',
      'https://dev.repspark.net',
      'http://localhost:37803'
    ];
    this.parentOrigin = 'https://app.repspark.com'; // default

    this.init();
  }

  init() {
    console.log('=== CUSTOMIZER INIT START ===');
    console.log('[INIT] Timestamp:', new Date().toISOString());
    
    this.detectEmbeddedEnvironment();
    this.detectParentOrigin();
    this.setupRepSparkMessageListener();
    this.parseJWTFromURL();
    this.renderLogos();
    this.renderThreadColors();
    this.bindEvents();
    this.setupProductImageZoom();
    this.updateLogoOverlay();
    
    console.log('[INIT] State after init:', this.state);
    console.log('=== CUSTOMIZER INIT COMPLETE ===');
    console.log('Club & Coast Customizer initialized');
    
    // Global click detector for debugging
    document.body.addEventListener('click', (e) => {
      console.log('[GLOBAL CLICK]', {
        target: e.target,
        id: e.target.id,
        className: e.target.className,
        tagName: e.target.tagName,
        timestamp: new Date().toISOString()
      });
    }, true);
  }

  detectEmbeddedEnvironment() {
    this.isEmbedded = window.parent && window.parent !== window;
    console.log('=== EMBED DETECTION ===');
    console.log('[EMBED] isEmbedded:', this.isEmbedded);
    console.log('[EMBED] window.parent === window:', window.parent === window);
    console.log('[EMBED] window.location:', window.location.href);
    console.log('[EMBED] window.top:', window.top);
    console.log('[EMBED] document.referrer:', document.referrer);
    if (this.isEmbedded) {
      console.log('[EMBED] ✓ Running in embedded RepSpark environment');
    } else {
      console.log('[EMBED] ✗ Running standalone (not in iframe)');
    }
  }

  detectParentOrigin() {
    console.log('=== PARENT ORIGIN DETECTION ===');
    try {
      const ref = document.referrer ? new URL(document.referrer).origin : null;
      console.log('[ORIGIN] Referrer:', document.referrer);
      console.log('[ORIGIN] Parsed origin:', ref);
      console.log('[ORIGIN] Allowed origins:', this.allowedParentOrigins);
      
      if (ref && this.allowedParentOrigins.includes(ref)) {
        this.parentOrigin = ref;
        console.log('[ORIGIN] ✓ Using referrer origin:', this.parentOrigin);
      } else {
        console.log('[ORIGIN] ✗ Using default origin:', this.parentOrigin);
      }
    } catch (err) {
      console.error('[ORIGIN] ✗ Error detecting origin:', err);
    }
  }

  setupRepSparkMessageListener() {
    console.log('[LISTENER] Setting up RepSpark message listener');
    
    this._onMessage = (event) => {
      console.log('[MESSAGE] Received postMessage:', {
        origin: event.origin,
        data: event.data,
        allowed: this.allowedParentOrigins.includes(event.origin)
      });
      
      if (!this.allowedParentOrigins.includes(event.origin)) {
        console.warn('[MESSAGE] ✗ Rejected message from disallowed origin:', event.origin);
        return;
      }
      
      const data = event.data || {};
      if (typeof data !== 'object') {
        console.warn('[MESSAGE] ✗ Invalid message data type:', typeof data);
        return;
      }

      const { action, payload } = data;
      console.log('[MESSAGE] Processing action:', action);

      if (action === 'ERROR') {
        const msg = typeof payload === 'string' ? payload : 'An error occurred.';
        console.error('[MESSAGE] ERROR from parent:', msg);
        alert(msg);
      }
    };

    window.addEventListener('message', this._onMessage);
    console.log('[LISTENER] ✓ Message listener attached');
  }

  postToRepSpark(action, payload) {
    console.log('=== POST TO REPSPARK ===');
    console.log('[POST] Action:', action);
    console.log('[POST] Payload type:', typeof payload);
    console.log('[POST] Payload length:', typeof payload === 'string' ? payload.length : 'N/A');
    console.log('[POST] isEmbedded:', this.isEmbedded);
    console.log('[POST] parentOrigin:', this.parentOrigin);
    
    if (!this.isEmbedded) {
      console.warn('[POST] ✗ Not embedded, skipping postMessage');
      return;
    }
    
    try {
      const message = { action, payload };
      console.log('[POST] Sending message:', message);
      console.log('[POST] window.parent:', window.parent);
      
      window.parent.postMessage(message, this.parentOrigin);
      
      console.log('[POST] ✓ Message sent successfully');
    } catch (err) {
      console.error('[POST] ✗ postMessage failed:', err);
      console.error('[POST] Error stack:', err.stack);
    }
  }

  async parseJWTFromURL() {
    console.log('=== JWT PARSING ===');
    const token = new URLSearchParams(window.location.search).get('token');
    console.log('[JWT] Token present:', !!token);
    console.log('[JWT] Token length:', token ? token.length : 0);

    const useDemoDefaults = () => {
      console.log('[JWT] Using demo defaults');
      this.jwtData = {
        productNumber: 'CNC-P1000',
        productName: 'Seaside Performance Polo - Navy Men\'s',
        productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
      };
      this.updateProductFromJWT();
    };

    if (!token) { 
      console.log('[JWT] ✗ No token in URL');
      useDemoDefaults(); 
      return; 
    }

    try {
      console.log('[JWT] Verifying token with backend...');
      const resp = await fetch('/api/repspark/verify-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          expectedAudience: window.location.origin
        })
      });

      console.log('[JWT] Verify response status:', resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('[JWT] Verify failed:', errText);
        throw new Error(errText);
      }
      
      const { payload, claims } = await resp.json();
      console.log('[JWT] ✓ Token verified successfully');
      console.log('[JWT] Payload:', payload);
      console.log('[JWT] Claims:', claims);

      this.jwtData = {
        ...(typeof payload === 'object' ? payload : {}),
        _jwtClaims: claims
      };

      this.updateProductFromJWT();
    } catch (e) {
      console.error('[JWT] ✗ Verification failed:', e);
      console.warn('[JWT] Falling back to demo defaults');
      useDemoDefaults();
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
    console.log('=== UPDATE PRODUCT FROM JWT ===');
    console.log('[PRODUCT] JWT data:', this.jwtData);
    
    if (!this.jwtData) {
      console.warn('[PRODUCT] ✗ No JWT data available');
      return;
    }

    const productId =
      this.jwtData.productNumber ||
      this.jwtData.productId ||
      this.jwtData.product?.id ||
      this.jwtData.product?.productNumber;

    console.log('[PRODUCT] Product ID:', productId);

    if (productId && this.PRODUCT_CONFIG[productId]) {
      const product = this.PRODUCT_CONFIG[productId];
      console.log('[PRODUCT] ✓ Found product config:', product);

      const coordinatedOption = this.threadColors.find(c => c.id === 'coordinated');
      if (coordinatedOption) {
        const colorCfg = this.getCoordinatedColors(product.color);
        coordinatedOption.swatches = colorCfg.swatches;
        coordinatedOption.logoStyle.filter = colorCfg.filter;
        console.log('[PRODUCT] Updated coordinated colors for:', product.color);
      }

      const titleEl = document.getElementById('product-title');
      if (titleEl) {
        titleEl.textContent = `${product.gender} ${product.name} - ${product.color}`;
        console.log('[PRODUCT] Updated title');
      }

      const imgEl = document.getElementById('product-image');
      if (imgEl) { 
        imgEl.src = product.image; 
        imgEl.alt = product.alt;
        console.log('[PRODUCT] Updated image:', product.image);
      }

    } else {
      console.log('[PRODUCT] Using JWT-provided product info');
      const titleEl = document.getElementById('product-title');
      if (titleEl && this.jwtData.productName) {
        titleEl.textContent = this.jwtData.productName;
        console.log('[PRODUCT] Set title from JWT:', this.jwtData.productName);
      }

      const imgEl = document.getElementById('product-image');
      if (imgEl && this.jwtData.productImage) {
        imgEl.src = this.jwtData.productImage;
        console.log('[PRODUCT] Set image from JWT:', this.jwtData.productImage);
      }
    }
    
    // Apply saved customizations (edit mode)
    const saved = this.jwtData && this.jwtData.customizations;
    if (saved) {
      console.log('[PRODUCT] Applying saved customizations:', saved);
      
      // logo
      if (saved.logo?.id && this.allLogos.some(l => l.id === saved.logo.id)) {
        this.state.selectedLogo = saved.logo.id;
        console.log('[PRODUCT] Restored logo:', saved.logo.id);
      } else if (saved.logo?.name) {
        const byName = this.allLogos.find(l => l.name === saved.logo.name);
        if (byName) {
          this.state.selectedLogo = byName.id;
          console.log('[PRODUCT] Restored logo by name:', byName.id);
        }
      }

      // placement
      if (saved.placement && ['left','right','center'].includes(saved.placement)) {
        this.state.selectedPlacement = saved.placement;
        console.log('[PRODUCT] Restored placement:', saved.placement);
      }

      // thread color
      if (saved.threadColor?.id && this.threadColors.some(c => c.id === saved.threadColor.id)) {
        this.state.selectedThreadColor = saved.threadColor.id;
        console.log('[PRODUCT] Restored thread color:', saved.threadColor.id);
      }
    }

    // Reflect state in the UI
    this.renderLogos();
    this.renderThreadColors();
    
    // sync placement radios
    document.querySelectorAll('input[name="placement"]').forEach(r => {
      r.checked = (r.value === this.state.selectedPlacement);
    });
    
    this.updateLogoOverlay();
    console.log('[PRODUCT] ✓ Product update complete');
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
    console.log('=== BINDING EVENTS ===');
    
    const searchInput = document.getElementById('logo-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.logoSearchQuery = e.target.value;
        this.renderLogos();
      });
      console.log('[BIND] ✓ Logo search input bound');
    }

    document.querySelectorAll('input[name="placement"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.selectedPlacement = e.target.value;
        this.updateLogoOverlay();
      });
    });
    console.log('[BIND] ✓ Placement radios bound');

    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) {
      console.log('[BIND] ✓ Add to cart button found');
      console.log('[BIND] Button element:', addBtn);
      console.log('[BIND] Button styles:', window.getComputedStyle(addBtn));
      console.log('[BIND] Button pointer-events:', window.getComputedStyle(addBtn).pointerEvents);
      console.log('[BIND] Button z-index:', window.getComputedStyle(addBtn).zIndex);
      
      // Try multiple event binding strategies
      addBtn.addEventListener('click', (e) => {
        console.log('[CLICK] ✓✓✓ Add to cart button CLICKED (capture)');
        e.preventDefault();
        e.stopPropagation();
        this.addToCart();
      }, true); // Capture phase
      
      addBtn.addEventListener('click', (e) => {
        console.log('[CLICK] ✓✓✓ Add to cart button CLICKED (bubble)');
        e.preventDefault();
        e.stopPropagation();
        this.addToCart();
      }, false); // Bubble phase
      
      // Also try with onclick
      addBtn.onclick = (e) => {
        console.log('[CLICK] ✓✓✓ Add to cart button CLICKED (onclick)');
        e.preventDefault();
        e.stopPropagation();
        this.addToCart();
      };
      
      console.log('[BIND] ✓ Add to cart listeners attached (capture + bubble + onclick)');
    } else {
      console.error('[BIND] ✗ Add to cart button NOT FOUND');
    }

    const cancelBtn = document.getElementById('cancel-customization');
    if (cancelBtn) {
      console.log('[BIND] ✓ Cancel button found');
      console.log('[BIND] Button element:', cancelBtn);
      console.log('[BIND] Button pointer-events:', window.getComputedStyle(cancelBtn).pointerEvents);
      console.log('[BIND] Button z-index:', window.getComputedStyle(cancelBtn).zIndex);
      
      cancelBtn.addEventListener('click', (e) => {
        console.log('[CLICK] ✓✓✓ Cancel button CLICKED (capture)');
        e.preventDefault();
        e.stopPropagation();
        this.cancel();
      }, true); // Capture phase
      
      cancelBtn.addEventListener('click', (e) => {
        console.log('[CLICK] ✓✓✓ Cancel button CLICKED (bubble)');
        e.preventDefault();
        e.stopPropagation();
        this.cancel();
      }, false); // Bubble phase
      
      cancelBtn.onclick = (e) => {
        console.log('[CLICK] ✓✓✓ Cancel button CLICKED (onclick)');
        e.preventDefault();
        e.stopPropagation();
        this.cancel();
      };
      
      console.log('[BIND] ✓ Cancel listeners attached (capture + bubble + onclick)');
    } else {
      console.error('[BIND] ✗ Cancel button NOT FOUND');
    }
    
    console.log('[BIND] ✓ All events bound');
  }

  selectLogo(logoId) {
    console.log('[SELECT] Logo selected:', logoId);
    this.state.selectedLogo = logoId;
    document.querySelectorAll('.logo-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.logo === logoId);
    });
    this.updateLogoOverlay();
  }

  selectThreadColor(colorId) {
    console.log('[SELECT] Thread color selected:', colorId);
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
      zoomWrapper.style.zIndex = '10'; // Lowered from 100
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
      const x = e.clientX; 
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (!this.isZoomed) return;
        this.isZoomed = false;
        zoomWrapper.style.transform = 'scale(1)';
        productImage.style.cursor = 'zoom-in';
        zoomWrapper.style.zIndex = 'auto'; // Changed from '1'
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

  async addToCart() {
    console.log('');
    console.log('=== ADD TO CART CLICKED ===');
    console.log('[CART] Timestamp:', new Date().toISOString());
    console.log('[CART] Method called successfully');
    console.log('[CART] isEmbedded:', this.isEmbedded);
    console.log('[CART] parentOrigin:', this.parentOrigin);
    console.log('[CART] Current state:', this.state);
    
    const validation = this.validateCustomizations();
    console.log('[CART] Validation result:', validation);
    
    if (!validation.isValid) {
      console.warn('[CART] ✗ Validation failed:', validation.errors);
      alert('Please complete your customization:\n' + validation.errors.join('\n'));
      return;
    }
    console.log('[CART] ✓ Validation passed');

    const selectedLogo = this.allLogos.find(l => l.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(c => c.id === this.state.selectedThreadColor);

    console.log('[CART] Selected logo:', selectedLogo);
    console.log('[CART] Selected thread color:', selectedThreadColor);

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

    console.log('[CART] Payload object created:', payloadObject);

    try {
      console.log('[CART] Calling signer endpoint...');
      const resp = await fetch('/api/repspark/sign-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: payloadObject })
      });

      console.log('[CART] Signer response status:', resp.status);
      console.log('[CART] Signer response ok:', resp.ok);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('[CART] ✗ Signer failed:', errText);
        throw new Error(`Signer ${resp.status}: ${errText}`);
      }
      
      const { jwt } = await resp.json();
      console.log('[CART] JWT received:', jwt ? 'YES' : 'NO');
      console.log('[CART] JWT length:', jwt ? jwt.length : 0);
      console.log('[CART] JWT preview:', jwt ? jwt.substring(0, 50) + '...' : 'N/A');
      
      if (typeof jwt !== 'string' || jwt.split('.').length !== 3) {
        console.error('[CART] ✗ Invalid JWT structure');
        throw new Error('Invalid JWT returned from signer');
      }

      console.log('[CART] ✓ Valid JWT structure confirmed');

      if (this.isEmbedded) {
        console.log('[CART] Posting SAVE message to RepSpark parent...');
        console.log('[CART] Target origin:', this.parentOrigin);
        this.postToRepSpark('SAVE', jwt);
        console.log('[CART] ✓ SAVE message posted');
      } else {
        console.log('[CART] Standalone mode - showing success message');
        this.showSuccessMessage('Signer OK (JWT generated). Opened standalone, so not posting to RepSpark.');
      }
    } catch (error) {
      console.error('[CART] ✗ Error in addToCart:', error);
      console.error('[CART] Error stack:', error.stack);
      const msg = 'Unable to save customization. Please try again.';
      if (this.isEmbedded) {
        console.log('[CART] Posting ERROR to RepSpark');
        this.postToRepSpark('ERROR', msg);
      }
      alert(msg);
    }
  }

  cancel() {
    console.log('');
    console.log('=== CANCEL CLICKED ===');
    console.log('[CANCEL] Timestamp:', new Date().toISOString());
    console.log('[CANCEL] Method called successfully');
    console.log('[CANCEL] isEmbedded:', this.isEmbedded);
    console.log('[CANCEL] parentOrigin:', this.parentOrigin);
    
    if (this.isEmbedded) {
      console.log('[CANCEL] Posting CANCEL message to RepSpark parent');
      this.postToRepSpark('CANCEL', '');
      console.log('[CANCEL] ✓ CANCEL message posted');
    } else {
      console.log('[CANCEL] Standalone mode - no action taken');
    }
  }

  showSuccessMessage(message) {
    console.log('[SUCCESS] Showing message:', message);
    const n = document.createElement('div');
    n.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: #10b981; color: #fff; padding: 12px 16px;
      border-radius: 6px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,.15);
      transition: opacity .3s ease;
    `;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 2500);
  }
  
  validateCustomizations() {
    const errors = [];
    
    if (!this.state.selectedLogo) {
      errors.push('Logo selection is required');
    }
    if (!this.state.selectedPlacement) {
      errors.push('Logo placement is required');
    }
    if (!this.state.selectedThreadColor) {
      errors.push('Thread color selection is required');
    }

    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    if (this.state.selectedLogo && !selectedLogo) {
      errors.push('Selected logo is no longer available');
    }

    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);
    if (this.state.selectedThreadColor && !selectedThreadColor) {
      errors.push('Selected thread color is no longer available');
    }

    return { isValid: errors.length === 0, errors };
  }

  getFullLogoUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\.\//, '');
    return clean.startsWith('/') ? `${window.location.origin}${clean}` : `${window.location.origin}/${clean}`;
  }

  handleResize() {
    if (this.isZoomed) {
      const zoomWrapper = document.getElementById('zoom-wrapper');
      if (zoomWrapper) { 
        zoomWrapper.style.transform = 'scale(1)'; 
        this.isZoomed = false; 
      }
    }
    this.updateLogoOverlay();
  }

  destroy() {
    console.log('[DESTROY] Cleaning up customizer');
    if (this._onMessage) {
      window.removeEventListener('message', this._onMessage);
      console.log('[DESTROY] Message listener removed');
    }
    window.removeEventListener('resize', this.handleResize);
    console.log('[DESTROY] Customizer destroyed');
  }
}

// Window events
window.addEventListener('resize', () => { 
  if (window.customizer) window.customizer.handleResize(); 
});

document.addEventListener('DOMContentLoaded', () => { 
  console.log('');
  console.log('==============================================');
  console.log('=== CLUB & COAST CUSTOMIZER STARTING ===');
  console.log('==============================================');
  console.log('[DOM] DOMContentLoaded fired');
  console.log('[DOM] Creating customizer instance...');
  window.customizer = new ClubCoastCustomizer();
  console.log('[DOM] ✓ Customizer instance created');
  console.log('[DOM] window.customizer:', window.customizer);
  console.log('==============================================');
});

// Node/CommonJS export guard (kept for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClubCoastCustomizer;
}
