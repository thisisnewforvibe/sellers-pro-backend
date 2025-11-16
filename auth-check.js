// Check if user is already authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Call on register page load
if (window.location.pathname.includes('register.html')) {
    checkAuth();
}
