document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic (SPA)
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.page-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-section');

            // Load products if products page is active
            if(targetId === 'products-page' && !productsLoaded) {
                fetchProducts();
            }
        });
    });

    // 2. Product Loading
    let productsLoaded = false;
    let products = [];
    
    function fetchProducts() {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                products = data;
                renderProducts();
                productsLoaded = true;
            })
            .catch(err => console.error('Error fetching products:', err));
    }

    function renderProducts() {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            grid.appendChild(card);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
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
    }

    function updateCartUI() {
        document.getElementById('cartCount').innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartItemsDiv = document.getElementById('cartItems');
        cartItemsDiv.innerHTML = '';

        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    ₹${item.price} x ${item.quantity}
                </div>
                <button onclick="removeFromCart(${index})" class="close-btn">X</button>
            `;
            cartItemsDiv.appendChild(div);
        });
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    // Cart Sidebar Toggle
    const cartSidebar = document.getElementById('cartSidebar');
    document.getElementById('cartTrigger').addEventListener('click', () => {
        cartSidebar.classList.remove('hidden');
        cartSidebar.classList.add('open');
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        setTimeout(() => cartSidebar.classList.add('hidden'), 300);
    });

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
            if(data.message === 'Order submitted successfully!') {
                showMessage(data.message, 'success');
                cart = [];
                updateCartUI();
                document.getElementById('customerName').value = '';
                document.getElementById('customerPhone').value = '';
            } else {
                showMessage('Error submitting order.', 'error');
            }
        })
        .catch(err => {
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
});