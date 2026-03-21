<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Billing Software - Admin</title>
    <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <aside class="sidebar">
            <div class="brand">Admin Panel</div>
            <ul class="sidebar-nav">
                <li><a href="#" data-target="manage-products-page" class="admin-nav-btn active">Products</a></li>
                <li><a href="#" data-target="manage-orders-page" class="admin-nav-btn">Orders</a></li>
                <li><a href="#" data-target="create-bill-page" class="admin-nav-btn">Create Bill</a></li>
                <li><a href="#" data-target="saved-bills-page" class="admin-nav-btn">Saved Bills</a></li>
            </ul>
        </aside>

        <main class="admin-content">
            <section id="manage-products-page" class="admin-section active-section">
                <h2>Manage Products</h2>
                <div class="form-container">
                    <input type="hidden" id="prodId">
                    <input type="text" id="prodName" placeholder="Product Name">
                    <input type="text" id="prodDesc" placeholder="Description">
                    <input type="number" id="prodPrice" placeholder="Price">
                    <button id="saveProductBtn" class="btn primary">Save Product</button>
                    <button id="clearProductBtn" class="btn secondary">Clear</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="adminProductTableBody"></tbody>
                </table>
            </section>

            <section id="manage-orders-page" class="admin-section">
                <h2>Incoming Orders</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="adminOrderTableBody"></tbody>
                </table>
            </section>

            <section id="create-bill-page" class="admin-section">
                <h2>Bill Generation Preview</h2>
                <div class="bill-container">
                    <div class="bill-header">
                        <input type="hidden" id="billOrderId">
                        <input type="text" id="billCustomerName" placeholder="Customer Name">
                        <input type="text" id="billCustomerPhone" placeholder="Customer Phone">
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="billItemsBody"></tbody>
                    </table>
                    
                    <div class="bill-totals">
                        <h3>Total Amount: ₹<span id="billTotalAmount">0.00</span></h3>
                        <button id="saveBillBtn" class="btn success">Save Estimation</button>
                    </div>
                </div>
            </section>

            <section id="saved-bills-page" class="admin-section">
                <h2>Saved Estimations</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Est ID</th>
                            <th>Customer Name</th>
                            <th>Phone</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="adminEstimationsTableBody"></tbody>
                </table>
            </section>
        </main>
    </div>
    
    <script src="/js/admin.js"></script>
</body>
</html>