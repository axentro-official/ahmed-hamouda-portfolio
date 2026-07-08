document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Theme Synchronization
    const themeSwitches = document.querySelectorAll('.theme-switch');
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    themeSwitches.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Language Synchronization
    const langSwitches = document.querySelectorAll('.lang-switch');
    const savedLang = localStorage.getItem('lang') || 'ar'; // Default Arabic
    setLanguage(savedLang);

    langSwitches.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang');
            setLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    });

    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('lang', lang);
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('.lang-current').forEach(el => {
            el.textContent = lang === 'ar' ? 'EN' : 'ع';
        });
    }

    // Mobile Menu Accessibility
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = primaryNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close mobile menu on link click
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && primaryNav.classList.contains('active')) {
                closeMenu();
                menuToggle.focus(); // Restore focus
            }
        });

        function closeMenu() {
            primaryNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Certificate Modal Accessibility
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const viewCertButtons = document.querySelectorAll('.view-cert');
    let lastFocusedElement = null;

    if (modal) {
        viewCertButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                lastFocusedElement = btn;
                const imgSrc = btn.getAttribute('data-img');
                const imgAlt = btn.getAttribute('data-alt');
                modalImg.src = imgSrc;
                modalImg.alt = imgAlt || 'Certificate Full View';
                modal.hidden = false;
                document.body.style.overflow = 'hidden';
                
                // Focus the close button
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
                
                // Focus Trap
                trapFocus(modal);
            });
        });

        function closeModal() {
            modal.hidden = true;
            modalImg.src = '';
            modalImg.alt = '';
            document.body.style.overflow = '';
            if (lastFocusedElement) lastFocusedElement.focus();
        }

        modal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        function trapFocus(element) {
            const focusableEls = element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
            if (focusableEls.length === 0) return;
            
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];

            const handleKeyDown = function(e) {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            };

            element.addEventListener('keydown', handleKeyDown);
            
            // Clean up listener when modal closes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'hidden' && element.hidden) {
                        element.removeEventListener('keydown', handleKeyDown);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(element, { attributes: true });
        }
    }
});
