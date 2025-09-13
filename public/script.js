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

    // JWT data from RepSpark (will be populated from URL params)
    this.jwtData = null;
    
    // All available logos (your current working version)
    this.allLogos = [
      { id: '1',  name: 'Kiawah Island Golf Resort',      preview: './images/kiawah.png' },
      { id: '2',  name: 'Whistling Straits Golf Shop',    preview: './images/whistling-straits.png' },
      { id: '3',  name: 'Bandon Dunes Golf Resort',       preview: './images/bandon-dunes.png' },
      { id: '4',  name: 'Augusta National Golf Shop',     preview: './images/augusta.png' },
      { id: '5',  name: 'Pinehurst Resort',               preview: './images/pinehurst.png' },
      { id: '6',  name: 'Torrey Pines Golf Course',       preview: './images/torrey-pines.png' },
      { id: '7',  name: 'TPC Sawgrass',                   preview: './images/tpc-sawgrass.png' },
    ];

    // Initially displayed logos (first 4)
    this.initialLogos = this.allLogos.slice(0, 4);

    // Updated thread colors with dynamic color coordination
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
        swatches: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'], // Will be updated dynamically
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

    this.init();
  }

  init() {
    this.parseJWTFromURL();
    this.renderLogos();
    this.renderThreadColors();
    this.bindEvents();
    this.updateLogoOverlay();
    console.log('Club & Coast Customizer initialized');
  }

  parseJWTFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            console.log('Raw token received:', token);
            
            // Split the JWT into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            
            this.jwtData = JSON.parse(atob(paddedPayload));
            console.log('JWT Data received:', this.jwtData);
            
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
            productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
        };
        this.updateProductFromJWT();
    }
  }

  // Updated method to get color-coordinated palette AND filter effects
  getCoordinatedColors(productColor) {
    const colorConfig = {
      'Navy': {
        swatches: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
        filter: 'hue-rotate(15deg) saturate(1.1) brightness(0.9)' // Subtle blue shift
      },
      'Blue': {
        swatches: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa'],
        filter: 'hue-rotate(10deg) saturate(1.2) brightness(0.95)' // Slight blue enhancement
      },
      'White': {
        swatches: ['#374151', '#6b7280', '#9ca3af', '#d1d5db'],
        filter: 'saturate(0.4) brightness(0.85) contrast(1.1)' // Muted/gray tones
      }
    };
    
    return colorConfig[productColor] || {
      swatches: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
      filter: 'hue-rotate(10deg) saturate(1.1)'
    };
  }

  // Updated updateProductFromJWT to update both swatches AND filter effects
  updateProductFromJWT() {
    if (this.jwtData) {
      // Extract product ID from JWT payload
      const productId = this.jwtData.productNumber || 
                       this.jwtData.productId || 
                       this.jwtData.product?.id ||
                       this.jwtData.product?.productNumber;

      if (productId && this.PRODUCT_CONFIG[productId]) {
        const product = this.PRODUCT_CONFIG[productId];
        
        // Update coordinated thread color swatches AND filter based on product color
        const coordinatedOption = this.threadColors.find(color => color.id === 'coordinated');
        if (coordinatedOption) {
          const colorConfig = this.getCoordinatedColors(product.color);
          coordinatedOption.swatches = colorConfig.swatches;
          coordinatedOption.logoStyle.filter = colorConfig.filter;
        }
        
        // Update product title
        const titleElement = document.getElementById('product-title');
        if (titleElement) {
          titleElement.textContent = `${product.name} - ${product.color} ${product.gender}`;
        }
        
        // Update product image
        const imageElement = document.getElementById('product-image');
        if (imageElement) {
          imageElement.src = product.image;
          imageElement.alt = product.alt;
        }
        
        // Re-render thread colors to show updated swatches
        this.renderThreadColors();
        
        // Update logo overlay if coordinated is currently selected
        if (this.state.selectedThreadColor === 'coordinated') {
          this.updateLogoOverlay();
        }
        
        console.log(`Product updated to: ${product.name} - ${product.color} ${product.gender}`);
      } else {
        // Fallback to JWT data or default
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

    // Add click handlers
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

    // Add click handlers
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
      });
    });

    // Product image click to zoom
    const productImage = document.getElementById('product-image');
    if (productImage) {
      productImage.addEventListener('click', () => {
        this.openSimpleZoom();
      });
      productImage.style.cursor = 'pointer';
      productImage.title = 'Click to zoom';
    }

    // Add to cart
    document.getElementById('add-to-cart').addEventListener('click', () => {
      this.addToCart();
    });
  }

  selectLogo(logoId) {
    this.state.selectedLogo = logoId;

    // Update logo selection visual state
    document.querySelectorAll('.logo-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.logo === logoId);
    });

    this.updateLogoOverlay();
  }

  // Fixed selectThreadColor method
  selectThreadColor(colorId) {
    this.state.selectedThreadColor = colorId;

    // Update thread color selection visual state
    document.querySelectorAll('.thread-color-option').forEach(option => {
      const isSelected = option.dataset.color === colorId;
      option.classList.toggle('selected', isSelected);

      const indicator = option.querySelector('.thread-color-indicator');
      indicator.classList.toggle('hidden', !isSelected);
    });

    // Update logo overlay to reflect new thread color
    this.updateLogoOverlay();
  }

  // Updated updateLogoOverlay method - removed borders and backgrounds
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
        
        // Apply only filter effects - no borders or backgrounds
        if (selectedThreadColor && selectedThreadColor.logoStyle) {
          img.style.filter = selectedThreadColor.logoStyle.filter;
        } else {
          img.style.filter = 'none';
        }
        
        // Reset overlay styling to transparent
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
    } else {
      overlay.classList.add('hidden');
    }
  }

  addToCart() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    const customizationData = {
      productNumber: this.jwtData?.productNumber || 'CNC-P1000',
      customizations: {
        logo: selectedLogo,
        placement: this.state.selectedPlacement,
        threadColor: selectedThreadColor
      },
      timestamp: new Date().toISOString()
    };

    console.log('Sending customization data back to RepSpark:', customizationData);

    // Send data back to RepSpark parent window
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        action: 'SAVE',
        payload: customizationData
      }, 'https://app.repspark.com');
    } else {
      // Demo mode - show alert (removed quantity from alert)
      alert(`Added to cart!\n\nLogo: ${selectedLogo.name}\nPlacement: ${this.state.selectedPlacement} chest\nThread Color: ${selectedThreadColor.name}`);
    }
  }

  // Method to get current customization state (for RepSpark integration)
  getCustomizationState() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    return {
      selectedLogo,
      placement: this.state.selectedPlacement,
      threadColor: selectedThreadColor
    };
  }

  // Simple click-to-zoom modal
  openSimpleZoom() {
    const productImage = document.getElementById('product-image');
    const logoOverlay = document.getElementById('logo-overlay');
    
    if (!productImage) return;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      cursor: pointer;
    `;

    // Create image container
    const container = document.createElement('div');
    container.style.cssText = `
      position: relative;
      max-width: 80vw;
      max-height: 80vh;
    `;

    // Create enlarged image
    const enlargedImage = document.createElement('img');
    enlargedImage.src = productImage.src;
    enlargedImage.alt = productImage.alt;
    enlargedImage.style.cssText = `
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 80vh;
      border-radius: 8px;
    `;

    // Add logo overlay if visible
    if (logoOverlay && !logoOverlay.classList.contains('hidden')) {
      const enlargedLogoOverlay = logoOverlay.cloneNode(true);
      enlargedLogoOverlay.style.position = 'absolute';
      enlargedLogoOverlay.style.pointerEvents = 'none';
      
      // Scale up logo (3x larger)
      const logoImg = enlargedLogoOverlay.querySelector('img');
      if (logoImg) {
        logoImg.style.width = '120px';
        logoImg.style.height = '90px';
      }
      
      // Position based on placement
      if (this.state.selectedPlacement === 'left') {
        enlargedLogoOverlay.style.left = '15%';
        enlargedLogoOverlay.style.top = '25%';
      } else if (this.state.selectedPlacement === 'right') {
        enlargedLogoOverlay.style.right = '15%';
        enlargedLogoOverlay.style.top = '25%';
      } else {
        enlargedLogoOverlay.style.left = '50%';
        enlargedLogoOverlay.style.top = '30%';
        enlargedLogoOverlay.style.transform = 'translateX(-50%)';
      }
      
      container.appendChild(enlargedLogoOverlay);
    }

    // Create close button
    const closeButton = document.createElement('div');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: -15px;
      right: -15px;
      width: 30px;
      height: 30px;
      background: white;
      color: black;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10000;
    `;

    // Assemble modal
    container.appendChild(enlargedImage);
    container.appendChild(closeButton);
    modal.appendChild(container);
    document.body.appendChild(modal);

    // Close handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    closeButton.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

    // Prevent container clicks from closing
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Initialize the customizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ClubCoastCustomizer();
});

