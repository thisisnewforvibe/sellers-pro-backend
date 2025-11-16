// Dashboard functionality

// Check authentication and subscription
async function checkDashboardAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        
        // If backend returns success=false due to inactive subscription (OLD backend response)
        if (!data.success && data.accessDenied) {
            // Show waiting for access message instead of redirecting
            showWaitingForAccess();
            return false;
        }
        
        if (!data.success) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
            return false;
        }

        // Check if user has access (NEW backend response)
        if (data.hasAccess === false) {
            // Show waiting for access message
            showWaitingForAccess();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'index.html';
        return false;
    }
}

// Show waiting for access message
function showWaitingForAccess() {
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 16px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: white; border-radius: 12px; padding: 24px 20px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
                <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
                <h1 style="color: #1a1a1a; margin-bottom: 12px; font-size: 20px; font-weight: 600; line-height: 1.3;">Obunangiz hali faol emas</h1>
                <p style="color: #6b7280; margin-bottom: 20px; line-height: 1.5; font-size: 14px;">
                    Hurmatli foydalanuvchi, siz ro'yxatdan o'tdingiz, lekin obunangiz hali faollashtirilmagan. 
                    Kursga kirish uchun admin bilan bog'laning.
                </p>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
                    <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>📱 Telegram:</strong> <a href="https://t.me/Pro_Sellers_uz" target="_blank" style="color: #4E11C8; text-decoration: none;">@Pro_Sellers_uz</a></p>
                    <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>📷 Instagram:</strong> <a href="https://instagram.com/pro_sellers.uz" target="_blank" style="color: #4E11C8; text-decoration: none;">@pro_sellers.uz</a></p>
                    <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>📞 Telefon:</strong> +998 78 113 67 68</p>
                </div>
                <p style="color: #9ca3af; font-size: 13px; margin-bottom: 20px;">
                    Obunangiz faollashtirilgandan so'ng, qaytadan kiring.
                </p>
                <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <button onclick="window.location.reload()" style="background: #4E11C8; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; width: 100%;">
                        🔄 Yangilash
                    </button>
                    <button onclick="logout()" style="background: #ef4444; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; width: 100%;">
                        Chiqish
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Logout functionality
function logout() {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to landing page
    window.location.href = 'index.html';
}

// Check auth on page load
checkDashboardAuth();

// Logout button handler
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Highlight active lesson and navigate to lesson page
document.querySelectorAll('.lesson-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // If clicking on a start button, navigate to lesson
        if (e.target.classList.contains('lesson-start-btn')) {
            window.location.href = 'lesson.html';
        } else {
            // Remove active class from all items
            document.querySelectorAll('.lesson-item').forEach(i => {
                i.classList.remove('active-lesson');
            });
            
            // Add active class to clicked item
            this.classList.add('active-lesson');
            
            // Navigate to lesson
            window.location.href = 'lesson.html';
        }
    });
});

// Start button click handlers
document.querySelectorAll('.lesson-start-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'lesson.html';
    });
});

// Sidebar navigation active state
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        const linkHref = this.getAttribute('href');
        
        // Allow navigation for links with actual href values
        if (linkHref && linkHref !== '#') {
            // Don't prevent default - let the link navigate normally
            return;
        }
        
        // For # links, prevent default and handle active state
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
    });
});

// Mobile sidebar toggle (for responsive design)
function createMobileToggle() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        // Create hamburger button if it doesn't exist
        if (!document.querySelector('.mobile-menu-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
            
            mainContent.prepend(toggleBtn);
        }
        
        // Close sidebar when clicking outside
        mainContent.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-menu-toggle') && !e.target.closest('.sidebar')) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }
}

// Initialize mobile toggle on load and resize
window.addEventListener('load', createMobileToggle);
window.addEventListener('resize', createMobileToggle);

// Search functionality
const searchInput = document.querySelector('.sidebar-search input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        document.querySelectorAll('.nav-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // If search is empty, show all
        if (searchTerm === '') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.style.display = 'flex';
            });
        }
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS for mobile toggle button
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-toggle {
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1001;
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 10px;
        cursor: pointer;
        color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    
    .active-lesson {
        border-color: var(--purple) !important;
        background-color: var(--bg-card) !important;
    }
`;
document.head.appendChild(style);

// Load lesson completion status from localStorage
function loadLessonProgress() {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    // Update UI for completed lessons
    completedLessons.forEach(lessonId => {
        const lessonItem = document.querySelector(`.lesson-item[data-lesson-id="${lessonId}"]`);
        if (lessonItem) {
            lessonItem.classList.add('completed');
        }
    });
}

// Clear all completion progress (for testing/reset)
function clearAllProgress() {
    localStorage.removeItem('completedLessons');
    console.log('✅ All lesson progress cleared!');
    location.reload();
}

// Load progress on page load
document.addEventListener('DOMContentLoaded', loadLessonProgress);

// Add keyboard shortcut to clear progress: Ctrl+Shift+R
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        if (confirm('Barcha darslarning tugallanish holatini tozalashni xohlaysizmi?')) {
            clearAllProgress();
        }
    }
});
