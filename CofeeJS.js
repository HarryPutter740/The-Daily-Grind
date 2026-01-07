document.addEventListener('DOMContentLoaded', () => {
    // 1. Get references to all necessary elements
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const statusMessage = document.getElementById('status-message');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const registerPasswordInput = document.getElementById('register-password');
    const passwordStrengthIndicator = document.getElementById('password-strength-indicator');
    const modal = document.getElementById('forgot-password-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const modalStatusMessage = document.getElementById('modal-status-message');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const googleLoginBtn = document.getElementById('google-login-btn');



    /**
     * Toggles the active state between the Login and Register forms.
     * @param {string} showFormId - The ID of the form to show ('login-form' or 'register-form').
     */
    const showForm = (showFormId) => {
        // Determine which form and tab should be active/inactive
        const showFormElement = showFormId === 'login-form' ? loginForm : registerForm;
        const hideFormElement = showFormId === 'login-form' ? registerForm : loginForm;
        const activeTab = showFormId === 'login-form' ? loginTab : registerTab;
        const inactiveTab = showFormId === 'login-form' ? registerTab : loginTab;

        // --- Core JavaScript Element Manipulation ---

        // 1. Update form visibility using class toggling
        showFormElement.classList.remove('hidden-form');
        showFormElement.classList.add('active-form');

        hideFormElement.classList.remove('active-form');
        hideFormElement.classList.add('hidden-form');

        // 2. Update tab styling
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');

        // 3. Update ARIA attributes for accessibility
        activeTab.setAttribute('aria-selected', 'true');
        inactiveTab.setAttribute('aria-selected', 'false');
    };

    // 3. Attach Event Listeners (Core JavaScript functionality)
    loginTab.addEventListener('click', () => {
        showForm('login-form');
    });

    registerTab.addEventListener('click', () => {
        showForm('register-form');
    });

    // --- Functional Logic for Login & Registration ---

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                statusMessage.textContent = 'Login successful! Redirecting...';
                window.location.href = 'landing.html';
            } else {
                statusMessage.textContent = data.message || 'Login failed.';
            }
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = 'An error occurred connecting to the server.';
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                statusMessage.textContent = 'Registration successful! Please log in.';
                registerForm.reset();
                updatePasswordStrength('');
                showForm('login-form');
            } else {
                statusMessage.textContent = data.message || 'Registration failed.';
            }
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = 'An error occurred connecting to the server.';
        }
    });

    // --- "Forgot Password" Modal Logic ---

    let elementToFocusOnModalClose = null;

    const openModal = () => {
        elementToFocusOnModalClose = document.activeElement; // Store the currently focused element
        modal.classList.remove('hidden-modal');
        document.getElementById('reset-email').focus(); // Set focus to the email input in the modal
    };

    const closeModal = () => {
        modal.classList.add('hidden-modal');
        // Reset modal state on close
        forgotPasswordForm.reset();
        modalStatusMessage.textContent = '';
        if (elementToFocusOnModalClose) {
            elementToFocusOnModalClose.focus(); // Return focus to the element that opened the modal
        }
    };

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // Close modal if the overlay is clicked, but not the content inside
        if (e.target === modal) {
            closeModal();
        }
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find(u => u.email === email);

        // In a real app, you would trigger a backend service to send an email.
        // Here, we just show a confirmation message regardless of whether the user was found,
        // which is a security best practice to prevent email enumeration.
        if (user) {
            console.log(`Password reset initiated for: ${user.password}`); // Simulate backend action
        }

        modalStatusMessage.textContent = 'If an account with that email exists, you will receive reset instructions.';
        setTimeout(closeModal, 4000); // Close the modal after a few seconds
    });

    // --- Password Strength Indicator Logic ---

    registerPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        updatePasswordStrength(password);
    });

    // --- Social Login Simulation ---

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            alert('Google login is not implemented in this demo.');
        });
    }

    document.getElementById('facebook-login-btn').addEventListener('click', () => {
        alert('Facebook login is not implemented in this demo.');
    });

    /**
     * Updates the password strength indicator based on the provided password.
     * @param {string} password - The password string to evaluate.
     */
    function updatePasswordStrength(password) {
        const passwordStrengthIndicator = document.getElementById('password-strength-indicator');
        let strength = 0;
        let strengthText = 'Too Weak';
        let strengthClass = 'strength-too-weak';

        // Criteria for strength
        // Note: In a real app, consider using a library like zxcvbn for more robust strength estimation.
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        // Score based on criteria
        if (password.length >= 8) strength++;
        if (hasLower) strength++;
        if (hasUpper) strength++;
        if (hasNumber) strength++;
        if (hasSpecial) strength++;

        // Adjust strength text and class
        if (password.length === 0) {
            strengthText = '';
            strengthClass = '';
        } else if (strength <= 2) {
            strengthText = 'Weak';
            strengthClass = 'strength-weak';
        } else if (strength === 3) {
            strengthText = 'Medium';
            strengthClass = 'strength-medium';
        } else if (strength >= 4) {
            strengthText = 'Strong';
            strengthClass = 'strength-strong';
        }

        passwordStrengthIndicator.className = `password-strength ${strengthClass}`;
        
        // Update the visually hidden text for screen readers
        if (passwordStrengthText) {
            passwordStrengthText.textContent = strengthText;
        }
    }

    // --- Password Visibility Toggle Logic ---

    /**
     * Toggles the visibility of a password field.
     * @param {HTMLButtonElement} toggleButton - The button that triggers the toggle.
     * @param {HTMLInputElement} passwordInput - The password input field.
     */
    const togglePasswordVisibility = (toggleButton, passwordInput) => {
        const isPassword = passwordInput.type === 'password';
        const eyeIcon = toggleButton.querySelector('.icon-eye');
        const eyeSlashIcon = toggleButton.querySelector('.icon-eye-slash');

        passwordInput.type = isPassword ? 'text' : 'password';
        toggleButton.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

        // Toggle icon visibility
        eyeIcon.classList.toggle('hidden-icon', isPassword);
        eyeSlashIcon.classList.toggle('hidden-icon', !isPassword);
    };

    // Apply the toggle logic to all password toggle buttons on the page
    document.querySelectorAll('.password-toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Find the associated password input within the same wrapper
            const passwordWrapper = button.closest('.password-wrapper');
            const passwordInput = passwordWrapper.querySelector('input');
            togglePasswordVisibility(button, passwordInput);
        });
    });


});