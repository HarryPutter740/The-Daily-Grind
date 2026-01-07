document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Guard ---
    // This is the first thing we do. If the user is not logged in, redirect them.
    const loggedInUserData = localStorage.getItem('currentUser');
    if (!loggedInUserData) {
        // Redirect to the login page because no user is in the session.
        // The alert is optional but good for explaining why the redirect is happening.
        alert('You must be logged in to view this page. Redirecting...');
        window.location.href = 'CoffeeIndex.html';
        return; // Stop executing the rest of the script
    }
    const userNameSpan = document.getElementById('user-name');
    const accountNameSpan = document.getElementById('account-name');
    const accountEmailSpan = document.getElementById('account-email');
    const editDetailsButton = document.getElementById('edit-details-button');
    const editAccountForm = document.getElementById('edit-account-form');
    const accountDetailsDiv = document.querySelector('.account-details');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const editNameInput = document.getElementById('edit-name');
    const saveConfirmation = document.getElementById('save-confirmation');
    const ordersTbody = document.getElementById('orders-tbody');
    const noOrdersMessage = document.getElementById('no-orders-message');
    const paginationControls = document.getElementById('pagination-controls');
    const prevPageButton = document.getElementById('prev-page-btn');
    const nextPageButton = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const searchInput = document.getElementById('order-search-input');

    let currentUser = null;
    let allUserOrders = [];
    let filteredOrders = [];
    let currentPage = 1;
    const ordersPerPage = 5;


    /**
     * Retrieves the logged-in user's data from localStorage.
     * In a real application, this would come from a secure session.
     */
    function getLoggedInUser() {
        // This is a simulation. We'll just grab the first user for demonstration.
        // A better implementation would retrieve a specific 'loggedInUser' key.        
        if (!loggedInUserData) return null;
        return JSON.parse(loggedInUserData);
    }

    /**
     * Updates the UI with the current user's data.
     * @param {object} user - The user object.
     */
    function displayUserDetails(user) {
        if (user) {
            userNameSpan.textContent = user.name;
            accountNameSpan.textContent = user.name;
            accountEmailSpan.textContent = user.email;
        }
    }

    /**
     * Displays the user's order history.
     * @param {object} user - The user object.
     */
    function displayUserOrders(user) {
        // In a real app, this data would be fetched from a server. I've expanded the mock data.
        const mockOrders = { // This data now includes items for the details page
            "user@example.com": [
                { id: "TDG-84512", date: "2025-12-05", total: "$22.00", status: "Processing", items: [{ name: "Morning Solstice Blend", qty: 1, price: "$22.00" }] },
                { id: "TDG-84489", date: "2025-12-01", total: "$24.00", status: "Shipped", items: [{ name: "Midnight Velvet Roast", qty: 1, price: "$24.00" }] },
                { id: "TDG-84321", date: "2025-11-28", total: "$45.00", status: "Shipped", items: [{ name: "Golden Hour Espresso", qty: 1, price: "$23.00" }, { name: "Colombian Supremo", qty: 1, price: "$22.00" }] },
                { id: "TDG-84199", date: "2025-10-30", total: "$25.00", status: "Delivered", items: [{ name: "Ethiopian Yirgacheffe", qty: 1, price: "$25.00" }] },
                { id: "TDG-83715", date: "2025-09-29", total: "$45.00", status: "Delivered", items: [{ name: "Midnight Velvet Roast", qty: 2, price: "$45.00" }] },
                { id: "TDG-83604", date: "2025-09-15", total: "$22.00", status: "Delivered", items: [{ name: "Morning Solstice Blend", qty: 1, price: "$22.00" }] },
                { id: "TDG-83511", date: "2025-08-28", total: "$26.00", status: "Delivered", items: [{ name: "Sumatra Mandheling", qty: 1, price: "$26.00" }] },
                { id: "TDG-83400", date: "2025-08-12", total: "$45.00", status: "Delivered", items: [{ name: "Golden Hour Espresso", qty: 2, price: "$45.00" }] }
            ]
        };

        allUserOrders = mockOrders[user.email] || [];
        filteredOrders = allUserOrders; // Initially, all orders are shown

        if (allUserOrders.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersTbody.parentElement.style.display = 'none';
            paginationControls.style.display = 'none';
            searchInput.style.display = 'none';
        } else {
            noOrdersMessage.style.display = 'none';
            renderOrdersPage(1);
        }
    }

    /**
     * Renders a specific page of orders into the table.
     * @param {number} page - The page number to render.
     */
    function renderOrdersPage(page) {
        currentPage = page;
        ordersTbody.innerHTML = ''; // Clear existing rows

        if (filteredOrders.length === 0) {
            noOrdersMessage.textContent = 'No orders found matching your search.';
            noOrdersMessage.style.display = 'block';
            ordersTbody.parentElement.style.display = 'none';
        } else {
            noOrdersMessage.style.display = 'none';
            ordersTbody.parentElement.style.display = 'table';
        }

        const startIndex = (page - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        paginatedOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="order-details.html?id=${order.id}" class="order-link">${order.id}</a></td>
                <td>${order.date}</td>
                <td>${order.total}</td>
                <td>${getStatusWithIcon(order.status)}</td>
            `;
            ordersTbody.appendChild(row);
        });

        updatePaginationControls();
    }

    /**
     * Returns an HTML string for the status badge, including an icon.
     * @param {string} status - The order status ('Processing', 'Shipped', 'Delivered').
     * @returns {string} The complete HTML for the status badge.
     */
    function getStatusWithIcon(status) {
        let iconSvg = '';
        switch (status) {
            case 'Processing':
                // Icon: Cog or clock
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M12,4a8,8,0,0,1,7.89,6.7A1.54,1.54,0,0,0,21.38,12h0a1.54,1.54,0,0,0-1.48-1.3A4,4,0,0,0,16,8V6.11A8,8,0,0,0,12,4Z M12,20a8,8,0,0,1-7.89-6.7A1.54,1.54,0,0,0,2.62,12h0a1.54,1_54,0,0,0,1.48,1.3A4,4,0,0,0,8,16v1.89A8,8,0,0,0,12,20Z"/></svg>`;
                break;
            case 'Shipped':
                // Icon: Truck
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M20.5,13.5a1,1,0,0,0-1-1H16V9.5a1,1,0,0,0-1-1H4.52l-1-4H1.5a1,1,0,0,0,0,2h1.24l2.5,10H15a1,1,0,0,0,1-1V14.5h3.5A1,1,0,0,0,20.5,13.5ZM6.2,13.5,4.78,9.5H14v4Z M22.5,13.5a1,1,0,0,0-1-1H21V11.5a1,1,0,0,0-2,0V12.5H17a1,1,0,0,0,0,2h2v1a1,1,0,0,0,2,0V14.5h.5A1,1,0,0,0,22.5,13.5Z M8.5,18.5a2,2,0,1,0,2,2A2,2,0,0,0,8.5,18.5Zm8,0a2,2,0,1,0,2,2A2,2,0,0,0,16.5,18.5Z"/></svg>`;
                break;
            case 'Delivered':
                // Icon: Checkmark in a box
                iconSvg = `<svg viewBox="0 0 24 24"><path d="M21.5,4.5H2.5a1,1,0,0,0-1,1v13a1,1,0,0,0,1,1h19a1,1,0,0,0,1-1V5.5A1,1,0,0,0,21.5,4.5Zm-1,14H3.5V6.5h17Zm-4.65-7.35-5,5a1,1,0,0,1-1.41,0l-2-2a1,1,0,1,1,1.41-1.41L10.5,12.34l4.29-4.29a1,1,0,1,1,1.41,1.41Z"/></svg>`;
                break;
        }
        return `<span class="order-status status-${status.toLowerCase()}">${iconSvg}${status}</span>`;
    }

    /**
     * Updates the state and text of the pagination controls.
     */
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

        if (totalPages <= 1) {
            paginationControls.style.display = 'none';
            return;
        }

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationControls.style.display = 'flex';

        // Disable/enable previous button
        prevPageButton.disabled = currentPage === 1;

        // Disable/enable next button
        nextPageButton.disabled = currentPage === totalPages;
    }

    // --- View Toggling ---
    function showDisplayView() {
        accountDetailsDiv.style.display = 'block';
        editAccountForm.style.display = 'none';
    }

    function showEditView() {
        accountDetailsDiv.style.display = 'none';
        editAccountForm.style.display = 'block';
        // Populate the form with current data
        if (currentUser) {
            editNameInput.value = currentUser.name;
        }
    }

    // --- Initial Load ---
    currentUser = getLoggedInUser();
    displayUserDetails(currentUser);
    displayUserOrders(currentUser);

    // --- Event Listeners ---
    editDetailsButton.addEventListener('click', (e) => {
        e.preventDefault();
        showEditView();
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredOrders = allUserOrders.filter(order => 
            order.id.toLowerCase().includes(searchTerm)
        );
        renderOrdersPage(1); // Go back to the first page of results
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            renderOrdersPage(currentPage - 1);
        }
    });

    nextPageButton.addEventListener('click', () => {
        renderOrdersPage(currentPage + 1);
    });

    cancelEditButton.addEventListener('click', () => {
        showDisplayView();
    });

    editAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = editNameInput.value.trim();
        if (newName && currentUser) {
            updateUser(currentUser.email, { name: newName });
            currentUser.name = newName; // Update local user object
            displayUserDetails(currentUser); // Refresh UI

            // Show confirmation message
            saveConfirmation.textContent = 'Your details have been saved successfully.';
            saveConfirmation.style.display = 'block'; // Make it part of the layout
            // Use a tiny delay to allow the browser to apply 'display: block' before starting the transition
            setTimeout(() => {
                saveConfirmation.classList.add('visible');
            }, 10);

            // Start the fade-out process after 2.5 seconds
            setTimeout(() => {
                saveConfirmation.classList.remove('visible');
                // Set display to none after the fade-out animation (500ms) completes
                setTimeout(() => {
                    saveConfirmation.style.display = 'none';
                }, 500);
            }, 2500);

            showDisplayView(); // Switch back to display view
        }
    });
    const logoutButton = document.getElementById('logout-button');
    // Handle logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the link from navigating

            // In a real app, you would also clear session tokens from the server.
            localStorage.removeItem('currentUser'); // Clear the session
            alert('You have been logged out.');
            window.location.href = 'CoffeeIndex.html'; // Redirect to the login page
        });
    }

    /**
     * Updates a user's details in localStorage.
     * @param {string} userEmail - The email of the user to update.
     * @param {object} updatedDetails - An object with the details to update.
     */
    function updateUser(userEmail, updatedDetails) {
        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = allUsers.findIndex(user => user.email === userEmail);

        if (userIndex !== -1) {
            allUsers[userIndex] = { ...allUsers[userIndex], ...updatedDetails };
            localStorage.setItem('users', JSON.stringify(allUsers));
            // Update the session user as well so the name persists on refresh
            localStorage.setItem('currentUser', JSON.stringify(allUsers[userIndex]));
        }
    }
});