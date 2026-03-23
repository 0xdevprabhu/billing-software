<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Jamboo Shop - Admin Dashboard</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
    <div class="admin-layout">
        <aside class="sidebar">
            <div class="brand">
                <i class="fa-solid fa-cube logo-icon"></i> Jamboo Shop Admin
            </div>
            <ul class="sidebar-nav">
                <li><a href="#" data-target="manage-products-page" class="admin-nav-btn active"><i class="fa-solid fa-box-open"></i> Inventory</a></li>
                <li><a href="#" data-target="manage-orders-page" class="admin-nav-btn"><i class="fa-solid fa-cart-shopping"></i> Online Orders</a></li>
                <li><a href="#" data-target="create-bill-page" class="admin-nav-btn"><i class="fa-solid fa-file-invoice"></i> Create Bill</a></li>
                <li><a href="#" data-target="saved-bills-page" class="admin-nav-btn"><i class="fa-solid fa-folder-open"></i> Saved Bills</a></li>
                <li class="logout-item">
                    <form action="{{ route('logout') }}" method="POST" id="logout-form">
                        @csrf
                        <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" class="admin-nav-btn logout-btn">
                            <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </a>
                    </form>
                </li>
            </ul>

        </aside>

        <main class="admin-content">
            <!-- Manage Products Page -->
            <section id="manage-products-page" class="admin-section active-section">
                <div class="section-header">
                    <h2><i class="fa-solid fa-boxes-stacked"></i> Manage Inventory</h2>
                    <p>Add, edit, or remove products from your catalog.</p>
                </div>
                
                <div class="form-container modern-card">
                    <input type="hidden" id="prodId">
                    <div class="input-group">
                        <i class="fa-solid fa-tag"></i>
                        <input type="text" id="prodName" placeholder="Product Name">
                    </div>
                    <div class="input-group">
                        <i class="fa-solid fa-circle-info"></i>
                        <input type="text" id="prodDesc" placeholder="Description">
                    </div>
                    <div class="input-group">
                        <i class="fa-solid fa-indian-rupee-sign"></i>
                        <input type="number" id="prodPrice" placeholder="Price">
                    </div>
                    <button id="saveProductBtn" class="btn primary"><i class="fa-solid fa-floppy-disk"></i> Save</button>
                    <button id="clearProductBtn" class="btn secondary"><i class="fa-solid fa-eraser"></i> Clear</button>
                </div>

                <div class="table-container modern-card">
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
                </div>
            </section>

            <!-- Incoming Orders Page -->
            <section id="manage-orders-page" class="admin-section">
                <div class="section-header">
                    <h2><i class="fa-solid fa-cart-arrow-down"></i> Incoming Orders</h2>
                    <p>Manage unbilled online client orders.</p>
                </div>
                <div class="table-container modern-card">
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
                </div>
            </section>

            <!-- Create Bill Page (Advanced UI) -->
            <section id="create-bill-page" class="admin-section">
                <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2><i class="fa-solid fa-file-invoice-dollar"></i> Bill Generation</h2>
                        <p>Create and print invoices for your customers.</p>
                    </div>
                    <button id="newBillBtn" class="btn primary"><i class="fa-solid fa-plus-circle"></i> New Bill</button>
                </div>
                
                <div class="bill-split-layout">
                    <!-- Left Side: Controls -->
                    <div class="bill-controls">
                        <div class="control-card modern-card">
                            <h3><i class="fa-solid fa-user"></i> Customer Details</h3>
                            <input type="hidden" id="billOrderId">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" id="billCustomerName" placeholder="e.g. Jane Doe">
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="text" id="billCustomerPhone" placeholder="e.g. +91 9876543210">
                            </div>
                        </div>

                        <div class="control-card modern-card">
                            <h3><i class="fa-solid fa-cart-plus"></i> Add Product</h3>
                            <label>Select from Inventory</label>
                            <div class="search-product-group">
                                <select id="dbProductSelect">
                                    <option value="">-- Choose Product --</option>
                                </select>
                                <input type="number" id="dbProductQty" value="1" min="1" placeholder="Qty">
                                <button id="addDbProductBtn" class="btn primary"><i class="fa-solid fa-plus"></i> Add</button>
                            </div>
                            
                            <hr class="divider">
                            
                            <label>Or Add Custom / Extra Product</label>
                            <div class="custom-product-form">
                                <input type="text" id="customProdName" placeholder="Custom item name">
                                <div class="price-qty-row">
                                    <input type="number" id="customProdPrice" placeholder="Price (₹)">
                                    <input type="number" id="customProdQty" value="1" min="1" placeholder="Qty">
                                </div>
                                <button id="addCustomProductBtn" class="btn secondary w-100"><i class="fa-solid fa-plus-circle"></i> Add Custom Item</button>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Bill Preview -->
                    <div class="bill-preview-wrapper modern-card">
                        <div class="invoice-paper" id="invoicePaper">
                            <div class="invoice-header">
                                <div class="invoice-brand">
                                    <h2><i class="fa-solid fa-cube"></i> Jamboo Shop</h2>
                                    <p>123 Innovation Drive, Tech City, TX</p>
                                    <p>Phone: +1 800 123 4567 | GST: 22AAAAA0000A1Z5</p>
                                </div>
                                <div class="invoice-title">
                                    <h1>INVOICE</h1>
                                    <div class="invoice-meta">
                                        <span><strong>Date:</strong> <span id="previewDate"></span></span>
                                        <span><strong>Inv No:</strong> #DRAFT</span>
                                    </div>
                                </div>
                            </div>
                            <div class="invoice-customer-box">
                                <h4>Billed To:</h4>
                                <h3 id="previewCustName">Customer Name</h3>
                                <p id="previewCustPhone">+91-xxxxxxxxxx</p>
                            </div>
                            
                            <table class="invoice-table">
                                <thead>
                                    <tr>
                                        <th style="width: 50%;">Item Description</th>
                                        <th style="width: 15%; text-align: center;">Qty</th>
                                        <th style="width: 15%; text-align: right;">Rate</th>
                                        <th style="width: 20%; text-align: right;">Amount</th>
                                        <th class="noprint" style="width: 10%;"></th>
                                    </tr>
                                </thead>
                                <tbody id="billItemsBody">
                                    <tr class="empty-bill-row">
                                        <td colspan="5" style="text-align:center; color:#999; padding: 20px;">No items added yet.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="invoice-summary-box">
                                <div class="terms">
                                    <h4>Terms & Conditions</h4>
                                    <ol>
                                        <li>Goods once sold will not be taken back.</li>
                                        <li>Warranty varies by manufacturer.</li>
                                        <li>Subject to standard jurisdiction.</li>
                                    </ol>
                                </div>
                                <div class="totals-area">
                                    <div class="total-row">
                                        <span>Subtotal</span>
                                        <span id="previewSubtotal">₹0.00</span>
                                    </div>
                                    <div class="total-row highlight-total">
                                        <span>Grand Total</span>
                                        <span id="billTotalAmount">₹0.00</span>
                                    </div>
                                </div>
                            </div>
                            <div class="invoice-footer">
                                <p>Thank you for your business!</p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="bill-actions mt-3 w-100" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button id="saveBillBtn" class="btn success large-btn">
                                <i class="fa-solid fa-floppy-disk"></i> <span id="saveBtnText">Save Invoice</span>
                            </button>
                            <button id="printBillBtn" class="btn primary large-btn">
                                <i class="fa-solid fa-print"></i> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Saved Bills Page -->
            <section id="saved-bills-page" class="admin-section">
                <div class="section-header">
                    <h2><i class="fa-solid fa-folder-closed"></i> Saved Invoices</h2>
                    <p>View past generated bills and print them again.</p>
                </div>
                <div class="table-container modern-card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Inv ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Total Amount</th>
                                <th>Date generated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="adminEstimationsTableBody"></tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    
    <!-- Toast Notification -->
    <div id="toastNotification" class="toast">
        <i class="fa-solid fa-circle-check"></i>
        <span id="toastText">Action successful!</span>
    </div>

    <script src="/js/admin.js"></script>
</body>
</html>