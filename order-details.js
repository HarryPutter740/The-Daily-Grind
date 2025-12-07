document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Guard ---
    const loggedInUserEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) {
        alert('You must be logged in to view this page. Redirecting...');
        window.location.href = '../CoffeeIndex.html';
        return;
    }

    const orderInfoDiv = document.getElementById('order-info');
    const orderItemsList = document.getElementById('order-items-list');
    const shippingAddressContent = document.getElementById('shipping-address-content');
    const orderActionsContainer = document.getElementById('order-actions-container');
    const billingAddressContent = document.getElementById('billing-address-content');
    const logoutButton = document.getElementById('logout-button');

    // In a real app, this data would be fetched from a server.
    const mockOrders = {
        "user@example.com": [
            // I've added a trackingUrl for 'Shipped' orders
            { id: "TDG-84512", date: "2025-12-05", total: "$22.00", status: "Processing", items: [{ name: "Morning Solstice Blend", qty: 1, price: "$22.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } },
            { id: "TDG-84489", date: "2025-12-01", total: "$24.00", status: "Shipped", items: [{ name: "Midnight Velvet Roast", qty: 1, price: "$24.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=123456789012" },
            { id: "TDG-84321", date: "2025-11-28", total: "$45.00", status: "Shipped", items: [{ name: "Golden Hour Espresso", qty: 1, price: "$23.00" }, { name: "Colombian Supremo", qty: 1, price: "$22.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=1Z9999999999999999" },
            { id: "TDG-84199", date: "2025-10-30", total: "$25.00", status: "Delivered", items: [{ name: "Ethiopian Yirgacheffe", qty: 1, price: "$25.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } },
            { id: "TDG-83715", date: "2025-09-29", total: "$45.00", status: "Delivered", items: [{ name: "Midnight Velvet Roast", qty: 2, price: "$45.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } },
            { id: "TDG-83604", date: "2025-09-15", total: "$22.00", status: "Delivered", items: [{ name: "Morning Solstice Blend", qty: 1, price: "$22.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } },
            { id: "TDG-83511", date: "2025-08-28", total: "$26.00", status: "Delivered", items: [{ name: "Sumatra Mandheling", qty: 1, price: "$26.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } },
            { id: "TDG-83400", date: "2025-08-12", total: "$45.00", status: "Delivered", items: [{ name: "Golden Hour Espresso", qty: 2, price: "$45.00" }], shippingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" }, billingAddress: { name: "Alex Doe", street: "123 Maple Street", cityStateZip: "San Francisco, CA 94102", country: "USA" } }
        ]
    };

    // Get order ID from URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    const allUserOrders = mockOrders[loggedInUserEmail] || [];
    const order = allUserOrders.find(o => o.id === orderId);

    if (order) {
        // Populate order summary
        orderInfoDiv.innerHTML = `
            <p><strong>Order Number:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${order.date}</p>
            <p><strong>Order Total:</strong> ${order.total}</p>
            <p><strong>Status:</strong> ${getStatusWithIcon(order.status)}</p>
        `;

        // Conditionally add the "Track Package" button
        if (order.status === 'Shipped' && order.trackingUrl) {
            const trackButton = document.createElement('a');
            trackButton.href = order.trackingUrl;
            trackButton.textContent = 'Track Package';
            trackButton.className = 'btn btn-track';
            trackButton.target = '_blank'; // Open tracking link in a new tab
            trackButton.rel = 'noopener noreferrer'; // Security best practice

            orderActionsContainer.appendChild(trackButton);
        }

        // Populate shipping address
        if (order.shippingAddress) {
            shippingAddressContent.innerHTML = `
                <p>${order.shippingAddress.name}</p>
                <p>${order.shippingAddress.street}</p>
                <p>${order.shippingAddress.cityStateZip}</p>
                <p>${order.shippingAddress.country}</p>
            `;
        }

        // Populate billing address
        if (order.billingAddress) {
            billingAddressContent.innerHTML = `
                <p>${order.billingAddress.name}</p>
                <p>${order.billingAddress.street}</p>
                <p>${order.billingAddress.cityStateZip}</p>
                <p>${order.billingAddress.country}</p>
            `;
        }

        // Populate order items
        orderItemsList.innerHTML = ''; // Clear list
        order.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="item-name">${item.name} (Qty: ${item.qty})</span>
                <span class="item-price">${item.price}</span>
            `;
            orderItemsList.appendChild(li);
        });

    } else {
        orderInfoDiv.innerHTML = `<p>Sorry, we could not find details for order #${orderId}.</p>`;
        document.getElementById('order-items').style.display = 'none';
        document.getElementById('order-shipping').style.display = 'none';
        document.getElementById('order-billing').style.display = 'none';
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

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            alert('You have been logged out.');
            window.location.href = '../CoffeeIndex.html';
        });
    }
});