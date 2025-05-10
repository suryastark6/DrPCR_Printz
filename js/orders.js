// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to view orders');
        window.location.href = 'index.html';
        return;
    }

    loadOrders();
    setupEventListeners();
});

let currentOrders = [];
let selectedOrder = null;

function setupEventListeners() {
    document.getElementById('searchOrders').addEventListener('input', filterOrders);
    document.getElementById('statusFilter').addEventListener('change', filterOrders);
    document.getElementById('sortOrder').addEventListener('change', filterOrders);
}

function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter orders for current user
    currentOrders = orders.filter(order => order.userId === currentUser.email);
    
    filterOrders();
}

function filterOrders() {
    const searchTerm = document.getElementById('searchOrders').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    let filteredOrders = currentOrders.filter(order => {
        const matchesSearch = order.designName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    // Sort orders
    filteredOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    displayOrders(filteredOrders);
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');
    
    if (orders.length === 0) {
        ordersList.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }
    
    ordersList.style.display = 'grid';
    noOrders.style.display = 'none';
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.onclick = () => showOrderDetails(order);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-info">
                <p><strong>Design:</strong> ${order.designName}</p>
                <p><strong>Color:</strong> ${order.color}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                <p class="price"><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
}

function showOrderDetails(order) {
    selectedOrder = order;
    const orderDetails = document.getElementById('orderDetails');
    
    let detailsHTML = `
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Design Name:</strong> ${order.designName}</p>
        <p><strong>Color:</strong> ${order.color}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status}</span></p>
        <p><strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}</p>
    `;
    
    if (order.isCustomUpload) {
        detailsHTML += `
            <hr>
            <h3>Custom Upload Details</h3>
            <p><strong>File Name:</strong> ${order.customUploadDetails.fileName}</p>
            <p><strong>File Size:</strong> ${formatFileSize(order.customUploadDetails.fileSize)}</p>
            <p><strong>Special Instructions:</strong> ${order.customUploadDetails.specialInstructions || 'None'}</p>
        `;
    }
    
    orderDetails.innerHTML = detailsHTML;
    document.getElementById('orderDetailsModal').style.display = 'block';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function reorderItem() {
    if (!selectedOrder) return;
    
    if (selectedOrder.isCustomUpload) {
        alert('Custom uploads cannot be reordered. Please submit a new custom order.');
        return;
    }
    
    // Create a new order with the same details
    const newOrder = {
        ...selectedOrder,
        id: Date.now(),
        status: 'pending',
        orderDate: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Order placed successfully!');
    closeModal('orderDetailsModal');
    loadOrders();
} 