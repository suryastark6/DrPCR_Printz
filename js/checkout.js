document.addEventListener('DOMContentLoaded', () => {
    // Show logout button if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('logoutBtn').style.display = 'block';
    }

    // Load order summary
    const order = JSON.parse(sessionStorage.getItem('checkoutOrder'));
    if (!order) {
        window.location.href = 'designs.html';
        return;
    }
    renderOrderSummary(order);
});

function renderOrderSummary(order) {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <img src="${order.designImage}" alt="${order.designName}">
        <h2>${order.designName}</h2>
        <p><span class="summary-label">Color:</span> ${order.color}</p>
        <p><span class="summary-label">Quantity:</span> ${order.quantity}</p>
        <p><span class="summary-label">Price per unit:</span> ₹${order.pricePerUnit.toFixed(2)}</p>
        <p><span class="summary-label">Total:</span> <b>₹${order.totalPrice.toFixed(2)}</b></p>
    `;
}

function handleCheckout(event) {
    event.preventDefault();
    const order = JSON.parse(sessionStorage.getItem('checkoutOrder'));
    if (!order) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to place an order');
        window.location.href = 'index.html';
        return;
    }

    // Collect address and payment details
    const addressDetails = {
        fullName: document.getElementById('fullName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value,
        contact: document.getElementById('contact').value,
        paymentType: document.getElementById('paymentType').value
    };

    // Final order object
    const finalOrder = {
        id: Date.now(),
        userId: currentUser.email,
        ...order,
        ...addressDetails,
        status: 'pending',
        orderDate: new Date().toISOString()
    };

    // Save to orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(finalOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clean up session
    sessionStorage.removeItem('checkoutOrder');

    // Redirect to orders page
    window.location.href = 'orders.html';
}

window.handleCheckout = handleCheckout; 