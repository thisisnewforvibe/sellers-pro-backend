// OTP Input handling
const otpInputs = document.querySelectorAll('.otp-input');
const otpForm = document.getElementById('otpForm');
const submitButton = document.getElementById('submitButton');
const formMessage = document.getElementById('formMessage');

// Auto-focus next input
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            e.target.value = '';
            return;
        }

        // Move to next input if value is entered
        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        // Clear message when typing
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    });

    // Handle backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

    // Handle paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        // Only process if it's 6 digits
        if (/^\d{6}$/.test(pastedData)) {
            pastedData.split('').forEach((char, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = char;
                }
            });
            otpInputs[5].focus();
        }
    });
});

// Form submission
otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get OTP value
    const otpValue = Array.from(otpInputs).map(input => input.value).join('');

    // Validate
    if (otpValue.length !== 6) {
        showMessage('Iltimos, 6 raqamli kodni to\'liq kiriting', 'error');
        return;
    }

    // Disable form
    setFormDisabled(true);
    showMessage('Tekshirilmoqda...', '');

    try {
        // API call to verify OTP
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_OTP), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ otp: otpValue })
        });

        const data = await response.json();

        if (data.success) {
            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage('✓ Muvaffaqiyatli!', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Noto\'g\'ri kod. Qaytadan urinib ko\'ring', 'error');
            setFormDisabled(false);
            clearOtpInputs();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Xatolik yuz berdi. Qaytadan urinib ko\'ring', 'error');
        setFormDisabled(false);
    }
});

// Helper functions
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
}

function setFormDisabled(disabled) {
    otpInputs.forEach(input => input.disabled = disabled);
    submitButton.disabled = disabled;
}

function clearOtpInputs() {
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
}

// Focus first input on load
window.addEventListener('load', () => {
    otpInputs[0].focus();
});