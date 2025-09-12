class ClubCoastCustomizer {
    constructor() {
        // All available logos (matching Figma data)
        this.allLogos = [
            { id: '1', name: 'Company logo A', preview: '🏢' },
            { id: '2', name: 'Company logo B', preview: '⭐' },
            { id: '3', name: 'Company logo C', preview: '🔥' },
            { id: '4', name: 'Company logo D', preview: '💎' },
            { id: '5', name: 'Sports team logo', preview: '⚽' },
            { id: '6', name: 'Technology brand', preview: '💻' },
            { id: '7', name: 'Healthcare logo', preview: '🏥' },
            { id: '8', name: 'Education institute', preview: '🎓' },
            { id: '9', name: 'Automotive brand', preview: '🚗' },
            { id: '10', name: 'Finance company', preview: '💰' },
            { id: '11', name: 'Restaurant chain', preview: '🍽️' },
            { id: '12', name: 'Retail brand', preview: '🛍️' },
            { id: '13', name: 'Construction corp', preview: '🏗️' },
            { id: '14', name: 'Energy company', preview: '⚡' },
            { id: '15', name: 'Travel agency', preview: '✈️' },
            { id: '16', name: 'Music label', preview: '🎵' },
        ];

        // Initially displayed logos (first 4)
        this.initialLogos = this.allLogos.slice(0, 4);

        // Thread color options (matching Figma data)
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
        this.renderLogos();
        this.renderThreadColors();
        this.bindEvents();
        this.updateLogoOverlay();
        console.log('Club & Coast Customizer initialized');
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
                    data-logo="${logo.id}">
                <span class="logo-preview">${logo.preview}</span>
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

        // Quantity controls
        document.getElementById('qty-minus').addEventListener('click', () => {
            if (this.state.quantity > 1) {
                this.state.quantity--;
                this.updateQuantityDisplay();
            }
        });

        document.getElementById('qty-plus').addEventListener('click', () => {
            this.state.quantity++;
            this.updateQuantityDisplay();
        });

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
            overlay.textContent = selectedLogo.preview;
            overlay.className = `logo-overlay ${this.state.selectedPlacement}`;
        } else {
            overlay.classList.add('hidden');
        }
    }

    updateQuantityDisplay() {
        document.getElementById('quantity').textContent = this.state.quantity;
    }

    addToCart() {
        const selectedLogo = this.allLogos.find(logo => logo.id === this.state.selectedLogo);
        const selectedThreadColor = this.threadColors.find(color => color.id === this.state.selectedThreadColor);
        
        const customizationData = {
            product: 'Classic performance polo',
            logo: selectedLogo,
            placement: this.state.selectedPlacement,
            threadColor: selectedThreadColor,
            quantity: this.state.quantity,
            timestamp: new Date().toISOString()
        };

        console.log('Adding to cart:', customizationData);

        // Show success message (temporary)
        alert(`Added to cart!\n\nLogo: ${selectedLogo.name}\nPlacement: ${this.state.selectedPlacement} chest\nThread Color: ${selectedThreadColor.name}\nQuantity: ${this.state.quantity}`);

        // This will eventually become:
        // window.parent.postMessage({
        //     action: 'SAVE',
        //     payload: 'jwt-token-with-customization-data'
        // }, 'https://app.repspark.com');
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
