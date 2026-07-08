document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    
    if (!form) return; // Only run on pages with the form

    const formStatus = document.getElementById('form-status');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        formStatus.textContent = '';
        formStatus.style.color = '';
        
        let isValid = true;
        const lang = document.documentElement.getAttribute('lang');

        if (!nameInput.value.trim()) {
            document.getElementById('name-error').textContent = getTranslation('err_name');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('email-error').textContent = getTranslation('err_email');
            isValid = false;
        }
        
        if (!subjectInput.value.trim()) {
            document.getElementById('subject-error').textContent = getTranslation('err_subject');
            isValid = false;
        }
        
        if (!messageInput.value.trim()) {
            document.getElementById('message-error').textContent = getTranslation('err_message');
            isValid = false;
        }

        if (!isValid) return;

        // Safe Form Submission Check
        const endpoint = CONFIG.FORMSPREE_ENDPOINT;

        if (!endpoint) {
            formStatus.textContent = getTranslation('form_unconfigured');
            formStatus.style.color = '#EF4444';
            return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                })
            });

            if (response.ok) {
                formStatus.textContent = getTranslation('form_success');
                formStatus.style.color = '#10B981';
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            formStatus.textContent = getTranslation('form_error');
            formStatus.style.color = '#EF4444';
        }
    });

    function getTranslation(key) {
        const lang = document.documentElement.getAttribute('lang');
        return translations[lang][key] || '';
    }
});
