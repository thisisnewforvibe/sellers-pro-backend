// Admin Authentication
const ADMIN_PASSWORD = 'SellersProAdmin2024'; // Change this to your secure password

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

function checkAdminAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    
    if (!isAuthenticated) {
        showLoginModal();
    } else {
        initializeAdminPanel();
    }
}

function showLoginModal() {
    // Create login modal
    const modal = document.createElement('div');
    modal.id = 'adminLoginModal';
    modal.className = 'admin-login-modal';
    modal.innerHTML = `
        <div class="admin-login-content">
            <div class="admin-login-header">
                <img src="logo sellers black.svg" alt="Sellers Pro" width="60" height="60">
                <h2>Admin Panel</h2>
                <p>Davom etish uchun parolni kiriting</p>
            </div>
            <form id="adminLoginForm">
                <div class="form-group">
                    <input 
                        type="password" 
                        id="adminPassword" 
                        placeholder="Admin paroli"
                        autocomplete="off"
                        required
                    >
                </div>
                <button type="submit" class="login-btn">Kirish</button>
                <div id="loginError" class="error-message" style="display: none;"></div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            modal.remove();
            initializeAdminPanel();
        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = '❌ Noto\'g\'ri parol!';
            errorDiv.style.display = 'block';
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
        }
    });
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('adminPassword').focus();
    }, 100);
}

function initializeAdminPanel() {
    // Initialize navigation
    setupNavigation();
    
    // Load initial dashboard data
    loadDashboard();
}

// Get API URL from config (fallback for compatibility)
const API_BASE = typeof API_CONFIG !== 'undefined' && API_CONFIG.BASE_URL 
    ? API_CONFIG.BASE_URL + '/api' 
    : 'https://sellers-pro-backend.onrender.com/api';

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update active page
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}-page`).classList.add('active');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'users': 'Foydalanuvchilar',
                'lessons': 'Darslar',
                'analytics': 'Statistika'
            };
            document.getElementById('page-title').textContent = titles[page];
            
            // Load data for the page
            if (page === 'dashboard') {
                loadDashboard();
            } else if (page === 'users') {
                loadUsers();
            } else if (page === 'lessons') {
                loadLessons();
            }
        });
    });
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    location.reload();
}

// Load dashboard data
async function loadDashboard() {
    try {
        // Show loading state
        document.getElementById('total-users').textContent = '...';
        document.getElementById('active-subs').textContent = '...';
        document.getElementById('completed-lessons').textContent = '...';
        document.getElementById('logins-today').textContent = '...';
        
        // Load stats from API
        const statsResponse = await fetch(`${API_BASE}/admin/stats`);
        
        if (!statsResponse.ok) {
            throw new Error('Failed to fetch stats');
        }
        
        const stats = await statsResponse.json();
        
        // Update stats with real data
        document.getElementById('total-users').textContent = stats.total_users || 0;
        document.getElementById('active-subs').textContent = stats.active_subscriptions || 0;
        document.getElementById('completed-lessons').textContent = stats.completed_lessons || 0;
        document.getElementById('logins-today').textContent = stats.logins_today || 0;
        
        // Load recent users
        const usersResponse = await fetch(`${API_BASE}/admin/users?limit=5`);
        
        if (!usersResponse.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await usersResponse.json();
        
        const tbody = document.getElementById('recent-users-body');
        tbody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #888;">Hali foydalanuvchilar yo\'q</td></tr>';
        } else {
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${escapeHtml(user.full_name || user.first_name || 'Noma\'lum')}</td>
                        <td>@${escapeHtml(user.username || user.telegram_id)}</td>
                        <td>${escapeHtml(user.phone_number || '-')}</td>
                        <td><span class="badge ${user.subscription_active ? 'premium' : 'basic'}">${user.subscription_active ? 'Faol' : 'Basic'}</span></td>
                        <td>${formatDate(user.created_at || user.registration_date)}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        
        // Show error in stats
        document.getElementById('total-users').textContent = '0';
        document.getElementById('active-subs').textContent = '0';
        document.getElementById('completed-lessons').textContent = '0';
        document.getElementById('logins-today').textContent = '0';
        
        // Show error message in table
        document.getElementById('recent-users-body').innerHTML = 
            '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #e74c3c;">❌ Ma\'lumotlarni yuklashda xatolik: ' + escapeHtml(error.message) + '</td></tr>';
    }
}

// Load users page
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        
        const tbody = document.getElementById('users-body');
        tbody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #888;">Hali foydalanuvchilar yo\'q</td></tr>';
        } else {
            users.forEach(user => {
                const endDate = user.subscription_end ? new Date(user.subscription_end) : null;
                const isExpired = endDate && endDate < new Date();
                const statusClass = user.subscription_active && !isExpired ? 'active' : 'inactive';
                const statusText = user.subscription_active && !isExpired ? 'Faol' : 'Faol emas';
                
                const fullName = escapeHtml((user.first_name || '') + ' ' + (user.last_name || '')).trim() || 'Noma\'lum';
                
                const row = `
                    <tr>
                        <td>${escapeHtml(user.id)}</td>
                        <td>${fullName}</td>
                        <td>@${escapeHtml(user.username || '-')}</td>
                        <td>${escapeHtml(user.phone_number || '-')}</td>
                        <td><span class="badge ${user.subscription_type || 'basic'}">${user.subscription_type || 'basic'}</span></td>
                        <td><span class="badge ${statusClass}">${statusText}</span></td>
                        <td>${endDate ? formatDate(user.subscription_end) : '-'}</td>
                        <td>${formatDate(user.created_at)}</td>
                        <td>
                            <button class="btn-action" onclick="openSubscriptionModal('${escapeHtml(user.id)}', '${escapeHtml(user.telegram_id)}', '${fullName}', '${user.subscription_type || 'basic'}', ${user.subscription_active ? 1 : 0})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Obunani boshqarish
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-body').innerHTML = 
            '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #e74c3c;">❌ Ma\'lumotlarni yuklashda xatolik: ' + escapeHtml(error.message) + '</td></tr>';
    }
}

// Refresh data
function refreshData() {
    const activePage = document.querySelector('.page-content.active').id;
    
    if (activePage === 'dashboard-page') {
        loadDashboard();
    } else if (activePage === 'users-page') {
        loadUsers();
    } else if (activePage === 'lessons-page') {
        loadLessons();
    }
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
        return date.toLocaleDateString('uz-UZ', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    } else if (days > 0) {
        return `${days} kun oldin`;
    } else if (hours > 0) {
        return `${hours} soat oldin`;
    } else if (minutes > 0) {
        return `${minutes} daqiqa oldin`;
    } else {
        return 'Hozir';
    }
}

// Load dashboard on page load
loadDashboard();

// Modal functions
let currentUserId = null;

function openSubscriptionModal(userId, telegramId, userName, subType, isActive) {
    currentUserId = userId;
    
    document.getElementById('modal-user-name').textContent = userName;
    document.getElementById('modal-user-id').textContent = telegramId;
    document.getElementById('subscription-type').value = subType || 'basic';
    document.getElementById('subscription-active').checked = isActive;
    
    document.getElementById('subscription-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('subscription-modal').style.display = 'none';
    currentUserId = null;
}

// Add User Modal Functions
function openAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'flex';
}

function closeAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'none';
    
    // Clear form
    document.getElementById('new-user-firstname').value = '';
    document.getElementById('new-user-lastname').value = '';
    document.getElementById('new-user-phone').value = '';
    document.getElementById('new-user-telegram').value = '';
    document.getElementById('new-user-duration').value = '30';
}

async function saveNewUser() {
    const firstName = document.getElementById('new-user-firstname').value.trim();
    const lastName = document.getElementById('new-user-lastname').value.trim();
    const phoneNumber = document.getElementById('new-user-phone').value.trim();
    const telegramId = document.getElementById('new-user-telegram').value.trim();
    const duration = document.getElementById('new-user-duration').value;

    // Validation
    if (!firstName) {
        alert('❌ Iltimos, ism kiriting');
        return;
    }

    if (!phoneNumber) {
        alert('❌ Iltimos, telefon raqam kiriting');
        return;
    }

    // Validate phone format
    if (!/^\+998\d{9}$/.test(phoneNumber)) {
        alert('❌ Telefon raqam formati noto\'g\'ri. Format: +998XXXXXXXXX');
        return;
    }

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_ADD_USER), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                telegramId: telegramId || undefined,
                duration: parseInt(duration)
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Foydalanuvchi muvaffaqiyatli qo\'shildi!');
            closeAddUserModal();
            
            // Reload users list
            const activePage = document.querySelector('.page-content.active').id;
            if (activePage === 'users-page') {
                loadUsers();
            } else if (activePage === 'dashboard-page') {
                loadDashboard();
            }
        } else {
            alert('❌ Xatolik: ' + (result.message || 'Foydalanuvchi qo\'shishda xatolik'));
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
}

// Show/hide custom duration input

// Add User Modal Functions
function openAddUserModal() {
    // Clear form
    document.getElementById('new-user-firstname').value = '';
    document.getElementById('new-user-lastname').value = '';
    document.getElementById('new-user-phone').value = '';
    document.getElementById('new-user-telegram').value = '';
    document.getElementById('new-user-duration').value = '30';
    
    document.getElementById('add-user-modal').style.display = 'flex';
}

function closeAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'none';
}

async function saveNewUser() {
    const firstName = document.getElementById('new-user-firstname').value.trim();
    const lastName = document.getElementById('new-user-lastname').value.trim();
    const phoneNumber = document.getElementById('new-user-phone').value.trim();
    const telegramId = document.getElementById('new-user-telegram').value.trim();
    const duration = document.getElementById('new-user-duration').value;

    // Validation
    if (!firstName) {
        alert('❌ Iltimos, ism kiriting');
        return;
    }

    if (!phoneNumber) {
        alert('❌ Iltimos, telefon raqam kiriting');
        return;
    }

    // Validate phone format
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('❌ Telefon raqam noto\'g\'ri formatda. Format: +998XXXXXXXXX');
        return;
    }

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_ADD_USER), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                telegramId: telegramId || undefined,
                duration: parseInt(duration)
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Foydalanuvchi muvaffaqiyatli qo\'shildi!');
            closeAddUserModal();
            
            // Reload users
            loadUsers();
            loadDashboard();
        } else {
            alert('❌ Xatolik: ' + (result.message || 'Foydalanuvchi qo\'shishda xatolik'));
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
}

// Show/hide custom duration input
document.addEventListener('DOMContentLoaded', () => {
    const durationSelect = document.getElementById('subscription-duration');
    const customGroup = document.getElementById('custom-duration-group');
    
    if (durationSelect) {
        durationSelect.addEventListener('change', (e) => {
            customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }
});

async function saveSubscription() {
    if (!currentUserId) return;
    
    const subType = document.getElementById('subscription-type').value;
    const duration = document.getElementById('subscription-duration').value;
    const isActive = document.getElementById('subscription-active').checked;
    
    let days;
    if (duration === 'custom') {
        days = parseInt(document.getElementById('custom-days').value);
        if (!days || days < 1) {
            alert('Iltimos, to\'g\'ri kunlar sonini kiriting');
            return;
        }
    } else {
        days = parseInt(duration) * 30; // Convert months to days
    }
    
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_SUBSCRIPTION), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUserId,
                type: subType,
                duration: days,
                active: isActive
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Obuna muvaffaqiyatli yangilandi!');
            closeModal();
            
            // Reload users and dashboard
            const activePage = document.querySelector('.page-content.active').id;
            if (activePage === 'dashboard-page') {
                loadDashboard();
            } else if (activePage === 'users-page') {
                loadUsers();
            }
        } else {
            alert('❌ Xatolik: ' + (result.message || 'Obunani yangilashda xatolik'));
        }
    } catch (error) {
        console.error('Error updating subscription:', error);
        alert('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const subModal = document.getElementById('subscription-modal');
    const addUserModal = document.getElementById('add-user-modal');
    const lessonModal = document.getElementById('lesson-modal');
    
    if (event.target === subModal) {
        closeModal();
    }
    if (event.target === addUserModal) {
        closeAddUserModal();
    }
    if (event.target === lessonModal) {
        closeLessonModal();
    }
}

// ===== LESSONS MANAGEMENT =====
let currentLessonId = null;

async function loadLessons() {
    try {
        const response = await fetch(`${API_BASE}/lessons`);
        const lessons = await response.json();
        
        const tbody = document.getElementById('lessons-body');
        tbody.innerHTML = '';
        
        if (lessons.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">Hali darslar yo\'q</td></tr>';
        } else {
            lessons.forEach(lesson => {
                const resourceCount = lesson.resources ? lesson.resources.length : 0;
                const downloadCount = lesson.downloads ? lesson.downloads.length : 0;
                
                const row = `
                    <tr>
                        <td>${lesson.id}</td>
                        <td><strong>${lesson.title}</strong></td>
                        <td>${lesson.video_id || '-'}</td>
                        <td>${resourceCount} ta</td>
                        <td>${downloadCount} ta</td>
                        <td>${formatDate(lesson.created_at)}</td>
                        <td>
                            <button class="btn-action" onclick="editLesson(${lesson.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
                                    <path d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                Tahrirlash
                            </button>
                            <button class="btn-action btn-danger" onclick="deleteLesson(${lesson.id}, '${lesson.title}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                O'chirish
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading lessons:', error);
        document.getElementById('lessons-body').innerHTML = 
            '<tr><td colspan="7" class="loading">Xatolik yuz berdi</td></tr>';
    }
}

function openLessonModal(lessonId = null) {
    currentLessonId = lessonId;
    
    if (lessonId) {
        document.getElementById('lesson-modal-title').textContent = 'Darsni Tahrirlash';
        loadLessonData(lessonId);
    } else {
        document.getElementById('lesson-modal-title').textContent = 'Yangi Dars Qo\'shish';
        clearLessonForm();
    }
    
    document.getElementById('lesson-modal').style.display = 'flex';
}

function closeLessonModal() {
    document.getElementById('lesson-modal').style.display = 'none';
    currentLessonId = null;
    clearLessonForm();
}

function clearLessonForm() {
    document.getElementById('lesson-id').value = '';
    document.getElementById('lesson-title').value = '';
    document.getElementById('lesson-intro').value = '';
    document.getElementById('lesson-video-id').value = '';
    document.getElementById('lesson-summary').value = '';
    
    // Reset resources
    document.getElementById('resources-container').innerHTML = `
        <div class="resource-item-form">
            <input type="text" placeholder="Resurs nomi" class="resource-name">
            <input type="text" placeholder="https://example.com" class="resource-url">
            <button type="button" class="btn-icon" onclick="addResourceField()">+</button>
        </div>
    `;
    
    // Reset downloads
    document.getElementById('downloads-container').innerHTML = `
        <div class="resource-item-form">
            <input type="text" placeholder="Fayl nomi (Presentation.pdf)" class="download-name">
            <input type="text" placeholder="/files/lesson1/file.pdf yoki URL" class="download-url">
            <button type="button" class="btn-icon" onclick="addDownloadField()">+</button>
        </div>
    `;
}

async function loadLessonData(lessonId) {
    try {
        const response = await fetch(`${API_BASE}/lessons/${lessonId}`);
        const lesson = await response.json();
        
        document.getElementById('lesson-id').value = lesson.id;
        document.getElementById('lesson-title').value = lesson.title || '';
        document.getElementById('lesson-intro').value = lesson.intro || '';
        document.getElementById('lesson-video-id').value = lesson.video_id || '';
        document.getElementById('lesson-summary').value = lesson.summary || '';
        
        // Load resources
        const resourcesContainer = document.getElementById('resources-container');
        resourcesContainer.innerHTML = '';
        if (lesson.resources && lesson.resources.length > 0) {
            lesson.resources.forEach((res, index) => {
                const html = `
                    <div class="resource-item-form">
                        <input type="text" placeholder="Resurs nomi" class="resource-name" value="${res.name || ''}">
                        <input type="text" placeholder="https://example.com" class="resource-url" value="${res.url || ''}">
                        <button type="button" class="btn-icon" onclick="${index === lesson.resources.length - 1 ? 'addResourceField()' : 'this.parentElement.remove()'}">${index === lesson.resources.length - 1 ? '+' : '−'}</button>
                    </div>
                `;
                resourcesContainer.innerHTML += html;
            });
        } else {
            addResourceField();
        }
        
        // Load downloads
        const downloadsContainer = document.getElementById('downloads-container');
        downloadsContainer.innerHTML = '';
        if (lesson.downloads && lesson.downloads.length > 0) {
            lesson.downloads.forEach((dl, index) => {
                const html = `
                    <div class="resource-item-form">
                        <input type="text" placeholder="Fayl nomi" class="download-name" value="${dl.name || ''}">
                        <input type="text" placeholder="/files/lesson1/file.pdf" class="download-url" value="${dl.url || ''}">
                        <button type="button" class="btn-icon" onclick="${index === lesson.downloads.length - 1 ? 'addDownloadField()' : 'this.parentElement.remove()'}">${index === lesson.downloads.length - 1 ? '+' : '−'}</button>
                    </div>
                `;
                downloadsContainer.innerHTML += html;
            });
        } else {
            addDownloadField();
        }
        
    } catch (error) {
        console.error('Error loading lesson:', error);
        alert('Darsni yuklashda xatolik yuz berdi');
    }
}

function addResourceField() {
    const container = document.getElementById('resources-container');
    const html = `
        <div class="resource-item-form">
            <input type="text" placeholder="Resurs nomi" class="resource-name">
            <input type="text" placeholder="https://example.com" class="resource-url">
            <button type="button" class="btn-icon" onclick="this.parentElement.remove()">−</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addDownloadField() {
    const container = document.getElementById('downloads-container');
    const html = `
        <div class="resource-item-form">
            <input type="text" placeholder="Fayl nomi" class="download-name">
            <input type="text" placeholder="/files/lesson1/file.pdf yoki URL" class="download-url">
            <button type="button" class="btn-icon" onclick="this.parentElement.remove()">−</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

async function saveLesson() {
    const lessonId = parseInt(document.getElementById('lesson-id').value);
    const title = document.getElementById('lesson-title').value.trim();
    
    if (!lessonId || !title) {
        alert('Dars ID va Sarlavha majburiy!');
        return;
    }
    
    // Collect resources
    const resources = [];
    document.querySelectorAll('#resources-container .resource-item-form').forEach(item => {
        const name = item.querySelector('.resource-name').value.trim();
        const url = item.querySelector('.resource-url').value.trim();
        if (name && url) {
            resources.push({ name, url });
        }
    });
    
    // Collect downloads
    const downloads = [];
    document.querySelectorAll('#downloads-container .resource-item-form').forEach(item => {
        const name = item.querySelector('.download-name').value.trim();
        const url = item.querySelector('.download-url').value.trim();
        if (name && url) {
            downloads.push({ name, url });
        }
    });
    
    const lessonData = {
        id: lessonId,
        title: title,
        intro: document.getElementById('lesson-intro').value.trim(),
        video_id: document.getElementById('lesson-video-id').value.trim(),
        summary: document.getElementById('lesson-summary').value.trim(),
        resources: resources,
        downloads: downloads
    };
    
    try {
        const response = await fetch(`${API_BASE}/admin/lesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lessonData)
        });
        
        const result = await response.json();
        
        if (result.success || response.ok) {
            alert('Dars muvaffaqiyatli saqlandi!');
            closeLessonModal();
            loadLessons();
        } else {
            alert('Xatolik: ' + (result.message || 'Darsni saqlashda xatolik'));
        }
    } catch (error) {
        console.error('Error saving lesson:', error);
        alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
}

async function editLesson(lessonId) {
    openLessonModal(lessonId);
}

async function deleteLesson(lessonId, title) {
    if (!confirm(`"${title}" darsini o'chirmoqchimisiz?`)) {
        return;
    }
    
    // Note: You'll need to add DELETE endpoint in backend
    alert('O\'chirish funksiyasi hali qo\'shilmagan. Backend DELETE endpoint kerak.');
}

// Security helper - escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
