document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const submitBtn = leadForm.querySelector('.submit-btn');

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

            // Optional: Send to backend (uncomment if you have /api/leads endpoint)
            /*
            const response = await fetch('http://localhost:3000/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            });

            if (!response.ok) {
                throw new Error('Server error');
            }
            */

            // Show success and redirect to registration
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 500);

        } catch (error) {
            console.error('Error submitting lead:', error);
            
            // Still redirect even if backend fails (data is in localStorage)
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 500);
        }
    });

    // Focus on name input on load
    setTimeout(() => {
        nameInput.focus();
    }, 100);
});
