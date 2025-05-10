// Initialize custom uploads in localStorage if not exists
if (!localStorage.getItem('customUploads')) {
    localStorage.setItem('customUploads', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to upload models');
        window.location.href = 'index.html';
        return;
    }

    setupFileUpload();
});

function setupFileUpload() {
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('modelFile');
    const fileInfo = document.getElementById('fileInfo');

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileUpload.addEventListener(eventName, () => {
            fileUpload.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, () => {
            fileUpload.classList.remove('dragover');
        });
    });

    fileUpload.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFile(file);
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        handleFile(file);
    }

    function handleFile(file) {
        // Check file type
        const validTypes = ['.stl', '.obj', '.3mf'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            alert('Invalid file type. Please upload STL, OBJ, or 3MF files only.');
            fileInput.value = '';
            fileInfo.textContent = '';
            return;
        }

        // Check file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Maximum size is 50MB.');
            fileInput.value = '';
            fileInfo.textContent = '';
            return;
        }

        // Update file info
        fileInfo.textContent = `Selected file: ${file.name} (${formatFileSize(file.size)})`;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleUpload(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to upload models');
        showLoginModal();
        return;
    }

    const fileInput = document.getElementById('modelFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    // Create a custom upload order
    const uploadOrder = {
        id: Date.now(),
        userId: currentUser.email,
        modelName: document.getElementById('modelName').value,
        description: document.getElementById('modelDescription').value,
        fileName: file.name,
        fileSize: file.size,
        color: document.getElementById('printColor').value,
        quantity: parseInt(document.getElementById('printQuantity').value),
        specialInstructions: document.getElementById('specialInstructions').value,
        status: 'pending',
        uploadDate: new Date().toISOString()
    };

    // Store in localStorage
    const customUploads = JSON.parse(localStorage.getItem('customUploads'));
    customUploads.push(uploadOrder);
    localStorage.setItem('customUploads', JSON.stringify(customUploads));

    // Also add to orders
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderDetails = {
        id: uploadOrder.id,
        userId: uploadOrder.userId,
        designId: 'custom',
        designName: uploadOrder.modelName,
        color: uploadOrder.color,
        quantity: uploadOrder.quantity,
        totalPrice: 0, // Price will be determined by admin
        status: 'pending',
        orderDate: uploadOrder.uploadDate,
        isCustomUpload: true,
        customUploadDetails: uploadOrder
    };
    
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    alert('Model uploaded successfully! Our team will review your design and contact you with pricing details.');
    window.location.href = 'orders.html';
} 