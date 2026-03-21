<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Jamboo Shop - Premium Store</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/client.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="logo">
            <i class="fa-solid fa-cube"></i> Jamboo Shop
        </div>
        
        <ul class="nav-links" id="navLinks">
            <li><a href="#" data-target="home-page" class="nav-btn active"><i class="fa-solid fa-house"></i> Home</a></li>
            <li><a href="#" data-target="products-page" class="nav-btn"><i class="fa-solid fa-box-open"></i> Shop</a></li>
            <li><a href="#" data-target="about-page" class="nav-btn"><i class="fa-solid fa-circle-info"></i> About</a></li>
            <li><a href="#" data-target="contact-page" class="nav-btn"><i class="fa-solid fa-envelope"></i> Contact</a></li>
        </ul>
        <div class="cart-trigger" id="cartTrigger">
            <i class="fa-solid fa-cart-shopping"></i>
            <span id="cartCount" class="cart-count">0</span>
        </div>
        <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="fa-solid fa-bars"></i>
        </button>
    </nav>

    <!-- Main Content -->
    <main class="content-container">
        <!-- Home Page -->
        <section id="home-page" class="page-section active-section">
            <div class="hero">
                <div class="hero-content">
                    <span class="badge"><i class="fa-solid fa-bolt"></i> Future Tech</span>
                    <h1>Experience The Next <span>Generation</span> Of Gadgets</h1>
                    <p>Upgrade your lifestyle with our premium and high-performance collection of tech devices. Built for speed, precision, and elegance.</p>
                    <div class="hero-buttons">
                        <button class="primary-btn nav-redirect" data-target="products-page">Explore Now <i class="fa-solid fa-arrow-right"></i></button>
                        <button class="secondary-btn nav-redirect" data-target="about-page">Learn More</button>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="/images/hero.png" alt="Tech Gadgets Hero">
                    <div class="floating-badge badge-1"><i class="fa-solid fa-microchip"></i> Performance</div>
                    <div class="floating-badge badge-2"><i class="fa-solid fa-shield-halved"></i> Reliable</div>
                </div>
            </div>
            
            <!-- Features Section -->
            <div class="features-row">
                <div class="feature-card">
                    <i class="fa-solid fa-truck-fast"></i>
                    <h3>Fast Delivery</h3>
                    <p>Receive your products within 24 hours.</p>
                </div>
                <div class="feature-card">
                    <i class="fa-solid fa-headset"></i>
                    <h3>24/7 Support</h3>
                    <p>Our experts are ready to assist you anytime.</p>
                </div>
                <div class="feature-card">
                    <i class="fa-solid fa-rotate-left"></i>
                    <h3>Easy Returns</h3>
                    <p>30 days money back guarantee, no questions asked.</p>
                </div>
            </div>
        </section>

        <!-- Products Page -->
        <section id="products-page" class="page-section">
            <div class="section-header">
                <div class="header-text">
                    <h2>Our Catalog</h2>
                    <p>Discover top-tier tech designed for excellence.</p>
                </div>
                <div class="view-toggles">
                    <button class="view-btn active" id="gridViewBtn" title="Grid View"><i class="fa-solid fa-grip"></i></button>
                    <button class="view-btn" id="listViewBtn" title="List View"><i class="fa-solid fa-list"></i></button>
                </div>
            </div>
            <div class="search-bar-container">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="searchInput" placeholder="Search gadgets...">
            </div>
            <div id="productGrid" class="product-grid view-grid">
                <!-- Products dynamically loaded here via JS -->
            </div>
        </section>

        <!-- About Page -->
        <section id="about-page" class="page-section">
            <div class="split-layout">
                <div class="split-image">
                    <div class="abstract-shape">
                        <i class="fa-solid fa-rocket shape-icon"></i>
                    </div>
                </div>
                <div class="split-content">
                    <span class="badge">Who We Are</span>
                    <h2>Pioneering the Future of Tech Retail</h2>
                    <p>Jamboo Shop started with a simple vision: bringing cutting-edge technology directly to the modern consumer without the hassle. We source from top manufacturers globally to guarantee authentic, high-quality products.</p>
                    <ul class="about-list">
                        <li><i class="fa-solid fa-check-circle"></i> 100% Genuine and authenticated products.</li>
                        <li><i class="fa-solid fa-check-circle"></i> A tech community driven approach.</li>
                        <li><i class="fa-solid fa-check-circle"></i> Sustainable packaging and eco-friendly standards.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Contact Page -->
        <section id="contact-page" class="page-section">
            <div class="section-header center">
                <h2>Get In Touch</h2>
                <p>We'd love to hear from you. Drop us a message.</p>
            </div>
            <div class="contact-grid">
                <div class="contact-info">
                    <div class="info-card">
                        <i class="fa-solid fa-location-dot"></i>
                        <h4>Our Office</h4>
                        <p>123 Innovation Drive, Tech City, TX 75001</p>
                    </div>
                    <div class="info-card">
                        <i class="fa-solid fa-phone"></i>
                        <h4>Phone Number</h4>
                        <p>+1 (800) 123-4567</p>
                    </div>
                    <div class="info-card">
                        <i class="fa-solid fa-envelope"></i>
                        <h4>Email Address</h4>
                        <p>hello@technova.com</p>
                    </div>
                </div>
                <div class="contact-form-container">
                    <form id="contactForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea rows="4" placeholder="How can we help?" required></textarea>
                        </div>
                        <button type="submit" class="primary-btn w-100">Send Message <i class="fa-solid fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Cart Sidebar -->
    <div id="cartOverlay" class="cart-overlay hidden"></div>
    <div id="cartSidebar" class="cart-sidebar">
        <div class="cart-header">
            <h2><i class="fa-solid fa-bag-shopping"></i> Your Cart</h2>
            <button id="closeCart" class="close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <div id="emptyCartMsg" class="empty-cart hidden">
            <i class="fa-solid fa-cart-arrow-down"></i>
            <p>Your cart is currently empty.</p>
            <button class="secondary-btn go-shop-btn" id="goShopBtn">Go Shopping</button>
        </div>

        <div id="cartItems" class="cart-items">
            <!-- Cart items dynamically loaded here -->
        </div>

        <div class="cart-checkout" id="cartCheckout">
            <div class="cart-total">
                <span>Total:</span>
                <strong id="cartTotalPrice">₹0.00</strong>
            </div>
            <div class="checkout-footer">
                <div class="input-with-icon">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" id="customerName" placeholder="Your Name" required>
                </div>
                <div class="input-with-icon">
                    <i class="fa-solid fa-phone"></i>
                    <input type="text" id="customerPhone" placeholder="Phone Number" required>
                </div>
                <button id="submitOrderBtn" class="primary-btn w-100 checkout-btn">
                    Place Order <i class="fa-solid fa-arrow-right"></i>
                </button>
                <div id="orderMessage" class="order-message hidden"></div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toastNotification" class="toast">
        <i class="fa-solid fa-circle-check"></i>
        <span id="toastText">Item added to cart!</span>
    </div>

    <script src="/js/client.js"></script>
</body>
</html>