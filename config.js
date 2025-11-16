// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://sellers-pro-backend.onrender.com',
    ENDPOINTS: {
        VERIFY_OTP: '/api/auth/verify-otp',
        VERIFY_TOKEN: '/api/auth/verify-token',
        GET_LESSONS: '/api/lessons',
        HEALTH: '/api/health',
        ADMIN_USERS: '/api/admin/users',
        ADMIN_STATS: '/api/admin/stats',
        ADMIN_SUBSCRIPTION: '/api/admin/subscription',
        ADMIN_ADD_USER: '/api/admin/add-user'
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
