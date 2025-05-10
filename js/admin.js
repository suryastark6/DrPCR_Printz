// Check if user is admin
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    loadDesigns();
    loadOrders();
});

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}Tab`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Design Management
let editingDesignId = null;

function loadDesigns() {
    const designs = JSON.parse(localStorage.getItem('designs')) || [];
    const designsList = document.getElementById('designsList');
    
    designsList.innerHTML = '';
    
    designs.forEach(design => {
        const designElement = document.createElement('div');
        designElement.className = 'design-item';
        designElement.innerHTML = `
            <img src="${design.image}" alt="${design.name}">
            <div class="design-item-info">
                <h3>${design.name}</h3>
                <p>${design.description}</p>
                <p class="price">$${design.price.toFixed(2)}</p>
                <p>Category: ${design.category}</p>
            </div>
            <div class="design-item-actions">
                <button class="edit-btn" onclick="editDesign(${design.id})">Edit</button>
                <button class="delete-btn" onclick="deleteDesign(${design.id})">Delete</button>
            </div>
        `;
        
        designsList.appendChild(designElement);
    });
}

function showAddDesignModal() {
    editingDesignId = null;
    document.getElementById('designFormTitle').textContent = 'Add New Design';
    document.getElementById('designSubmitBtn').textContent = 'Add Design';
    document.getElementById('designForm').reset();
    document.getElementById('designFormModal').style.display = 'block';
}

function editDesign(designId) {
    const designs = JSON.parse(localStorage.getItem('designs'));
    const design = designs.find(d => d.id === designId);
    
    if (design) {
        editingDesignId = designId;
        document.getElementById('designFormTitle').textContent = 'Edit Design';
        document.getElementById('designSubmitBtn').textContent = 'Update Design';
        
        document.getElementById('designName').value = design.name;
        document.getElementById('designDescription').value = design.description;
        document.getElementById('designCategory').value = design.category;
        document.getElementById('designPrice').value = design.price;
        document.getElementById('designImage').value = design.image;
        
        document.getElementById('designFormModal').style.display = 'block';
    }
}

function handleDesignSubmit(event) {
    event.preventDefault();
    
    const designData = {
        name: document.getElementById('designName').value,
        description: document.getElementById('designDescription').value,
        category: document.getElementById('designCategory').value,
        price: parseFloat(document.getElementById('designPrice').value),
        image: document.getElementById('designImage').value
    };
    
    const designs = JSON.parse(localStorage.getItem('designs')) || [];
    
    if (editingDesignId) {
        // Update existing design
        const index = designs.findIndex(d => d.id === editingDesignId);
        if (index !== -1) {
            designs[index] = { ...designs[index], ...designData };
        }
    } else {
        // Add new design
        designData.id = Date.now();
        designs.push(designData);
    }
    
    localStorage.setItem('designs', JSON.stringify(designs));
    closeModal('designFormModal');
    loadDesigns();
}

function deleteDesign(designId) {
    if (confirm('Are you sure you want to delete this design?')) {
        const designs = JSON.parse(localStorage.getItem('designs'));
        const updatedDesigns = designs.filter(d => d.id !== designId);
        localStorage.setItem('designs', JSON.stringify(updatedDesigns));
        loadDesigns();
    }
}

// Order Management
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('ordersList');
    
    ordersList.innerHTML = '';
    
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.onclick = () => showOrderDetails(order);
        
        orderElement.innerHTML = `
            <div class="order-item-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <p>Design: ${order.designName}</p>
            <p>Customer: ${order.userId}</p>
            <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Total: $${order.totalPrice.toFixed(2)}</p>
        `;
        
        ordersList.appendChild(orderElement);
    });
}

function showOrderDetails(order) {
    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Customer Email:</strong> ${order.userId}</p>
        <p><strong>Design:</strong> ${order.designName}</p>
        <p><strong>Color:</strong> ${order.color}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
    `;
    
    document.getElementById('orderStatus').value = order.status;
    document.getElementById('orderStatus').dataset.orderId = order.id;
    document.getElementById('orderDetailsModal').style.display = 'block';
}

function updateOrderStatus() {
    const statusSelect = document.getElementById('orderStatus');
    const orderId = parseInt(statusSelect.dataset.orderId);
    const newStatus = statusSelect.value;
    
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        closeModal('orderDetailsModal');
    }
}

// Modal Management
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'designFormModal') {
        editingDesignId = null;
    }
} 