// Initialize designs in localStorage if not exists
if (!localStorage.getItem('designs')) {
    const defaultDesigns = [
        {
            id: 1,
            name: 'Geometric Vase',
            description: 'Modern geometric vase perfect for home decor',
            category: 'household',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 2,
            name: 'Robot Toy',
            description: 'Articulated robot toy with moving parts',
            category: 'toys',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 3,
            name: 'Phone Stand',
            description: 'Adjustable phone stand with cable management',
            category: 'tools',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 4,
            name: 'Artistic Sculpture',
            description: 'Abstract art piece for modern interiors',
            category: 'art',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=500&auto=format&fit=crop&q=60'
        },
        {
            id: 5,
            name: 'Desk Organizer',
            description: 'Multi-compartment desk organizer',
            category: 'household',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?w=500&auto=format&fit=crop&q=60'
        }
    ];
    localStorage.setItem('designs', JSON.stringify(defaultDesigns));
}

// Initialize orders in localStorage if not exists
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}

let currentDesigns = [];
let selectedDesign = null;

// Load and display designs
function loadDesigns() {
    const designs = JSON.parse(localStorage.getItem('designs'));
    const searchTerm = document.getElementById('searchDesign').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    currentDesigns = designs.filter(design => {
        const matchesSearch = design.name.toLowerCase().includes(searchTerm) ||
                            design.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || design.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayDesigns();
}

// Display designs in the grid
function displayDesigns() {
    const designsGrid = document.getElementById('designsGrid');
    designsGrid.innerHTML = '';
    
    currentDesigns.forEach(design => {
        const designCard = document.createElement('div');
        designCard.className = 'design-card';
        designCard.onclick = () => showDesignDetails(design);
        
        designCard.innerHTML = `
            <img src="${design.image}" alt="${design.name}">
            <div class="design-info">
                <h3>${design.name}</h3>
                <p>${design.description}</p>
                <p class="price">₹${design.price.toFixed(2)}</p>
            </div>
        `;
        
        designsGrid.appendChild(designCard);
    });
}

// Show design details in modal
function showDesignDetails(design) {
    selectedDesign = design;
    
    document.getElementById('modalDesignImage').src = design.image;
    document.getElementById('modalDesignName').textContent = design.name;
    document.getElementById('modalDesignDescription').textContent = design.description;
    document.getElementById('pricePerUnit').textContent = '₹' + design.price.toFixed(2);
    
    updateTotalPrice();
    document.getElementById('designModal').style.display = 'block';
}

// Update total price based on quantity
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = selectedDesign.price * quantity;
    document.getElementById('totalPrice').textContent = '₹' + totalPrice.toFixed(2);
}

// Place order
function placeOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please login to place an order');
        showLoginModal();
        return;
    }
    
    // Prepare order details for checkout
    const orderDetails = {
        designId: selectedDesign.id,
        designName: selectedDesign.name,
        designImage: selectedDesign.image,
        color: document.getElementById('colorSelect').value,
        quantity: parseInt(document.getElementById('quantity').value),
        pricePerUnit: selectedDesign.price,
        totalPrice: selectedDesign.price * parseInt(document.getElementById('quantity').value)
    };
    sessionStorage.setItem('checkoutOrder', JSON.stringify(orderDetails));
    closeModal('designModal');
    window.location.href = 'checkout.html';
}

// Event listeners
document.getElementById('searchDesign').addEventListener('input', loadDesigns);
document.getElementById('categoryFilter').addEventListener('change', loadDesigns);
document.getElementById('quantity').addEventListener('input', updateTotalPrice);

// Load designs on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDesigns();
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.type === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}); 