document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav');
    const mobileNav = document.getElementById('mobile-main-nav');

    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');

    if (loggedInUserEmail) {
        // --- User is LOGGED IN ---

        // 1. Update Desktop Navigation
        if (mainNav) {
            const profileLi = document.createElement('li');
            profileLi.className = 'dropdown user-menu';
            const profileTrigger = document.createElement('a');
            profileTrigger.href = '#';
            profileTrigger.className = 'user-menu-trigger';
            profileTrigger.innerHTML = `
                <svg class="profile-icon" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                <span>Profile</span> &#9662;
            `;
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';
            dropdownMenu.innerHTML = `
                <li><a href="landing.html">My Dashboard</a></li>
                <li><a href="#" id="logout-button-main">Logout</a></li>
            `;
            profileLi.appendChild(profileTrigger);
            profileLi.appendChild(dropdownMenu);
            mainNav.appendChild(profileLi);

            document.getElementById('logout-button-main').addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = '../CoffeeIndex.html';
            });
        }

        // 2. Update Mobile Navigation
        if (mobileNav) {
            const dashboardLi = document.createElement('li');
            dashboardLi.innerHTML = `<a href="landing.html">My Dashboard</a>`;
            mobileNav.appendChild(dashboardLi);

            const logoutLi = document.createElement('li');
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('loggedInUser');
                alert('You have been logged out.');
                window.location.href = '../CoffeeIndex.html';
            });
            logoutLi.appendChild(logoutLink);
            mobileNav.appendChild(logoutLi);
        }
    } else {
        // --- User is a GUEST ---

        // 1. Update Desktop Navigation
        if (mainNav) {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="../CoffeeIndex.html" class="nav-login-link">Login</a>`;
            mainNav.appendChild(loginLi);
        }

        // 2. Update Mobile Navigation
        if (mobileNav) {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="../CoffeeIndex.html">Login</a>`;
            mobileNav.appendChild(loginLi);
        }
    }
});