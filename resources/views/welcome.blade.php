<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Billing Software - Client</title>
    <link rel="stylesheet" href="/css/client.css">
</head>
<body>
    <nav class="navbar">
        <div class="logo">AppLogo</div>
        <ul class="nav-links">
            <li><a href="#" data-target="home-page" class="nav-btn active">Home</a></li>
            <li><a href="#" data-target="about-page" class="nav-btn">About</a></li>
            <li><a href="#" data-target="products-page" class="nav-btn">Products</a></li>
            <li><a href="#" data-target="contact-page" class="nav-btn">Contact</a></li>
        </ul>
        <div class="cart-trigger" id="cartTrigger">Cart (<span id="cartCount">0</span>)</div>
    </nav>

    <main class="content-container">
        <section id="home-page" class="page-section active-section">
            <h1>Welcome to our Store</h1>
            <p>Select products from the catalog to place your order.</p>
        </section>

        <section id="about-page" class="page-section">
            <h1>About Us</h1>
            <p>We provide high quality products.</p>
        </section>

        <section id="products-page" class="page-section">
            <h1>Our Products</h1>
            <div id="productGrid" class="product-grid"></div>
        </section>

        <section id="contact-page" class="page-section">
            <h1>Contact Us</h1>
            <p>Reach out at support@example.com</p>
        </section>
    </main>

    <div id="cartSidebar" class="cart-sidebar hidden">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button id="closeCart" class="close-btn">X</button>
        </div>
        <div id="cartItems" class="cart-items"></div>
        <div class="cart-footer">
            <input type="text" id="customerName" placeholder="Enter Name" required>
            <input type="text" id="customerPhone" placeholder="Enter Phone Number" required>
            <button id="submitOrderBtn" class="primary-btn">Send Order</button>
            <div id="orderMessage" class="order-message hidden"></div>
        </div>
    </div>

    <script src="/js/client.js"></script>
</body>
</html>