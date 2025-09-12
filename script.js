class ClubCoastCustomizer {
    constructor() {
        this.productData = null;
        this.customizations = {
            text: '',
            placement: 'left-chest',
            threadColor: 'white'
        };
        
        this.init();
    }
    
    init() {
        this.setupMockData();
        this.bindEvents();
        this.render();
        console.log('Club & Coast Customizer initialized');
    }
    
    setupMockData() {
        this.productData = {
            productNumber: 'CC-POLO-001',
            productName: 'Club & Coast Performance Polo',
            color: 'Navy',
            imageUrl: 'https://via.placeholder.com/400x300/2c3e50/white?text=Club+%26+Coast+Polo'
        };
    }
    
    bindEvents() {
        const textInput = document.getElementById('custom-text');
        const placementSelect = document.getElementById('placement');
        const threadColorSelect = document.getElementById('thread-color');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        
        textInput.addEventListener('input', (e) => {
            this.customizations.text = e.target.value;
            this.updatePreview();
        });
        
        placementSelect.addEventListener('change', (e) => {
            this.customizations.placement = e.target.value;
            this.updatePreview();
        });
        
        threadColorSelect.addEventListener('change', (e) => {
            this.customizations.threadColor = e.target.value;
            this.updatePreview();
        });
        
        saveBtn.addEventListener('click', () => this.saveCustomization());
        cancelBtn.addEventListener('click', () => this.cancelCustomization());
    }
    
    render() {
        document.getElementById('product-image').src = this.productData.imageUrl;
    }
    
    updatePreview() {
        console.log('Updated customization:', this.customizations);
    }
    
    saveCustomization() {
        console.log('Saving customization:', this.customizations);
        
        const customizationData = {
            productNumber: this.productData.productNumber,
            customizations: this.customizations,
            timestamp: new Date().toISOString()
        };
        
        alert('Customization saved!\n\nText: "' + this.customizations.text + '"\nPlacement: ' + this.customizations.placement + '\nThread: ' + this.customizations.threadColor);
    }
    
    cancelCustomization() {
        console.log('Customization cancelled');
        
        if (confirm('Are you sure you want to cancel? All customizations will be lost.')) {
            alert('Customization cancelled');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ClubCoastCustomizer();
});