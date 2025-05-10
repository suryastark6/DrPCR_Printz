// Initialize local storage with some default data if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

if (!localStorage.getItem('admins')) {
    localStorage.setItem('admins', JSON.stringify([{
        email: 'admin@drpcr.com',
        password: 'admin123',
        name: 'Admin'
    }]));
}

// Show/Hide Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginType = document.getElementById('loginType').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const admins = JSON.parse(localStorage.getItem('admins'));
    
    let user = null;
    
    if (loginType === 'admin') {
        user = admins.find(a => a.email === email && a.password === password);
    } else {
        user = users.find(u => u.email === email && u.password === password);
    }
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            ...user,
            type: loginType
        }));
        updateAuthUI();
        closeModal('loginModal');
        window.location.href = loginType === 'admin' ? 'admin-dashboard.html' : 'designs.html';
    } else {
        alert('Invalid credentials!');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered!');
        return;
    }
    
    users.push({
        name,
        email,
        password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please login.');
    closeModal('registerModal');
    showLoginModal();
}

// Handle Logout
function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

// Update UI based on authentication state
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Initialize UI
document.addEventListener('DOMContentLoaded', updateAuthUI);

window.logout = logout;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal; 