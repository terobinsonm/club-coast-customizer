class ClubCoastCustomizer {
  constructor() {
    // Product configuration for Club & Coast Seaside Performance Polos
    this.PRODUCT_CONFIG = {
      'CNC-P1000': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - Navy Men\'s',
        color: 'Navy',
        gender: 'Men\'s',
        colorCode: 'NAVM',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1000.jpg',
        alt: 'Navy men\'s performance polo'
      },
      'CNC-P1001': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - Navy Women\'s',
        color: 'Navy',
        gender: 'Women\'s',
        colorCode: 'NAVF',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1001.jpg',
        alt: 'Navy women\'s performance polo'
      },
      'CNC-P1002': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - White Men\'s',
        color: 'White',
        gender: 'Men\'s',
        colorCode: 'WHTM',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1002.jpg',
        alt: 'White men\'s performance polo'
      },
      'CNC-P1003': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - White Women\'s',
        color: 'White',
        gender: 'Women\'s',
        colorCode: 'WHTF',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1003.jpg',
        alt: 'White women\'s performance polo'
      },
      'CNC-P1004': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - Blue Men\'s',
        color: 'Blue',
        gender: 'Men\'s',
        colorCode: 'BLUM',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1004.jpg',
        alt: 'Blue men\'s performance polo'
      },
      'CNC-P1005': {
        name: 'Seaside Performance Polo',
        description: 'Premium performance polo with UV protection - Blue Women\'s',
        color: 'Blue',
        gender: 'Women\'s',
        colorCode: 'BLUF',
        image: 'https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/products/CNCP1005.jpg',
        alt: 'Blue women\'s performance polo'
      }
    };

    // JWT data from RepSpark
    this.jwtData = null;
    
    // All available logos
    this.allLogos = [
      { id: '1',  name: 'Kiawah Island Golf Resort',      preview: './images/kiawah.png' },
      { id: '2',  name: 'Whistling Straits Golf Shop',    preview: './images/whistling-straits.png' },
      { id: '3',  name: 'Bandon Dunes Golf Resort',       preview: './images/bandon-dunes.png' },
      { id: '4',  name: 'Augusta National Golf Shop',     preview: './images/augusta.png' },
      { id: '5',  name: 'Pinehurst Resort',               preview: './images/pinehurst.png' },
      { id: '6',  name: 'Torrey Pines Golf Course',       preview: './images/torrey-pines.png' },
      { id: '7',  name: 'TPC Sawgrass',                   preview: './images/tpc-sawgrass.png' },
    ];

    // Initially displayed logos
    this.initialLogos = this.allLogos.slice(0, 4);

    // Thread colors with dynamic coordination
    this.threadColors = [
      { 
        id: 'club',
        name: 'Club colors',
        description: 'Brand-specific thread colors',
        swatches: ['#1f2937', '#dc2626', '#2563eb', '#059669'],
        logoStyle: {
          filter: 'none'
        }
      },
      { 
        id: 'coordinated',
        name: 'Coordinated',
        description: 'Complementary color palette',
        swatches: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
        logoStyle: {
          filter: 'hue-rotate(45deg) saturate(1.2)'
        }
      },
      { 
        id: 'tonal',
        name: 'Tonal',
        description: 'Matching shirt color tones',
        swatches: ['#f9fafb', '#e5e7eb', '#9ca3af', '#6b7280'],
        logoStyle: {
          filter: 'grayscale(0.8) contrast(1.1)'
        }
      },
    ];

    // Current state
    this.state = {
      selectedLogo: '1',
      selectedPlacement: 'left',
      selectedThreadColor: 'club',
      logoSearchQuery: '',
    };

    // Zoom state
    this.isZoomed = false;

    // RepSpark integration state
    this.isEmbedded = false;
    this.repsparkOrigin = 'https://app.repspark.com';

    this.init();
  }

  init() {
    this.detectEmbeddedEnvironment();
    this.setupRepSparkMessageListener();
    this.parseJWTFromURL();
    this.renderLogos();
    this.renderThreadColors();
    this.bindEvents();
    this.setupProductImageZoom();
    this.updateLogoOverlay();
    console.log('Club & Coast Customizer initialized');
  }

  // NEW: Detect if running in RepSpark iframe
  detectEmbeddedEnvironment() {
    this.isEmbedded = window.parent && window.parent !== window;
    if (this.isEmbedded) {
      console.log('Running in embedded RepSpark environment');
      // Send ready message to RepSpark
      this.sendMessageToRepSpark('READY', { ready: true });
    }
  }

  // NEW: RepSpark PostMessage listener
  setupRepSparkMessageListener() {
    window.addEventListener('message', (event) => {
      // Verify origin for security
      if (event.origin !== this.repsparkOrigin) {
        console.warn('Received message from unauthorized origin:', event.origin);
        return;
      }

      console.log('Received message from RepSpark:', event.data);

      try {
        switch (event.data.action) {
          case 'LOAD':
            this.loadSavedCustomizations(event.data.payload);
            break;
          case 'RESET':
            this.resetCustomizations();
            break;
          case 'VALIDATE':
            this.validateAndRespond();
            break;
          case 'GET_STATE':
            this.sendCurrentState();
            break;
          default:
            console.log('Unknown action received from RepSpark:', event.data.action);
        }
      } catch (error) {
        console.error('Error handling RepSpark message:', error);
        this.sendMessageToRepSpark('ERROR', { 
          message: error.message,
          action: event.data.action 
        });
      }
    });
  }

  // NEW: Load saved customizations from RepSpark
  loadSavedCustomizations(savedData) {
    if (!savedData || !savedData.customizations) {
      console.log('No saved customizations to load');
      return;
    }

    console.log('Loading saved customizations:', savedData);
    
    const { customizations } = savedData;
    
    // Update state with saved values
    if (customizations.logo && customizations.logo.id) {
      this.state.selectedLogo = customizations.logo.id;
    }
    if (customizations.placement) {
      this.state.selectedPlacement = customizations.placement;
    }
    if (customizations.threadColor && customizations.threadColor.id) {
      this.state.selectedThreadColor = customizations.threadColor.id;
    }
    
    // Update UI to reflect loaded state
    this.updateUIFromState();
    this.updateLogoOverlay();
    
    console.log('Customizations loaded successfully');
  }

  // NEW: Reset customizations to defaults
  resetCustomizations() {
    console.log('Resetting customizations to defaults');
    
    this.state = {
      selectedLogo: '1',
      selectedPlacement: 'left',
      selectedThreadColor: 'club',
      logoSearchQuery: '',
    };
    
    // Clear search
    const searchInput = document.getElementById('logo-search');
    if (searchInput) searchInput.value = '';
    
    // Update UI
    this.updateUIFromState();
    this.renderLogos();
    this.updateLogoOverlay();
    
    console.log('Customizations reset');
    
    // Notify RepSpark of reset
    this.sendMessageToRepSpark('RESET_COMPLETE', { 
      state: this.getCustomizationState() 
    });
  }

  // NEW: Update UI elements from current state
  updateUIFromState() {
    // Update logo selection
    document.querySelectorAll('.logo-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.logo === this.state.selectedLogo);
    });

    // Update placement radio buttons
    document.querySelectorAll('input[name="placement"]').forEach(radio => {
      radio.checked = radio.value === this.state.selectedPlacement;
    });

    // Update thread color selection
    document.querySelectorAll('.thread-color-option').forEach(option => {
      const isSelected = option.dataset.color === this.state.selectedThreadColor;
      option.classList.toggle('selected', isSelected);
      
      const indicator = option.querySelector('.thread-color-indicator');
      if (indicator) {
        indicator.classList.toggle('hidden', !isSelected);
      }
    });
  }

  // NEW: Validate customizations and respond to RepSpark
  validateAndRespond() {
    const validation = this.validateCustomizations();
    
    this.sendMessageToRepSpark('VALIDATION_RESULT', {
      isValid: validation.isValid,
      errors: validation.errors,
      state: this.getCustomizationState()
    });
  }

  // NEW: Send current state to RepSpark
  sendCurrentState() {
    this.sendMessageToRepSpark('CURRENT_STATE', {
      state: this.getCustomizationState(),
      isValid: this.validateCustomizations().isValid
    });
  }

  // NEW: Comprehensive validation
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

    // Validate that selected items exist
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    if (this.state.selectedLogo && !selectedLogo) {
      errors.push('Selected logo is no longer available');
    }

    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);
    if (this.state.selectedThreadColor && !selectedThreadColor) {
      errors.push('Selected thread color is no longer available');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // NEW: Send messages to RepSpark with error handling
  sendMessageToRepSpark(action, payload) {
    if (!this.isEmbedded) {
      console.log('Not embedded - would send to RepSpark:', { action, payload });
      return;
    }

    try {
      const message = {
        action: action,
        payload: payload,
        timestamp: new Date().toISOString(),
        success: true
      };

      window.parent.postMessage(message, this.repsparkOrigin);
      console.log('Sent message to RepSpark:', message);
    } catch (error) {
      console.error('Failed to send message to RepSpark:', error);
      
      // Send error message
      try {
        window.parent.postMessage({
          action: 'ERROR',
          payload: { 
            message: error.message,
            originalAction: action 
          },
          success: false,
          timestamp: new Date().toISOString()
        }, this.repsparkOrigin);
      } catch (secondError) {
        console.error('Failed to send error message to RepSpark:', secondError);
      }
    }
  }

  // NEW: Method to generate full URLs from relative paths
  getFullLogoUrl(relativePath) {
    // Handle different path formats
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      // Already a full URL
      return relativePath;
    }
    
    // Get the current domain
    const baseUrl = window.location.origin;
    
    // Remove leading './' if present
    let cleanPath = relativePath.replace(/^\.\//, '');
    
    // Ensure path starts with '/' for proper URL construction
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    return `${baseUrl}${cleanPath}`;
  }

  // UPDATED JWT PARSING METHOD
  parseJWTFromURL() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        console.log('Raw JWT token received:', token);
        
        // Parse JWT structure
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format - expected 3 parts (header.payload.signature)');
        }
        
        // Decode the payload (second part)
        const payload = parts[1];
        // Add padding if needed for base64 decoding
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        
        const decodedPayload = JSON.parse(atob(paddedPayload));
        console.log('Decoded JWT payload:', decodedPayload);
        
        // Validate JWT claims
        const now = Math.floor(Date.now() / 1000);
        
        if (decodedPayload.exp && now > decodedPayload.exp) {
          throw new Error('JWT token has expired');
        }
        
        if (decodedPayload.nbf && now < decodedPayload.nbf) {
          throw new Error('JWT token not yet valid (nbf claim)');
        }
        
        // Validate issuer - handle both repspark.net and app.repspark.com
        const validIssuers = ['repspark.net', 'https://app.repspark.com'];
        if (decodedPayload.iss && !validIssuers.includes(decodedPayload.iss)) {
          console.warn('Unexpected JWT issuer:', decodedPayload.iss);
        }
        
        // Handle compressed payload if needed
        let actualPayload;
        if (decodedPayload.compressed === true) {
          // Handle gzip decompression
          console.log('JWT payload is compressed - attempting decompression');
          try {
            actualPayload = this.decompressPayload(decodedPayload.payload);
          } catch (compressionError) {
            console.error('Failed to decompress payload:', compressionError);
            console.warn('Falling back to raw payload data');
            actualPayload = decodedPayload.payload;
          }
        } else {
          actualPayload = decodedPayload.payload;
        }
        
        console.log('Extracted payload data:', actualPayload);
        
        // Store the JWT data
        this.jwtData = {
          ...actualPayload,
          // Add metadata from JWT claims
          _jwtClaims: {
            issued: decodedPayload.iat,
            expires: decodedPayload.exp,
            notBefore: decodedPayload.nbf,
            issuer: decodedPayload.iss,
            compressed: decodedPayload.compressed
          }
        };
        
        this.updateProductFromJWT();
        
      } else {
        console.log('No JWT token found, using demo data');
        this.jwtData = {
          productNumber: 'CNC-P1000',
          productName: 'Seaside Performance Polo - Navy Men\'s',
          productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
        };
        this.updateProductFromJWT();
      }
    } catch (error) {
      console.error('Error parsing JWT:', error);
      // Fallback to demo data
      this.jwtData = {
        productNumber: 'CNC-P1000',
        productName: 'Seaside Performance Polo - Navy Men\'s',
        productImage: this.PRODUCT_CONFIG['CNC-P1000'].image,
        _error: error.message
      };
      this.updateProductFromJWT();
    }
  }

  // NEW: Handle gzip decompression for compressed payloads
  decompressPayload(compressedBase64) {
    // Note: This is a simplified implementation
    // For full gzip support in browsers, you'd typically need a library like 'pako'
    console.warn('Compressed JWT payload detected - basic decompression attempted');
    
    try {
      // Convert base64 to bytes
      const compressedBytes = atob(compressedBase64);
      
      // For now, just return the base64 decoded content as a fallback
      // In production, you'd want to implement proper gzip decompression
      console.warn('Full gzip decompression not implemented - using fallback');
      
      // Try to parse as JSON in case it's not actually compressed
      try {
        return JSON.parse(compressedBytes);
      } catch (jsonError) {
        console.warn('Compressed payload is not valid JSON, returning as string');
        return { rawData: compressedBytes };
      }
    } catch (error) {
      console.error('Decompression failed:', error);
      throw new Error('Failed to decompress JWT payload');
    }
  }

  getCoordinatedColors(productColor) {
    const colorConfig = {
      'Navy': {
        swatches: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
        filter: 'hue-rotate(15deg) saturate(1.1) brightness(0.9)'
      },
      'Blue': {
        swatches: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa'],
        filter: 'hue-rotate(10deg) saturate(1.2) brightness(0.95)'
      },
      'White': {
        swatches: ['#374151', '#6b7280', '#9ca3af', '#d1d5db'],
        filter: 'saturate(0.4) brightness(0.85) contrast(1.1)'
      }
    };
    
    return colorConfig[productColor] || {
      swatches: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      filter: 'hue-rotate(10deg) saturate(1.1)'
    };
  }

  updateProductFromJWT() {
    if (this.jwtData) {
      const productId = this.jwtData.productNumber || 
                       this.jwtData.productId || 
                       this.jwtData.product?.id ||
                       this.jwtData.product?.productNumber;

      if (productId && this.PRODUCT_CONFIG[productId]) {
        const product = this.PRODUCT_CONFIG[productId];
        
        const coordinatedOption = this.threadColors.find(color => color.id === 'coordinated');
        if (coordinatedOption) {
          const colorConfig = this.getCoordinatedColors(product.color);
          coordinatedOption.swatches = colorConfig.swatches;
          coordinatedOption.logoStyle.filter = colorConfig.filter;
        }
        
        const titleElement = document.getElementById('product-title');
        if (titleElement) {
          titleElement.textContent = `${product.gender} ${product.name} - ${product.color}`;
        }
        
        const imageElement = document.getElementById('product-image');
        if (imageElement) {
          imageElement.src = product.image;
          imageElement.alt = product.alt;
        }
        
        this.renderThreadColors();
        
        if (this.state.selectedThreadColor === 'coordinated') {
          this.updateLogoOverlay();
        }
        
        console.log(`Product updated to: ${product.name} - ${product.color} ${product.gender}`);
      } else {
        const titleElement = document.getElementById('product-title');
        if (titleElement && this.jwtData.productName) {
          titleElement.textContent = this.jwtData.productName;
        }
        
        const imageElement = document.getElementById('product-image');
        if (imageElement && this.jwtData.productImage) {
          imageElement.src = this.jwtData.productImage;
        }
      }
    }
  }

  renderLogos() {
    const logoGrid = document.getElementById('logo-grid');
    const filteredLogos = this.getFilteredLogos();

    if (filteredLogos.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();
    this.updateSearchInfo(filteredLogos.length);

    logoGrid.innerHTML = filteredLogos.map(logo => `
      <button class="logo-option ${this.state.selectedLogo === logo.id ? 'selected' : ''}"
              data-logo="${logo.id}" type="button" aria-label="${logo.name}">
        <img class="logo-preview-img" src="${logo.preview}" alt="${logo.name}" loading="lazy"
             onerror="this.onerror=null; this.src='./images/fallback.png';">
        <span class="logo-name">${logo.name}</span>
      </button>
    `).join('');

    logoGrid.querySelectorAll('.logo-option').forEach(option => {
      option.addEventListener('click', () => {
        const logoId = option.dataset.logo;
        this.selectLogo(logoId);
      });
    });
  }

  renderThreadColors() {
    const container = document.getElementById('thread-color-options');
    
    container.innerHTML = this.threadColors.map(colorOption => `
      <button class="thread-color-option ${this.state.selectedThreadColor === colorOption.id ? 'selected' : ''}" 
              data-color="${colorOption.id}">
        <div class="thread-color-header">
          <div class="thread-color-info">
            <div class="thread-color-name">${colorOption.name}</div>
            <div class="thread-color-desc">${colorOption.description}</div>
          </div>
          <div class="thread-color-indicator ${this.state.selectedThreadColor === colorOption.id ? '' : 'hidden'}"></div>
        </div>
        <div class="thread-color-swatches">
          ${colorOption.swatches.map(swatch => 
            `<div class="color-swatch" style="background-color: ${swatch};"></div>`
          ).join('')}
        </div>
      </button>
    `).join('');

    container.querySelectorAll('.thread-color-option').forEach(option => {
      option.addEventListener('click', () => {
        const colorId = option.dataset.color;
        this.selectThreadColor(colorId);
      });
    });
  }

  getFilteredLogos() {
    if (!this.state.logoSearchQuery.trim()) {
      return this.initialLogos;
    }
    return this.allLogos.filter(logo =>
      logo.name.toLowerCase().includes(this.state.logoSearchQuery.toLowerCase())
    );
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
    const searchInfo = document.getElementById('search-results-info');
    if (this.state.logoSearchQuery.trim() && count > 0) {
      searchInfo.textContent = `Showing ${count} of ${this.allLogos.length} logos`;
      searchInfo.classList.remove('hidden');
    } else {
      searchInfo.classList.add('hidden');
    }
  }

  bindEvents() {
    // Logo search
    const searchInput = document.getElementById('logo-search');
    searchInput.addEventListener('input', (e) => {
      this.state.logoSearchQuery = e.target.value;
      this.renderLogos();
    });

    // Placement radio buttons
    document.querySelectorAll('input[name="placement"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.selectedPlacement = e.target.value;
        this.updateLogoOverlay();
        // Notify RepSpark of state change
        if (this.isEmbedded) {
          this.sendMessageToRepSpark('STATE_CHANGED', {
            state: this.getCustomizationState(),
            field: 'placement'
          });
        }
      });
    });

    // Add to cart
    document.getElementById('add-to-cart').addEventListener('click', () => {
      this.addToCart();
    });
  }

  selectLogo(logoId) {
    this.state.selectedLogo = logoId;

    document.querySelectorAll('.logo-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.logo === logoId);
    });

    this.updateLogoOverlay();
    
    // Notify RepSpark of state change
    if (this.isEmbedded) {
      this.sendMessageToRepSpark('STATE_CHANGED', {
        state: this.getCustomizationState(),
        field: 'logo'
      });
    }
  }

  selectThreadColor(colorId) {
    this.state.selectedThreadColor = colorId;

    document.querySelectorAll('.thread-color-option').forEach(option => {
      const isSelected = option.dataset.color === colorId;
      option.classList.toggle('selected', isSelected);

      const indicator = option.querySelector('.thread-color-indicator');
      indicator.classList.toggle('hidden', !isSelected);
    });

    this.updateLogoOverlay();
    
    // Notify RepSpark of state change
    if (this.isEmbedded) {
      this.sendMessageToRepSpark('STATE_CHANGED', {
        state: this.getCustomizationState(),
        field: 'threadColor'
      });
    }
  }

  // NEW IMPROVED ZOOM IMPLEMENTATION
  setupProductImageZoom() {
    const productImage = document.getElementById('product-image');
    const imageContainer = productImage.parentElement;
    
    if (!productImage) return;

    // Create a wrapper that will contain both image and logo
    const zoomWrapper = document.createElement('div');
    zoomWrapper.id = 'zoom-wrapper';
    zoomWrapper.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      transform-origin: center center;
      transition: transform 0.3s ease-out;
    `;

    // Move the image into the wrapper
    const parent = productImage.parentNode;
    parent.insertBefore(zoomWrapper, productImage);
    zoomWrapper.appendChild(productImage);

    // Set up container for zoom
    imageContainer.style.position = 'relative';
    imageContainer.style.overflow = 'hidden';

    // Reset image styles since wrapper handles transforms
    productImage.style.width = '100%';
    productImage.style.height = '100%';
    productImage.style.objectFit = 'cover';
    productImage.style.cursor = 'zoom-in';
    productImage.title = 'Hover to zoom and explore details';

    // Mouse enter - start zoom
    const handleMouseEnter = (e) => {
      if (!this.isZoomed) {
        this.isZoomed = true;
        
        // Move logo to wrapper if it exists and is visible
        const logoOverlay = document.getElementById('logo-overlay');
        if (logoOverlay && !logoOverlay.classList.contains('hidden')) {
          zoomWrapper.appendChild(logoOverlay);
          logoOverlay.style.pointerEvents = 'none';
        }
        
        // Scale the entire wrapper (image + logo together)
        zoomWrapper.style.transform = 'scale(2)';
        productImage.style.cursor = 'zoom-out';
        zoomWrapper.style.zIndex = '100';
      }
    };

    // Mouse move - follow cursor for pan effect
    const handleMouseMove = (e) => {
      if (this.isZoomed) {
        const rect = imageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate transform based on mouse position
        const moveX = (centerX - x) * 0.3; // Reduced multiplier for smoother pan
        const moveY = (centerY - y) * 0.3;
        
        // Apply transform to wrapper (affects both image and logo)
        zoomWrapper.style.transform = `scale(2) translate(${moveX}px, ${moveY}px)`;
      }
    };

    // Mouse leave - reset zoom
    const handleMouseLeave = (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (this.isZoomed) {
          this.isZoomed = false;
          
          // Reset wrapper transform
          zoomWrapper.style.transform = 'scale(1)';
          productImage.style.cursor = 'zoom-in';
          zoomWrapper.style.zIndex = '1';
          
          // Reset logo pointer events only
          const logoOverlay = document.getElementById('logo-overlay');
          if (logoOverlay) {
            logoOverlay.style.pointerEvents = 'auto';
          }
        }
      }
    };

    // Add event listeners to the container for better coverage
    imageContainer.addEventListener('mouseenter', handleMouseEnter);
    imageContainer.addEventListener('mousemove', handleMouseMove);
    imageContainer.addEventListener('mouseleave', handleMouseLeave);
  }

  // UPDATED LOGO OVERLAY METHOD
  updateLogoOverlay() {
    const overlay = document.getElementById('logo-overlay');
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    if (selectedLogo) {
      overlay.innerHTML = '';

      if (/\.(png|jpg|jpeg|svg)$/i.test(selectedLogo.preview)) {
        const img = document.createElement('img');
        img.src = selectedLogo.preview;
        img.alt = selectedLogo.name;
        img.style.width = '40px';
        img.style.height = '30px';
        img.style.objectFit = 'contain';
        
        if (selectedThreadColor && selectedThreadColor.logoStyle) {
          img.style.filter = selectedThreadColor.logoStyle.filter;
        } else {
          img.style.filter = 'none';
        }
        
        overlay.style.border = 'none';
        overlay.style.backgroundColor = 'transparent';
        overlay.style.padding = '0';
        
        img.onerror = () => { 
          img.remove(); 
          overlay.textContent = selectedLogo.name; 
        };
        overlay.appendChild(img);
      } else {
        overlay.textContent = selectedLogo.preview;
      }

      overlay.className = `logo-overlay ${this.state.selectedPlacement}`;
      overlay.classList.remove('hidden');
      
      // ALWAYS ensure the logo is in the zoom wrapper
      const zoomWrapper = document.getElementById('zoom-wrapper');
      if (zoomWrapper && overlay.parentElement !== zoomWrapper) {
        zoomWrapper.appendChild(overlay);
      }
    } else {
      overlay.classList.add('hidden');
    }
  }

  // ENHANCED ADD TO CART WITH FULL REPSPARK INTEGRATION AND LOGO URL
  addToCart() {
    // Validate before proceeding
    const validation = this.validateCustomizations();
    
    if (!validation.isValid) {
      // Show validation errors to user
      alert('Please complete your customization:\n' + validation.errors.join('\n'));
      return;
    }

    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    const customizationData = {
      productNumber: this.jwtData?.productNumber || 'CNC-P1000',
      customizations: {
        logo: {
          id: selectedLogo.id,
          name: selectedLogo.name,
          preview: selectedLogo.preview, // Keep original relative path
          url: this.getFullLogoUrl(selectedLogo.preview) // Add full accessible URL
        },
        placement: this.state.selectedPlacement,
        threadColor: selectedThreadColor
      },
      pricing: {
        logoFee: 5.00,
        currency: 'USD'
      },
      isValid: true,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    console.log('Sending customization data back to RepSpark:', customizationData);

    try {
      if (this.isEmbedded) {
        // Send to RepSpark via postMessage
        this.sendMessageToRepSpark('SAVE', customizationData);
        
        // Show success message
        console.log('Customization sent to RepSpark successfully');
        
        // Optional: Show user feedback
        this.showSuccessMessage('Customization added to cart!');
        
      } else {
        // Fallback for testing outside RepSpark
        alert(`Added to cart!\n\nLogo: ${selectedLogo.name}\nLogo URL: ${this.getFullLogoUrl(selectedLogo.preview)}\nPlacement: ${this.state.selectedPlacement} chest\nThread Color: ${selectedThreadColor.name}\nLogo Fee: $5.00`);
        console.log('Demo mode - customization data:', customizationData);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Send error to RepSpark
      this.sendMessageToRepSpark('ERROR', { 
        message: error.message,
        action: 'SAVE'
      });
      
      // Show error to user
      alert('There was an error adding your customization to cart. Please try again.');
    }
  }

  // NEW: Show success message to user
  showSuccessMessage(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
    
    // Add CSS animations if not already present
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ENHANCED: Get current customization state with logo URL and pricing
  getCustomizationState() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    return {
      selectedLogo: selectedLogo ? {
        id: selectedLogo.id,
        name: selectedLogo.name,
        preview: selectedLogo.preview, // Keep original relative path
        url: this.getFullLogoUrl(selectedLogo.preview) // Add full accessible URL
      } : null,
      placement: this.state.selectedPlacement,
      threadColor: selectedThreadColor,
      searchQuery: this.state.logoSearchQuery,
      validation: this.validateCustomizations(),
      productInfo: {
        productNumber: this.jwtData?.productNumber,
        productName: this.jwtData?.productName
      },
      pricing: {
        logoFee: 5.00,
        currency: 'USD'
      }
    };
  }

  // NEW: Get pricing information (placeholder for future enhancement)
  getPricingInfo() {
    // This would integrate with your pricing logic
    const basePricing = {
      logoPlacement: 3.50,
      setupFee: 15.00,
      additionalColors: 1.25
    };
    
    return {
      ...basePricing,
      total: basePricing.logoPlacement + basePricing.setupFee
    };
  }

  // NEW: Export configuration for external use
  exportConfiguration() {
    return {
      state: this.state,
      customizations: this.getCustomizationState(),
      pricing: this.getPricingInfo(),
      validation: this.validateCustomizations(),
      metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    };
  }

  // NEW: Import configuration from external source
  importConfiguration(config) {
    if (!config || !config.state) {
      console.error('Invalid configuration format');
      return false;
    }

    try {
      // Validate configuration structure
      if (config.state.selectedLogo && 
          config.state.selectedPlacement && 
          config.state.selectedThreadColor) {
        
        this.state = { ...this.state, ...config.state };
        this.updateUIFromState();
        this.updateLogoOverlay();
        
        console.log('Configuration imported successfully');
        return true;
      }
    } catch (error) {
      console.error('Error importing configuration:', error);
    }
    
    return false;
  }

  // NEW: Handle window resize for responsive behavior
  handleResize() {
    // Recalculate zoom positioning if needed
    if (this.isZoomed) {
      const zoomWrapper = document.getElementById('zoom-wrapper');
      if (zoomWrapper) {
        zoomWrapper.style.transform = 'scale(1)';
        this.isZoomed = false;
      }
    }
    
    // Update logo overlay positioning
    this.updateLogoOverlay();
  }

  // NEW: Cleanup method for proper disposal
  destroy() {
    // Remove event listeners
    window.removeEventListener('message', this.repSparkMessageHandler);
    window.removeEventListener('resize', this.handleResize);
    
    // Clear any timers or intervals
    // (none in current implementation, but good practice)
    
    console.log('ClubCoastCustomizer destroyed');
  }
}

// Add resize handler
window.addEventListener('resize', () => {
  if (window.customizer) {
    window.customizer.handleResize();
  }
});

// Initialize the customizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.customizer = new ClubCoastCustomizer();
});

// Export for external access (useful for debugging and testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClubCoastCustomizer;
}
