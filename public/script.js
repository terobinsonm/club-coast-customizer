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

    this.init();
  }

  init() {
    this.parseJWTFromURL();
    this.renderLogos();
    this.renderThreadColors();
    this.bindEvents();
    this.setupProductImageZoom(); // Initialize zoom functionality
    this.updateLogoOverlay();
    console.log('Club & Coast Customizer initialized');
  }

  // Fixed zoom functionality
  setupProductImageZoom() {
    const productImage = document.getElementById('product-image');
    const imageContainer = productImage.parentElement;
    
    if (!productImage) return;

    // Set up container for zoom
    imageContainer.style.position = 'relative';
    imageContainer.style.overflow = 'hidden';
    
    // Store original styles
    const originalStyles = {
      transform: productImage.style.transform || 'none',
      transition: productImage.style.transition || '',
      cursor: productImage.style.cursor || 'default'
    };

    // Create a larger hover zone that includes both image and overlay
    const createHoverZone = () => {
      const logoOverlay = document.getElementById('logo-overlay');
      return logoOverlay && !logoOverlay.classList.contains('hidden') ? 
        [productImage, logoOverlay] : [productImage];
    };

    // Mouse enter - start zoom (works for both image and overlay)
    const handleMouseEnter = (e) => {
      if (!this.isZoomed) {
        this.isZoomed = true;
        productImage.style.transition = 'transform 0.3s ease-out';
        productImage.style.transform = 'scale(2)';
        productImage.style.cursor = 'zoom-out';
        productImage.style.zIndex = '100';
        
        // Scale logo overlay but keep it in fixed position relative to garment
        const logoOverlay = document.getElementById('logo-overlay');
        if (logoOverlay && !logoOverlay.classList.contains('hidden')) {
          logoOverlay.style.transition = 'transform 0.3s ease-out';
          logoOverlay.style.transform = 'scale(2)';
          logoOverlay.style.zIndex = '101';
          logoOverlay.style.pointerEvents = 'none'; // Allow mouse events to pass through
        }
      }
    };

    // Mouse move - follow cursor for pan effect (only on container)
    const handleMouseMove = (e) => {
      if (this.isZoomed) {
        const rect = imageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate transform based on mouse position
        const moveX = (centerX - x) * 0.5; // Reduce movement for smoother effect
        const moveY = (centerY - y) * 0.5;
        
        productImage.style.transform = `scale(2) translate(${moveX}px, ${moveY}px)`;
        
        // Keep logo overlay in the same relative position - it scales but doesn't pan
        const logoOverlay = document.getElementById('logo-overlay');
        if (logoOverlay && !logoOverlay.classList.contains('hidden')) {
          // Logo stays in fixed position relative to the garment, only scales
          logoOverlay.style.transform = `scale(2)`;
        }
      }
    };

    // Mouse leave - reset zoom
    const handleMouseLeave = (e) => {
      // Check if mouse is leaving the entire container area
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Only reset if mouse is actually outside the container
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        if (this.isZoomed) {
          this.isZoomed = false;
          productImage.style.transform = originalStyles.transform;
          productImage.style.cursor = 'zoom-in';
          productImage.style.zIndex = '1';
          
          // Reset logo overlay
          const logoOverlay = document.getElementById('logo-overlay');
          if (logoOverlay) {
            logoOverlay.style.transform = '';
            logoOverlay.style.zIndex = '';
            logoOverlay.style.pointerEvents = 'auto'; // Restore pointer events
          }
        }
      }
    };

    // Add event listeners to image
    productImage.addEventListener('mouseenter', handleMouseEnter);
    productImage.addEventListener('mousemove', handleMouseMove);
    productImage.addEventListener('mouseleave', handleMouseLeave);

    // Also add listeners to the container to handle overlay interactions
    imageContainer.addEventListener('mouseleave', handleMouseLeave);
    imageContainer.addEventListener('mousemove', handleMouseMove);

    // Set initial cursor
    productImage.style.cursor = 'zoom-in';
    productImage.title = 'Hover to zoom and explore details';
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
          titleElement.textContent = `${product.name} - ${product.color} ${product.gender}`;
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
  }

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

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        action: 'SAVE',
        payload: customizationData
      }, 'https://app.repspark.com');
    } else {
      alert(`Added to cart!\n\nLogo: ${selectedLogo.name}\nPlacement: ${this.state.selectedPlacement} chest\nThread Color: ${selectedThreadColor.name}`);
    }
  }

  getCustomizationState() {
    const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
    const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);

    return {
      selectedLogo,
      placement: this.state.selectedPlacement,
      threadColor: selectedThreadColor
    };
  }
}

// Initialize the customizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ClubCoastCustomizer();
});
