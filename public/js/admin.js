document.addEventListener('DOMContentLoaded', () => {
    // Nav Logic
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    const dbProductSelect = document.getElementById('dbProductSelect');

    const dateStr = new Date().toLocaleDateString();
    document.getElementById('previewDate').innerText = dateStr;

    function switchTab(targetId) {
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active-section'));

        const targetBtn = document.querySelector(`[data-target="${targetId}"]`);
        if(targetBtn) targetBtn.classList.add('active');
        document.getElementById(targetId).classList.add('active-section');

        if(targetId === 'manage-products-page') loadProducts();
        if(targetId === 'manage-orders-page') loadOrders();
        if(targetId === 'saved-bills-page') loadEstimations();
        if(targetId === 'create-bill-page') populateProductSelect();
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const elm = e.target.closest('.admin-nav-btn');
            switchTab(elm.getAttribute('data-target'));
        });
    });

    switchTab('manage-products-page');

    // --- Product Management ---
    let globalProducts = [];

    function loadProducts() {
        fetch('/api/admin/products')
            .then(res => res.json())
            .then(data => {
                globalProducts = data;
                const tbody = document.getElementById('adminProductTableBody');
                tbody.innerHTML = '';
                data.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#${p.id}</td>
                        <td>${p.name}</td>
                        <td>₹${p.price}</td>
                        <td>
                            <button class="btn warning edit-prod-btn" data-id="${p.id}" data-name="${p.name}" data-desc="${p.description || ''}" data-price="${p.price}"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button class="btn danger delete-prod-btn" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                attachProductEvents();
                populateProductSelect();
            });
    }

    function attachProductEvents() {
        document.querySelectorAll('.edit-prod-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const b = e.target.closest('button');
                document.getElementById('prodId').value = b.getAttribute('data-id');
                document.getElementById('prodName').value = b.getAttribute('data-name');
                document.getElementById('prodDesc').value = b.getAttribute('data-desc');
                document.getElementById('prodPrice').value = b.getAttribute('data-price');
            });
        });

        document.querySelectorAll('.delete-prod-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm('Are you sure you want to delete this product?')) {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    fetch(`/api/admin/products/${e.target.closest('button').getAttribute('data-id')}`, { 
                        method: 'DELETE',
                        headers: { 'X-CSRF-TOKEN': csrfToken }
                    })
                    .then(() => { showToast('Product deleted'); loadProducts(); });
                }
            });
        });
    }

    document.getElementById('saveProductBtn').addEventListener('click', () => {
        const id = document.getElementById('prodId').value;
        const name = document.getElementById('prodName').value;
        const desc = document.getElementById('prodDesc').value;
        const price = document.getElementById('prodPrice').value;

        if(!name || !price) {
            alert('Name and price are required');
            return;
        }

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
            showToast('Product saved successfully');
            loadProducts();
        });
    });

    document.getElementById('clearProductBtn').addEventListener('click', () => {
        document.getElementById('prodId').value = '';
        document.getElementById('prodName').value = '';
        document.getElementById('prodDesc').value = '';
        document.getElementById('prodPrice').value = '';
    });

    // --- Order Management ---
    let allOrders = [];
    function loadOrders() {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                allOrders = data;
                const tbody = document.getElementById('adminOrderTableBody');
                tbody.innerHTML = '';
                data.forEach(o => {
                    const statusBadge = o.status === 'pending' ? '<span style="color:var(--warning);font-weight:bold;">Pending</span>' : '<span style="color:var(--success);font-weight:bold;">Billed</span>';
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#ORD-${o.id}</td>
                        <td>${o.customer_name}</td>
                        <td>${o.customer_phone}</td>
                        <td>${statusBadge}</td>
                        <td>
                            ${o.status === 'pending' ? `<button class="btn primary move-estimate-btn" data-id="${o.id}"><i class="fa-solid fa-file-invoice"></i> Generate Bill</button>` : `<button class="btn secondary" disabled>Generated</button>`}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                document.querySelectorAll('.move-estimate-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const orderId = parseInt(e.target.closest('button').getAttribute('data-id'));
                        moveToEstimate(orderId);
                    });
                });
            });
    }

    // --- Advanced Bill Generation ---
    let currentBillItems = [];
    let isBillSaved = false;

    // "New Bill" Button Logic
    document.getElementById('newBillBtn').addEventListener('click', () => {
        if(confirm('Start a new bill? All current unsaved changes will be lost.')) {
            clearBillForm();
            showToast('Ready for new bill');
        }
    });

    function clearBillForm() {
        document.getElementById('billOrderId').value = '';
        document.getElementById('billCustomerName').value = '';
        document.getElementById('billCustomerPhone').value = '';
        currentBillItems = [];
        isBillSaved = false;
        renderBillItems();
        updatePreviewCustomer();
        updateSaveBtnState();
        const paperTitle = document.querySelector('.invoice-title h1');
        const invNo = document.querySelector('.invoice-meta span:last-child');
        paperTitle.innerText = 'INVOICE';
        invNo.innerHTML = '<strong>Inv No:</strong> #DRAFT';
    }

    function updateSaveBtnState() {
        const btn = document.getElementById('saveBillBtn');
        const text = document.getElementById('saveBtnText');
        if(isBillSaved) {
            btn.classList.remove('success');
            btn.classList.add('secondary');
            btn.disabled = true;
            text.innerText = 'Invoice Saved';
        } else {
            btn.classList.add('success');
            btn.classList.remove('secondary');
            btn.disabled = false;
            text.innerText = 'Save Invoice';
        }
    }

    function populateProductSelect() {
        dbProductSelect.innerHTML = '<option value="">-- Choose Product --</option>';
        globalProducts.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} - ₹${p.price}`;
            opt.dataset.price = p.price;
            opt.dataset.name = p.name;
            dbProductSelect.appendChild(opt);
        });
    }

    function moveToEstimate(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if(!order) return;

        clearBillForm();
        document.getElementById('billOrderId').value = order.id;
        document.getElementById('billCustomerName').value = order.customer_name;
        document.getElementById('billCustomerPhone').value = order.customer_phone;
        updatePreviewCustomer();

        currentBillItems = order.items.map((item, index) => ({
            id: 'ord_item_' + index,
            product_name: item.product.name,
            quantity: item.quantity,
            price: parseFloat(item.price_at_order),
            line_total: item.quantity * parseFloat(item.price_at_order)
        }));

        renderBillItems();
        switchTab('create-bill-page');
        showToast('Order loaded into bill generator');
    }

    document.getElementById('billCustomerName').addEventListener('input', updatePreviewCustomer);
    document.getElementById('billCustomerPhone').addEventListener('input', updatePreviewCustomer);

    function updatePreviewCustomer() {
        const name = document.getElementById('billCustomerName').value;
        const phone = document.getElementById('billCustomerPhone').value;
        document.getElementById('previewCustName').innerText = name || 'Customer Name';
        document.getElementById('previewCustPhone').innerText = phone || '+91-xxxxxxxxxx';
    }

    document.getElementById('addDbProductBtn').addEventListener('click', () => {
        const sel = dbProductSelect.options[dbProductSelect.selectedIndex];
        if(!sel.value) return;
        
        const qty = parseInt(document.getElementById('dbProductQty').value) || 1;
        const price = parseFloat(sel.dataset.price);
        
        currentBillItems.push({
            id: 'db_' + Date.now(),
            product_name: sel.dataset.name,
            quantity: qty,
            price: price,
            line_total: price * qty
        });
        
        isBillSaved = false;
        updateSaveBtnState();
        dbProductSelect.value = '';
        document.getElementById('dbProductQty').value = '1';
        renderBillItems();
    });

    document.getElementById('addCustomProductBtn').addEventListener('click', () => {
        const name = document.getElementById('customProdName').value;
        const price = parseFloat(document.getElementById('customProdPrice').value);
        const qty = parseInt(document.getElementById('customProdQty').value) || 1;

        if(!name || isNaN(price)) {
            alert('Custom product name and valid price are required.');
            return;
        }

        currentBillItems.push({
            id: 'custom_' + Date.now(),
            product_name: name,
            quantity: qty,
            price: price,
            line_total: price * qty
        });

        isBillSaved = false;
        updateSaveBtnState();
        document.getElementById('customProdName').value = '';
        document.getElementById('customProdPrice').value = '';
        document.getElementById('customProdQty').value = '1';
        renderBillItems();
    });

    function renderBillItems() {
        const tbody = document.getElementById('billItemsBody');
        tbody.innerHTML = '';
        let total = 0;

        if(currentBillItems.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-bill-row">
                    <td colspan="5" style="text-align:center; color:#999; padding: 20px;">No items added yet.</td>
                </tr>
            `;
            document.getElementById('billTotalAmount').innerText = '₹0.00';
            document.getElementById('previewSubtotal').innerText = '₹0.00';
            return;
        }

        currentBillItems.forEach((item, index) => {
            total += item.line_total;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.product_name}</strong></td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
                <td style="text-align:right; font-weight:600;">₹${item.line_total.toFixed(2)}</td>
                <td class="noprint" style="text-align:center;">
                    <button class="btn danger" style="padding: 0.3rem 0.6rem; border-radius:4px;" onclick="removeBillItem(${index})"><i class="fa-solid fa-xmark"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('previewSubtotal').innerText = '₹' + total.toFixed(2);
        document.getElementById('billTotalAmount').innerText = '₹' + total.toFixed(2);
    }

    window.removeBillItem = function(index) {
        currentBillItems.splice(index, 1);
        isBillSaved = false;
        updateSaveBtnState();
        renderBillItems();
    };

    // Save Logic (Separate from Print)
    document.getElementById('saveBillBtn').addEventListener('click', () => {
        const orderId = document.getElementById('billOrderId').value;
        const customerName = document.getElementById('billCustomerName').value;
        const customerPhone = document.getElementById('billCustomerPhone').value;
        const totalAmountStr = document.getElementById('billTotalAmount').innerText.replace('₹', '');
        const totalAmount = parseFloat(totalAmountStr);

        if(!customerName || currentBillItems.length === 0) {
            alert('Customer name and at least one item are required to save.');
            return;
        }

        const payload = {
            order_id: orderId || null,
            customer_name: customerName,
            customer_phone: customerPhone,
            total_amount: totalAmount,
            items: currentBillItems
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch('/api/admin/estimations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            showToast('Invoice Saved Successfully!');
            isBillSaved = true;
            updateSaveBtnState();
            loadEstimations();
            loadOrders();
        });
    });

    // Print logic (Separate from Save)
    document.getElementById('printBillBtn').addEventListener('click', () => {
        if(currentBillItems.length === 0) {
            alert('No items to print.');
            return;
        }
        
        // Ensure section is visible for print
        const section = document.getElementById('create-bill-page');
        const wasHidden = !section.classList.contains('active-section');
        if(wasHidden) section.classList.add('active-section');

        setTimeout(() => {
            window.print();
            if(wasHidden) section.classList.remove('active-section');
        }, 100);
    });

    // --- Saved Estimations ---
    function loadEstimations() {
        fetch('/api/admin/estimations')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('adminEstimationsTableBody');
                tbody.innerHTML = '';
                data.forEach(est => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>#INV-${est.id}</strong></td>
                        <td>${est.customer_name}</td>
                        <td>${est.customer_phone || '-'}</td>
                        <td style="font-weight:bold; color:var(--dark);">₹${parseFloat(est.total_amount).toFixed(2)}</td>
                        <td>${new Date(est.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn primary view-saved-bill-btn" data-id="${est.id}"><i class="fa-solid fa-eye"></i> View</button>
                            <button class="btn secondary" onclick='printSavedBill(${JSON.stringify(est)})'><i class="fa-solid fa-print"></i> Re-Print</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                document.querySelectorAll('.view-saved-bill-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const estId = e.target.closest('button').dataset.id;
                        const est = data.find(item => item.id == estId);
                        if(est) viewEstimation(est);
                    });
                });
            });
    }

    function viewEstimation(est) {
        clearBillForm();
        document.getElementById('billCustomerName').value = est.customer_name;
        document.getElementById('billCustomerPhone').value = est.customer_phone || '';
        document.getElementById('billOrderId').value = est.order_id || '';
        
        currentBillItems = est.items.map((item, i) => ({
            id: 'saved_' + i,
            product_name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            line_total: parseFloat(item.line_total)
        }));

        isBillSaved = true;
        updateSaveBtnState();
        renderBillItems();
        updatePreviewCustomer();
        
        // Update Preview Headers
        const paperTitle = document.querySelector('.invoice-title h1');
        const invNo = document.querySelector('.invoice-meta span:last-child');
        paperTitle.innerText = 'ESTIMATION';
        invNo.innerHTML = `<strong>Inv No:</strong> #INV-${est.id}`;
        document.getElementById('previewDate').innerText = new Date(est.created_at).toLocaleDateString();

        switchTab('create-bill-page');
        showToast('Estimation loaded for view');
    }

    // Fixed Print Saved Bill
    window.printSavedBill = function(est) {
        // Load into preview temp
        document.getElementById('previewCustName').innerText = est.customer_name;
        document.getElementById('previewCustPhone').innerText = est.customer_phone || '';
        document.getElementById('previewDate').innerText = new Date(est.created_at).toLocaleDateString();
        
        const paperTitle = document.querySelector('.invoice-title h1');
        const invNo = document.querySelector('.invoice-meta span:last-child');
        const oldTitle = paperTitle.innerText;
        const oldInv = invNo.innerHTML;
        
        paperTitle.innerText = 'ESTIMATION';
        invNo.innerHTML = `<strong>Inv No:</strong> #INV-${est.id}`;

        const oldItems = [...currentBillItems];
        currentBillItems = est.items.map((item, i) => ({
            id: i,
            product_name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            line_total: parseFloat(item.line_total)
        }));
        
        renderBillItems();
        
        // Ensure section is visible for print
        const section = document.getElementById('create-bill-page');
        const wasHidden = !section.classList.contains('active-section');
        if(wasHidden) section.classList.add('active-section');

        // Small delay to ensure render
        setTimeout(() => {
            window.print();
            if(wasHidden) section.classList.remove('active-section');
            
            // Restore context
            currentBillItems = oldItems;
            renderBillItems();
            updatePreviewCustomer();
            paperTitle.innerText = oldTitle;
            invNo.innerHTML = oldInv;
            document.getElementById('previewDate').innerText = dateStr;
        }, 100);
    };

    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        document.getElementById('toastText').innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});