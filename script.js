// YouTube IFrame API Video Tracking - Must be declared before loading API
let player;
let leadCaptured = false;
let videoCheckInterval;
let hasShownLeadForm = false;

// Load YouTube IFrame API immediately
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function is called by YouTube API when ready
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API Ready');
    player = new YT.Player('introVideo', {
        height: '100%',
        width: '100%',
        videoId: 'DVxAahGu2aU',
        playerVars: {
            'rel': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'enablejsapi': 1
        },
        events: {
            'onReady': function(event) {
                console.log('Player ready');
            },
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
    // When video starts playing
    if (event.data == YT.PlayerState.PLAYING && !leadCaptured) {
        console.log('Video started playing, starting timer check');
        // Start checking video time
        if (!videoCheckInterval) {
            videoCheckInterval = setInterval(checkVideoTime, 100); // Check every 100ms
        }
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        // Stop checking when paused or ended
        if (videoCheckInterval) {
            clearInterval(videoCheckInterval);
            videoCheckInterval = null;
        }
    }
}

function checkVideoTime() {
    if (player && player.getCurrentTime && !leadCaptured && !hasShownLeadForm) {
        const currentTime = player.getCurrentTime();
        console.log('Current time:', currentTime);
        
        // Show lead form after 15 seconds
        if (currentTime >= 15) {
            console.log('15 seconds reached, showing lead form');
            hasShownLeadForm = true;
            player.pauseVideo(); // Pause the video
            if (videoCheckInterval) {
                clearInterval(videoCheckInterval);
                videoCheckInterval = null;
            }
            openLeadModal(true);
        }
    }
}

function resumeVideoAfterLead() {
    if (player && leadCaptured) {
        console.log('Resuming video');
        player.playVideo();
    }
}

function restartVideoIfNoLead() {
    if (player && !leadCaptured) {
        console.log('Restarting video');
        hasShownLeadForm = false;
        player.seekTo(0);
        player.playVideo();
    }
}

// Check if lead was already captured
document.addEventListener('DOMContentLoaded', function() {
    const savedLead = localStorage.getItem('leadData');
    if (savedLead) {
        leadCaptured = true;
        console.log('Lead already captured');
    }
});

// Smooth scroll for anchor links
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.pricing-card, .preview-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Lead Modal Functions
function openLeadModal(fromVideo = false) {
    const modal = document.getElementById('leadModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    
    if (fromVideo) {
        modalTitle.textContent = 'Videoni davom ettirish uchun';
        modalSubtitle.textContent = 'Iltimos, ismingiz va telefon raqamingizni qoldiring';
    } else {
        modalTitle.textContent = 'Kursga yozilish';
        modalSubtitle.textContent = 'Ma\'lumotlaringizni qoldiring va biz siz bilan bog\'lanamiz';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on name input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 100);
}

function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('leadForm').reset();
    
    // Reset modal text to default
    document.getElementById('modalTitle').textContent = 'Kursga yozilish';
    document.getElementById('modalSubtitle').textContent = 'Ma\'lumotlaringizni qoldiring va biz siz bilan bog\'lanamiz';
    
    // Handle video based on whether lead was captured
    if (leadCaptured) {
        resumeVideoAfterLead();
    } else {
        restartVideoIfNoLead();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLeadModal();
    }
});

// Handle overlay click
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeLeadModal();
        });
    }
});

// Lead Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');

    // Format phone number as user types
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Auto-add +998 prefix for Uzbekistan
        if (value.length > 0 && !value.startsWith('998')) {
            if (value.startsWith('998')) {
                // Already has prefix
            } else {
                value = '998' + value;
            }
        }
        
        // Format: +998 XX XXX XX XX
        let formatted = '+';
        if (value.length > 0) {
            formatted += value.substring(0, 3); // +998
            if (value.length > 3) {
                formatted += ' ' + value.substring(3, 5); // XX
            }
            if (value.length > 5) {
                formatted += ' ' + value.substring(5, 8); // XXX
            }
            if (value.length > 8) {
                formatted += ' ' + value.substring(8, 10); // XX
            }
            if (value.length > 10) {
                formatted += ' ' + value.substring(10, 12); // XX
            }
        }
        
        e.target.value = formatted;
    });

    // Handle form submission
    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        // Validation
        if (!name) {
            alert('Iltimos, ismingizni kiriting');
            nameInput.focus();
            return;
        }

        if (name.length < 2) {
            alert('Ism kamida 2 ta harfdan iborat bo\'lishi kerak');
            nameInput.focus();
            return;
        }

        if (!phone || phone.length < 17) { // +998 XX XXX XX XX = 17 chars
            alert('Iltimos, to\'g\'ri telefon raqamini kiriting');
            phoneInput.focus();
            return;
        }

        const submitBtn = leadForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Yuborilmoqda...';

        try {
            // Save lead data to localStorage
            const leadData = {
                name: name,
                phone: phone,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('leadData', JSON.stringify(leadData));
            leadCaptured = true;

            // Send to backend
            const response = await fetch(getApiUrl('/api/leads'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Server error');
            }

            // Show success message
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'flex';
            
            // Hide form inputs and button
            leadForm.querySelectorAll('.form-group').forEach(group => group.style.display = 'none');
            submitBtn.style.display = 'none';
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeLeadModal();
                // Reset form
                leadForm.querySelectorAll('.form-group').forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'flex';
                successMessage.style.display = 'none';
                leadForm.reset();
            }, 3000);

        } catch (error) {
            console.error('Error submitting lead:', error);
            
            // Still mark as captured
            leadCaptured = true;
            
            // Show success message anyway (offline support)
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'flex';
            
            // Hide form inputs and button
            leadForm.querySelectorAll('.form-group').forEach(group => group.style.display = 'none');
            submitBtn.style.display = 'none';
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeLeadModal();
                // Reset form
                leadForm.querySelectorAll('.form-group').forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'flex';
                successMessage.style.display = 'none';
                leadForm.reset();
            }, 3000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});
