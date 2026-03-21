document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');

    function switchTab(targetId) {
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active-section'));

        const targetBtn = document.querySelector(`[data-target="${targetId}"]`);
        if(targetBtn) targetBtn.classList.add('active');
        document.getElementById(targetId).classList.add('active-section');

        if(targetId === 'manage-products-page') loadProducts();
        if(targetId === 'manage-orders-page') loadOrders();
        if(targetId === 'saved-bills-page') loadEstimations();
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(btn.getAttribute('data-target'));
        });
    });

    // Initial Load
    loadProducts();

    // 2. Product Management
    function loadProducts() {
        fetch('/api/admin/products')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('adminProductTableBody');
                tbody.innerHTML = '';
                data.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${p.id}</td>
                        <td>${p.name}</td>
                        <td>₹${p.price}</td>
                        <td>
                            <button class="btn warning edit-prod-btn" data-id="${p.id}" data-name="${p.name}" data-desc="${p.description || ''}" data-price="${p.price}">Edit</button>
                            <button class="btn danger delete-prod-btn" data-id="${p.id}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                attachProductEvents();
            });
    }

    function attachProductEvents() {
        document.querySelectorAll('.edit-prod-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const b = e.target;
                document.getElementById('prodId').value = b.getAttribute('data-id');
                document.getElementById('prodName').value = b.getAttribute('data-name');
                document.getElementById('prodDesc').value = b.getAttribute('data-desc');
                document.getElementById('prodPrice').value = b.getAttribute('data-price');
            });
        });

        document.querySelectorAll('.delete-prod-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm('Are you sure?')) {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/api/admin/products/${e.target.getAttribute('data-id')}`, { 
                        method: 'DELETE',
                        headers: { 'X-CSRF-TOKEN': csrfToken }
                    })
                        .then(() => loadProducts());
                }
            });
        });
    }

    document.getElementById('saveProductBtn').addEventListener('click', () => {
        const id = document.getElementById('prodId').value;
        const name = document.getElementById('prodName').value;
        const desc = document.getElementById('prodDesc').value;
        const price = document.getElementById('prodPrice').value;

        const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
        const method = id ? 'PUT' : 'POST';

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ name, description: desc, price })
        }).then(() => {
            document.getElementById('clearProductBtn').click();
            loadProducts();
        });
    });

    document.getElementById('clearProductBtn').addEventListener('click', () => {
        document.getElementById('prodId').value = '';
        document.getElementById('prodName').value = '';
        document.getElementById('prodDesc').value = '';
        document.getElementById('prodPrice').value = '';
    });

    // 3. Order Management
    let allOrders = [];
    function loadOrders() {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                allOrders = data;
                const tbody = document.getElementById('adminOrderTableBody');
                tbody.innerHTML = '';
                data.forEach(o => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#${o.id}</td>
                        <td>${o.customer_name}</td>
                        <td>${o.customer_phone}</td>
                        <td><strong>${o.status.toUpperCase()}</strong></td>
                        <td>
                            ${o.status === 'pending' ? `<button class="btn primary move-estimate-btn" data-id="${o.id}">Move to Estimate</button>` : 'Estimated'}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                document.querySelectorAll('.move-estimate-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const orderId = parseInt(e.target.getAttribute('data-id'));
                        moveToEstimate(orderId);
                    });
                });
            });
    }

    // 4. Bill / Estimate Generation
    let currentBillItems = [];

    function moveToEstimate(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if(!order) return;

        document.getElementById('billOrderId').value = order.id;
        document.getElementById('billCustomerName').value = order.customer_name;
        document.getElementById('billCustomerPhone').value = order.customer_phone;

        currentBillItems = order.items.map(item => ({
            product_name: item.product.name,
            quantity: item.quantity,
            price: parseFloat(item.price_at_order),
            line_total: item.quantity * parseFloat(item.price_at_order)
        }));

        renderBillItems();
        switchTab('create-bill-page');
    }

    function renderBillItems() {
        const tbody = document.getElementById('billItemsBody');
        tbody.innerHTML = '';
        let total = 0;

        currentBillItems.forEach((item, index) => {
            total += item.line_total;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.line_total}</td>
                <td><button class="btn danger" onclick="removeBillItem(${index})">X</button></td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('billTotalAmount').innerText = total.toFixed(2);
    }

    window.removeBillItem = function(index) {
        currentBillItems.splice(index, 1);
        renderBillItems();
    };

    document.getElementById('saveBillBtn').addEventListener('click', () => {
        const payload = {
            order_id: document.getElementById('billOrderId').value || null,
            customer_name: document.getElementById('billCustomerName').value,
            customer_phone: document.getElementById('billCustomerPhone').value,
            total_amount: document.getElementById('billTotalAmount').innerText,
            items: currentBillItems
        };

        if(!payload.customer_name || currentBillItems.length === 0) {
            alert('Customer name and items are required.');
            return;
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch('/api/admin/estimations', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            alert(data.message);
            switchTab('saved-bills-page');
        });
    });

    // 5. Saved Estimations
    function loadEstimations() {
        fetch('/api/admin/estimations')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('adminEstimationsTableBody');
                tbody.innerHTML = '';
                data.forEach(est => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#EST-${est.id}</td>
                        <td>${est.customer_name}</td>
                        <td>${est.customer_phone}</td>
                        <td>₹${est.total_amount}</td>
                        <td>${new Date(est.created_at).toLocaleDateString()}</td>
                        <td><button class="btn primary" onclick='printBill(${JSON.stringify(est)})'>Print</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            });
    }

    // 6. Print Logic
    window.printBill = function(est) {
        // Create an isolated print container
        let printDiv = document.getElementById('print-section');
        if (!printDiv) {
            printDiv = document.createElement('div');
            printDiv.id = 'print-section';
            document.body.appendChild(printDiv);
        }

        let itemsHtml = est.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.line_total}</td>
            </tr>
        `).join('');

        printDiv.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">Tax Invoice / Estimation</h1>
                <div style="display: flex; justify-content: space-between; margin-top: 20px; margin-bottom: 20px;">
                    <div>
                        <p><strong>Bill To:</strong> ${est.customer_name}</p>
                        <p><strong>Phone:</strong> ${est.customer_phone}</p>
                    </div>
                    <div>
                        <p><strong>Est No:</strong> #EST-${est.id}</p>
                        <p><strong>Date:</strong> ${new Date(est.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd;">Qty</th>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd;">Rate</th>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <h2 style="text-align: right; margin-top: 20px;">Grand Total: ₹${est.total_amount}</h2>
            </div>
        `;

        window.print();
    };
});