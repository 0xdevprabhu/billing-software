document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic (SPA)
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.page-section');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const navRedirects = document.querySelectorAll('.nav-redirect');

    function navigateTo(targetId) {
        // Remove active class from all
        navButtons.forEach(b => {
             b.classList.remove('active');
             if(b.getAttribute('data-target') === targetId) {
                 b.classList.add('active');
             }
        });
        sections.forEach(s => s.classList.remove('active-section'));

        // Add active class to clicked
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            targetSection.classList.add('active-section');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Load products if products page is active
        if(targetId === 'products-page' && !productsLoaded) {
            fetchProducts();
        }

        // close mobile menu if opened
        navLinksContainer.classList.remove('show');
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(btn.getAttribute('data-target'));
        });
    });

    navRedirects.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(btn.getAttribute('data-target'));
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
    });

    // 2. Product Loading and View Toggles
    let productsLoaded = false;
    let products = [];
    let isGridView = true;

    function fetchProducts() {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                products = data;
                renderProducts(products);
                productsLoaded = true;
            })
            .catch(err => console.error('Error fetching products:', err));
    }

    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');

    gridViewBtn.addEventListener('click', () => {
        isGridView = true;
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        productGrid.classList.remove('view-list');
        productGrid.classList.add('view-grid');
    });

    listViewBtn.addEventListener('click', () => {
        isGridView = false;
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        productGrid.classList.remove('view-grid');
        productGrid.classList.add('view-list');
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)));
        renderProducts(filtered);
    });

    function renderProducts(items) {
        productGrid.innerHTML = '';
        if(items.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No products found.</p>';
            return;
        }

        // Define some random nice icons for tech products
        const icons = [
            'fa-laptop', 'fa-headphones', 'fa-mobile-screen', 'fa-keyboard', 'fa-computer-mouse',
            'fa-desktop', 'fa-tablet-screen-button', 'fa-hard-drive', 'fa-plug', 'fa-speaker-deck',
            'fa-camera', 'fa-gamepad', 'fa-house-signal', 'fa-lightbulb', 'fa-chair',
            'fa-microphone', 'fa-video'
        ];

        items.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Random icon based on product id
            const iconClass = icons[(product.id || index) % icons.length];

            card.innerHTML = `
                <div class="product-icon"><i class="fa-solid ${iconClass}"></i></div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-desc">${product.description || 'Premium tech product'}</p>
                    <div class="product-footer">
                        <div class="product-price">₹${parseFloat(product.price).toFixed(2)}</div>
                        <button class="primary-btn add-to-cart-btn" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnEle = e.target.closest('.add-to-cart-btn');
                const productId = parseInt(btnEle.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    // 3. Cart Logic
    let cart = [];

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if(!product) return;

        const existingItem = cart.find(item => item.product_id === productId);
        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        updateCartUI();
        showToast(`${product.name} added to cart`);
    }

    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cartCount').innerText = totalItems;
        
        const cartItemsDiv = document.getElementById('cartItems');
        const emptyCartMsg = document.getElementById('emptyCartMsg');
        const cartCheckout = document.getElementById('cartCheckout');
        
        cartItemsDiv.innerHTML = '';
        
        if(cart.length === 0) {
            emptyCartMsg.classList.remove('hidden');
            cartCheckout.classList.add('hidden');
        } else {
            emptyCartMsg.classList.add('hidden');
            cartCheckout.classList.remove('hidden');
            
            let totalAmount = 0;

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-icon">
                        <i class="fa-solid fa-box"></i>
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${parseFloat(item.price).toFixed(2)} / each</div>
                        <div class="quantity-controls" style="margin-top:0.5rem; display:inline-flex;">
                            <button class="qty-btn minus-qty" data-index="${index}">-</button>
                            <span class="item-qty">${item.quantity}</span>
                            <button class="qty-btn plus-qty" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div style="text-align: right; display:flex; flex-direction:column; align-items:flex-end;">
                        <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                        <div class="cart-item-total">₹${itemTotal.toFixed(2)}</div>
                    </div>
                `;
                cartItemsDiv.appendChild(div);
            });

            document.getElementById('cartTotalPrice').innerText = `₹${totalAmount.toFixed(2)}`;

            // Attach qty events
            document.querySelectorAll('.minus-qty').forEach(btn => {
                btn.addEventListener('click', (e) => updateQty(e.target.dataset.index, -1));
            });
            document.querySelectorAll('.plus-qty').forEach(btn => {
                btn.addEventListener('click', (e) => updateQty(e.target.dataset.index, 1));
            });
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const btnEle = e.target.closest('.remove-item');
                    removeFromCart(btnEle.dataset.index);
                });
            });
        }
    }

    function updateQty(index, change) {
        if(cart[index]) {
            cart[index].quantity += change;
            if(cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    // Cart Sidebar Toggle
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    function toggleCart(open) {
        if(open) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.remove('hidden');
            cartOverlay.style.opacity = '1';
        } else {
            cartSidebar.classList.remove('open');
            cartOverlay.style.opacity = '0';
            setTimeout(() => cartOverlay.classList.add('hidden'), 300);
        }
    }

    document.getElementById('cartTrigger').addEventListener('click', () => toggleCart(true));
    document.getElementById('closeCart').addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
    
    const goShopBtn = document.getElementById('goShopBtn');
    if(goShopBtn) {
        goShopBtn.addEventListener('click', () => {
            toggleCart(false);
            navigateTo('products-page');
        });
    }

    // 4. Submit Order
    document.getElementById('submitOrderBtn').addEventListener('click', () => {
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const msgDiv = document.getElementById('orderMessage');

        if(!name || !phone) {
            showMessage('Name and Phone are required.', 'error');
            return;
        }

        if(cart.length === 0) {
            showMessage('Cart is empty.', 'error');
            return;
        }

        const payload = {
            customer_name: name,
            customer_phone: phone,
            cart: cart
        };

        const submitBtn = document.getElementById('submitOrderBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            if(data.message === 'Order submitted successfully!') {
                showMessage(data.message, 'success');
                cart = [];
                updateCartUI();
                document.getElementById('customerName').value = '';
                document.getElementById('customerPhone').value = '';
                setTimeout(() => toggleCart(false), 2000);
            } else {
                showMessage('Error submitting order.', 'error');
            }
        })
        .catch(err => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showMessage('Error submitting order.', 'error');
        });
    });

    function showMessage(text, type) {
        const msgDiv = document.getElementById('orderMessage');
        msgDiv.innerText = text;
        msgDiv.className = `order-message ${type}`;
        msgDiv.classList.remove('hidden');
        setTimeout(() => {
            msgDiv.classList.add('hidden');
        }, 3000);
    }

    // Toast notification
    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        document.getElementById('toastText').innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});