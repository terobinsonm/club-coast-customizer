class ClubCoastCustomizer {
  constructor() {
    // Product configuration - ADDED
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
      { id: '8',  name: 'Cypress Point Club',             preview: './images/cypress-point.png' },
      { id: '9',  name: 'Ocean Reef Club',                preview: './images/ocean-reef.png' },
      { id: '10', name: 'Boca Raton Resort & Club',       preview: './images/boca-raton.png' },
      { id: '11', name: 'Austin Country Club',            preview: './images/austin-cc.png' },
      { id: '12', name: 'Newport Country Club',           preview: './images/newport-cc.png' },
      { id: '13', name: 'Barton Creek Resort',            preview: './images/barton-creek.png' },
      { id: '14', name: 'Desert Mountain Club',           preview: './images/desert-mountain.png' },
      { id: '15', name: 'Longboat Key Club',              preview: './images/longboat-key.png' },
      { id: '16', name: 'Palmetto Bluff Club Store',      preview: './images/palmetto-bluff.png' },
    ];

    // Initially displayed logos (first 4)
    this.initialLogos = this.allLogos.slice(0, 4);

    // Thread color options
    this.threadColors = [
      { 
        id: 'club',
        name: 'Club colors',
        description: 'Brand-specific thread colors',
        swatches: ['#1f2937', '#dc2626', '#2563eb', '#059669']
      },
      { 
        id: 'coordinated',
        name: 'Coordinated',
        description: 'Complementary color palette',
        swatches: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
      },
      { 
        id: 'tonal',
        name: 'Tonal',
        description: 'Matching shirt color tones',
        swatches: ['#f9fafb', '#e5e7eb', '#9ca3af', '#6b7280']
      },
    ];

    // Current state
    this.state = {
      selectedLogo: '1',
      selectedPlacement: 'left',
      selectedThreadColor: 'club',
      logoSearchQuery: '',
      quantity: 1
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
            // MODIFIED - use product config for demo
            this.jwtData = {
                productNumber: 'CNC-P1000',
                productName: 'Seaside Performance Polo - Navy Men\'s',
                productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
            };
            this.updateProductFromJWT();
        }
    } catch (error) {
        console.error('Error parsing JWT:', error);
        // MODIFIED - use product config for fallback
        this.jwtData = {
            productNumber: 'CNC-P1000',
            productName: 'Seaside Performance Polo - Navy Men\'s',
            productImage: this.PRODUCT_CONFIG['CNC-P1000'].image
        };
        this.updateProductFromJWT();
    }
  }

  updateProductFromJWT() {
    if (this.jwtData) {
      // MODIFIED - check for product config first
      const productId = this.jwtData.productNumber || 
                       this.jwtData.productId || 
                       this.jwtData.product?.id ||
                       this.jwtData.product?.productNumber;

      if (productId && this.PRODUCT_CONFIG[productId]) {
        const product = this.PRODUCT_CONFIG[productId];
        
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
        
        console.log(`Product updated to: ${product.name} - ${product.color} ${product.gender}`);
      } else {
        // Original fallback logic
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

    // Quantity controls - check if elements exist
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (this.state.quantity > 1) {
          this.state.quantity--;
          this.updateQuantityDisplay();
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        this.state.quantity++;
        this.updateQuantityDisplay();
      });
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

  selectThreadColor(colorId) {
    this.state.selectedThreadColor = colorId;

    // Update thread color selection visual state
    document.querySelectorAll('.thread-color-option').forEach(option => {
      const isSelected = option.dataset.color === colorId;
      option.classList.toggle('selected', isSelected);

      const indicator = option.querySelector('.thread-color-indicator');
      indicator.classList.toggle('hidden', !isSelected);
    });
  }

  updateLogoOverlay() {
    const overlay = document.getElementById('logo-overlay');
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);

    if (selectedLogo) {
      overlay.innerHTML = '';

      if (/\.(png|jpg|jpeg|svg)$/i.test(selectedLogo.preview)) {
        const img = document.createElement('img');
        img.src = selectedLogo.preview;
        img.alt = selectedLogo.name;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.objectFit = 'contain';
        img.onerror = () => { img.remove(); overlay.textContent = selectedLogo.name; };
        overlay.appendChild(img);
      } else {
        overlay.textContent = selectedLogo.preview; // fallback
      }

      overlay.className = `logo-overlay ${this.state.selectedPlacement}`;
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  }

  updateQuantityDisplay() {
    const quantityDisplay = document.getElementById('quantity');
    if (quantityDisplay) {
      quantityDisplay.textContent = this.state.quantity;
    }
  }

  addToCart() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    const customizationData = {
      productNumber: this.jwtData?.productNumber || 'CNC-P1000', // MODIFIED - better fallback
      customizations: {
        logo: selectedLogo,
        placement: this.state.selectedPlacement,
        threadColor: selectedThreadColor,
        quantity: this.state.quantity
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
      // Demo mode - show alert
      alert(`Added to cart!\n\nLogo: ${selectedLogo.name}\nPlacement: ${this.state.selectedPlacement} chest\nThread Color: ${selectedThreadColor.name}\nQuantity: ${this.state.quantity}`);
    }
  }

  // Method to get current customization state (for RepSpark integration)
  getCustomizationState() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    return {
      selectedLogo,
      placement: this.state.selectedPlacement,
      threadColor: selectedThreadColor,
      quantity: this.state.quantity
    };
  }
}

// Initialize the customizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ClubCoastCustomizer();
});
