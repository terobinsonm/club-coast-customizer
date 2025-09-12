// Product configuration for Club & Coast Seaside Performance Polos
const PRODUCT_CONFIG = {
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

// JWT decoding function
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

// Function to update product display based on RepSpark data
function updateProductDisplay(productId) {
    const product = PRODUCT_CONFIG[productId];
    
    if (!product) {
        console.warn('Product not found:', productId);
        return;
    }
    
    // Update product image and title
    const productImage = document.getElementById('product-image');
    const productTitle = document.getElementById('product-title');
    
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.alt;
    }
    
    if (productTitle) {
        productTitle.textContent = `${product.name} - ${product.color} ${product.gender}`;
    }
    
    console.log(`Product updated to: ${product.name} - ${product.color} ${product.gender}`);
}

// Check for RepSpark JWT data
function checkForRepSparkData() {
    // Check URL parameters for JWT token
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get('token') || urlParams.get('jwt');
    
    console.log('Checking for RepSpark JWT token...');
    
    if (jwtToken) {
        console.log('JWT token found:', jwtToken);
        const payload = parseJwt(jwtToken);
        
        if (payload) {
            console.log('JWT payload:', payload);
            
            // Extract product ID from JWT payload
            const productId = payload.productId || 
                             payload.productNumber || 
                             payload.product?.id ||
                             payload.product?.productNumber;
            
            if (productId && PRODUCT_CONFIG[productId]) {
                console.log('Product ID from JWT:', productId);
                updateProductDisplay(productId);
                return;
            }
        }
    }
    
    // Check URL hash for JWT (alternative method)
    const hash = window.location.hash.substring(1);
    if (hash && hash.includes('.')) {
        const hashPayload = parseJwt(hash);
        if (hashPayload) {
            console.log('JWT from hash:', hashPayload);
            const productId = hashPayload.productId || 
                             hashPayload.productNumber || 
                             hashPayload.product?.id ||
                             hashPayload.product?.productNumber;
            
            if (productId && PRODUCT_CONFIG[productId]) {
                updateProductDisplay(productId);
                return;
            }
        }
    }
    
    console.log('No JWT found, using default product');
    updateProductDisplay('CNC-P1000');
}

// Listen for RepSpark postMessage communication
window.addEventListener('message', function(event) {
    // Verify it's from RepSpark
    if (!event.origin.includes('repspark.com')) return;
    
    console.log('Received message from RepSpark:', event.data);
    
    // Handle different message types RepSpark might send
    if (event.data.type === 'PRODUCT_INIT' || event.data.type === 'INIT') {
        const productId = event.data.productId || 
                         event.data.productNumber || 
                         event.data.product?.id ||
                         event.data.product?.productNumber;
        
        if (productId && PRODUCT_CONFIG[productId]) {
            updateProductDisplay(productId);
        }
    }
});

// Logo data
const logoData = [
    {
        name: "Kiawah Island Golf Resort",
        image: "https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/kiawah.png"
    },
    {
        name: "Whistling Straits Golf Shop",
        image: "https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/whistling-straits.png"
    },
    {
        name: "Bandon Dunes Golf Resort",
        image: "https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/bandon-dunes.png"
    },
    {
        name: "Augusta National Golf Shop",
        image: "https://raw.githubusercontent.com/terobinsonm/club-coast-customizer/main/public/images/augusta.png"
    }
];

// Thread color collections - Grouped options
const threadColorCollections = [
    {
        name: 'Club Colors',
        description: 'Traditional golf club colors',
        colors: [
            { name: 'White', value: '#FFFFFF', border: '#E5E7EB' },
            { name: 'Navy', value: '#1E3A8A' },
            { name: 'Hunter Green', value: '#166534' },
            { name: 'Burgundy', value: '#991B1B' }
        ]
    },
    {
        name: 'Coordinated',
        description: 'Colors that complement the garment',
        colors: [
            { name: 'Charcoal', value: '#374151' },
            { name: 'Stone', value: '#78716C' },
            { name: 'Sage', value: '#84CC16' },
            { name: 'Steel Blue', value: '#0EA5E9' }
        ]
    },
    {
        name: 'Tonal',
        description: 'Subtle variations of the garment color',
        colors: [
            { name: 'Light Gray', value: '#D1D5DB' },
            { name: 'Medium Gray', value: '#9CA3AF' },
            { name: 'Dark Gray', value: '#6B7280' },
            { name: 'Charcoal', value: '#374151' }
        ]
    }
];

// State variables
let selectedLogo = null;
let selectedPlacement = 'left';
let selectedThreadColor = threadColorCollections[0]; // Default to first collection
let selectedSize = null;
let quantity = 1;

// Initialize logos
function initializeLogos() {
    const logoGrid = document.getElementById('logo-grid');
    logoGrid.innerHTML = '';
    
    logoData.forEach(logo => {
        const logoItem = createLogoItem(logo);
        logoGrid.appendChild(logoItem);
    });
}

// Create logo item element
function createLogoItem(logo) {
    const logoItem = document.createElement('div');
    logoItem.className = 'logo-item';
    logoItem.innerHTML = `
        <img src="${logo.image}" alt="${logo.name}" loading="lazy" />
        <span class="logo-name">${logo.name}</span>
    `;
    
    logoItem.addEventListener('click', () => selectLogo(logo, logoItem));
    return logoItem;
}

// Select logo
function selectLogo(logo, element) {
    // Remove previous selection
    document.querySelectorAll('.logo-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    element.classList.add('selected');
    selectedLogo = logo;
    
    updateLogoOverlay();
}

// Update logo overlay on product image
function updateLogoOverlay() {
    const logoOverlay = document.getElementById('logo-overlay');
    
    if (selectedLogo) {
        logoOverlay.innerHTML = `<img src="${selectedLogo.image}" alt="${selectedLogo.name}" />`;
        logoOverlay.className = `logo-overlay ${selectedPlacement}`;
        logoOverlay.classList.remove('hidden');
    } else {
        logoOverlay.classList.add('hidden');
    }
}

// Initialize thread colors - Grouped collections
function initializeThreadColors() {
    const container = document.getElementById('thread-color-options');
    container.innerHTML = '';
    
    threadColorCollections.forEach((collection, collectionIndex) => {
        const collectionOption = document.createElement('div');
        collectionOption.className = `thread-color-option ${collectionIndex === 0 ? 'selected' : ''}`;
        
        collectionOption.innerHTML = `
            <div class="thread-color-header">
                <div class="thread-color-info">
                    <div class="thread-color-name">${collection.name}</div>
                    <div class="thread-color-desc">${collection.description}</div>
                </div>
                <div class="thread-color-indicator ${collectionIndex === 0 ? '' : 'hidden'}"></div>
            </div>
            <div class="thread-color-swatches">
                ${collection.colors.map(color => 
                    `<div class="color-swatch" style="background-color: ${color.value}; ${color.border ? `border-color: ${color.border};` : ''}" title="${color.name}"></div>`
                ).join('')}
            </div>
        `;
        
        collectionOption.addEventListener('click', () => selectThreadColorCollection(collection, collectionOption));
        container.appendChild(collectionOption);
    });
}

// Select thread color collection
function selectThreadColorCollection(collection, element) {
    // Remove previous selection
    document.querySelectorAll('.thread-color-option').forEach(item => {
        item.classList.remove('selected');
        const indicator = item.querySelector('.thread-color-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    });
    
    // Add selection to clicked item
    element.classList.add('selected');
    const indicator = element.querySelector('.thread-color-indicator');
    if (indicator) {
        indicator.classList.remove('hidden');
    }
    
    selectedThreadColor = collection;
    console.log('Selected thread color collection:', collection.name);
}

// Setup event listeners
function setupEventListeners() {
    // Logo search
    const logoSearch = document.getElementById('logo-search');
    logoSearch.addEventListener('input', handleLogoSearch);
    
    // Placement radio buttons
    document.querySelectorAll('input[name="placement"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedPlacement = e.target.value;
            updateLogoOverlay();
        });
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.size-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            e.target.classList.add('selected');
            selectedSize = e.target.textContent;
        });
    });
    
    // Quantity controls
    document.getElementById('qty-minus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('quantity').textContent = quantity;
        }
    });
    
    document.getElementById('qty-plus').addEventListener('click', () => {
        quantity++;
        document.getElementById('quantity').textContent = quantity;
    });
    
    // Add to cart
    document.getElementById('add-to-cart').addEventListener('click', handleAddToCart);
}

// Handle logo search
function handleLogoSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const logoGrid = document.getElementById('logo-grid');
    const searchInfo = document.getElementById('search-results-info');
    const noResults = document.getElementById('no-results');
    
    if (searchTerm === '') {
        initializeLogos();
        searchInfo.classList.add('hidden');
        noResults.classList.add('hidden');
        return;
    }
    
    const filteredLogos = logoData.filter(logo => 
        logo.name.toLowerCase().includes(searchTerm)
    );
    
    logoGrid.innerHTML = '';
    
    if (filteredLogos.length > 0) {
        filteredLogos.forEach(logo => {
            const logoItem = createLogoItem(logo);
            logoGrid.appendChild(logoItem);
        });
        
        searchInfo.textContent = `${filteredLogos.length} result${filteredLogos.length !== 1 ? 's' : ''} for "${searchTerm}"`;
        searchInfo.classList.remove('hidden');
        noResults.classList.add('hidden');
    } else {
        searchInfo.classList.add('hidden');
        noResults.classList.remove('hidden');
        document.getElementById('no-results-text').textContent = `No logos found for "${searchTerm}"`;
    }
}

// Handle add to cart
function handleAddToCart() {
    const orderData = {
        logo: selectedLogo,
        placement: selectedPlacement,
        threadColor: selectedThreadColor,
        size: selectedSize,
        quantity: quantity
    };
    
    console.log('Add to cart:', orderData);
    
    // Here you would typically send this data to RepSpark or your backend
    alert('Added to cart! (Check console for details)');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Club & Coast Customizer initialized');
    
    // Check for RepSpark JWT data first
    checkForRepSparkData();
    
    // Initialize functionality
    initializeLogos();
    initializeThreadColors();
    setupEventListeners();
    
    // Send ready message to RepSpark (if in iframe)
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'CUSTOMIZER_READY',
            source: 'club-coast-customizer'
        }, '*');
    }
});
