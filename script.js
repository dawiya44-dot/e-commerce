let cart = [];
let orderHistory = [];

    function addToCart(id, name, price) {
         const existingItem = cart.find(item => item.id === id);
            
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1, checked: true });
        }
            
        updateCartCount();
        alert('Produk berhasil ditambahkan ke keranjang!');
    }

    function toggleCheck(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.checked = !item.checked;
        }
        renderCart();
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    function formatPrice(price) {
        return 'Rp' + price.toLocaleString('id-ID');
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    }

    function renderCart() {
        const cartItemsDiv = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');
            
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '';
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }
            
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
            
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item ${item.checked ? '' : 'unchecked'}">
                <div class="cart-item-left">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" class="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleCheck(${item.id})">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}</div>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            `).join('');
            
            const total = cart
                .filter(item => item.checked)
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('totalPrice').textContent = formatPrice(total);
        }

        function openCheckoutModal() {
            const checkedItems = cart.filter(item => item.checked);
            
            if (checkedItems.length === 0) {
                alert('Pilih minimal satu produk untuk checkout!');
                return;
            }
            
            const total = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('modalTotalPrice').textContent = formatPrice(total);
            document.getElementById('checkoutModal').classList.add('active');
        }

        function closeCheckoutModal() {
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('shippingAddress').value = '';
        }

        function confirmCheckout() {
            const address = document.getElementById('shippingAddress').value.trim();
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            if (!address) {
                alert('Mohon masukkan alamat pengiriman!');
                return;
            }
            
            const checkedItems = cart.filter(item => item.checked);
            const total = checkedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const order = {
                id: Date.now(),
                date: new Date(),
                items: checkedItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: total,
                address: address,
                paymentMethod: paymentMethod,
                status: 'diproses'
            };
            
            orderHistory.unshift(order);
            cart = cart.filter(item => !item.checked);
            
            updateCartCount();
            renderCart();
            closeCheckoutModal();
            
            alert('Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses.');
            showHistory();
        }

        function renderHistory() {
            const historyItemsDiv = document.getElementById('historyItems');
            const emptyHistory = document.getElementById('emptyHistory');
            
            if (orderHistory.length === 0) {
                historyItemsDiv.innerHTML = '';
                emptyHistory.style.display = 'block';
                return;
            }
            
            emptyHistory.style.display = 'none';
            
            historyItemsDiv.innerHTML = orderHistory.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-date">${formatDate(order.date)}</div>
                        <div class="order-status status-${order.status}">${order.status.toUpperCase()}</div>
                    </div>
                    ${order.items.map(item => `
                <div class="order-item">
            ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}
            </div>
            `).join('')}
            <div class="order-address">
                📍 ${order.address}
            </div>
            <div class="order-payment">
                💳 ${order.paymentMethod}
            </div>
            <div class="order-total">
                Total: ${formatPrice(order.total)}
            </div>
        </div>
    `).join('');
}

function showHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('historyPage').classList.remove('active');
    document.getElementById('homeBtn').classList.add('active');
    document.getElementById('cartBtn').classList.remove('active');
    document.getElementById('historyBtn').classList.remove('active');
}

function showCart() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('cartPage').classList.add('active');
    document.getElementById('historyPage').classList.remove('active');
    document.getElementById('homeBtn').classList.remove('active');
    document.getElementById('cartBtn').classList.add('active');
    document.getElementById('historyBtn').classList.remove('active');
    renderCart();
}

function showHistory() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('historyPage').classList.add('active');
    document.getElementById('homeBtn').classList.remove('active');
    document.getElementById('cartBtn').classList.remove('active');
    document.getElementById('historyBtn').classList.add('active');
    renderHistory();
}

// Fungsi Search Produk
function searchProducts() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Auto search saat mengetik
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', searchProducts);
    
    // Reset search saat input kosong
    searchInput.addEventListener('keyup', function() {
        if (this.value === '') {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });
});

// Data deskripsi produk (LENGKAP 18 PRODUK)
const productData = {
    1: {
        description: "Baju blus dengan desain modern dan elegan. Cocok untuk acara formal maupun kasual. Terbuat dari bahan berkualitas tinggi yang nyaman dipakai seharian.",
        specs: ["Bahan: Cotton Premium", "Ukuran: S, M, L, XL", "Warna: Biru", "Perawatan: Cuci dengan tangan"]
    },
    2: {
        description: "Jeans blue dengan model slim fit yang stylish. Terbuat dari denim berkualitas yang tahan lama dan nyaman dipakai.",
        specs: ["Bahan: Denim Premium", "Ukuran: 28-34", "Warna: Biru Muda", "Model: Slim Fit"]
    },
    3: {
        description: "Sepatu dengan motif bintang yang trendy. Cocok untuk gaya casual sehari-hari dengan desain yang eye-catching.",
        specs: ["Bahan: Canvas", "Ukuran: 36-44", "Sol: Karet Anti Slip", "Warna: Hitam dengan motif bintang"]
    },
    4: {
        description: "Bandana dengan berbagai pilihan warna. Aksesoris fashion yang praktis dan stylish untuk melengkapi penampilanmu.",
        specs: ["Bahan: Polyester", "Ukuran: One Size", "Tersedia berbagai warna", "Multifungsi"]
    },
    5: {
        description: "Anting diamond dengan desain mewah dan elegan. Cocok untuk acara spesial atau sebagai hadiah istimewa.",
        specs: ["Material: Sterling Silver", "Batu: Cubic Zirconia", "Desain: Drop Earrings", "Anti Alergi"]
    },
    6: {
        description: "Kacamata silver dengan frame yang ringan dan nyaman. Desain modern yang cocok untuk berbagai bentuk wajah.",
        specs: ["Frame: Metal Alloy", "Lensa: UV Protection", "Warna: Silver", "Unisex"]
    },
    7: {
        description: "Kemeja putih klasik yang wajib ada di lemari pakaianmu. Cocok untuk berbagai acara formal dan kasual.",
        specs: ["Bahan: Cotton", "Ukuran: S, M, L, XL", "Warna: Putih", "Model: Regular Fit"]
    },
    8: {
        description: "Kalung dengan desain unik dan menarik. Aksesoris yang sempurna untuk menambah kesan chic pada penampilanmu.",
        specs: ["Material: Stainless Steel", "Panjang: Adjustable", "Anti Karat", "Hypoallergenic"]
    },
    9: {
        description: "Topi casual yang nyaman dan stylish. Cocok untuk melindungi dari sinar matahari sambil tetap fashionable.",
        specs: ["Bahan: Cotton", "Ukuran: Adjustable", "Warna: Pink", "Model: Baseball Cap"]
    },
    10: {
        description: "Jeans hitam dengan model yang timeless. Mudah dipadukan dengan berbagai outfit untuk tampilan yang keren.",
        specs: ["Bahan: Denim Stretch", "Ukuran: 28-34", "Warna: Hitam", "Model: Regular Fit"]
    },
    11: {
        description: "Jaket hangat dengan desain sporty. Cocok untuk cuaca dingin atau aktivitas outdoor.",
        specs: ["Bahan: Fleece", "Ukuran: M, L, XL", "Warna: Maroon", "Dengan Hoodie"]
    },
    12: {
        description: "Gantungan kunci dengan desain unik. Aksesoris kecil yang praktis dan aesthetic untuk kunci atau tas.",
        specs: ["Material: Metal Alloy", "Ukuran: Compact", "Desain: Star Theme", "Tahan Lama"]
    },
    13: {
        description: "Cincin mewah dengan desain elegan dan eksklusif. Terbuat dari material premium untuk tampilan yang glamor.",
        specs: ["Material: 18K Gold Plated", "Batu: Zirconia", "Ukuran: Adjustable", "Hypoallergenic"]
    },
    14: {
        description: "Jepit rambut dengan desain cantik dan modern. Aksesoris yang praktis untuk menata rambut dengan gaya.",
        specs: ["Material: Alloy", "Ukuran: Medium", "Desain: Elegant", "Anti Slip"]
    },
    15: {
        description: "Crocs dengan desain nyaman dan casual. Sandal yang sempurna untuk aktivitas santai sehari-hari.",
        specs: ["Bahan: Croslite", "Ukuran: 36-44", "Warna: Beige", "Anti Slip & Waterproof"]
    },
    16: {
        description: "Anting silver dengan desain minimalis dan modern. Aksesoris yang cocok untuk dipakai sehari-hari.",
        specs: ["Material: 925 Sterling Silver", "Desain: Minimalist", "Anti Alergi", "Unisex"]
    },
    17: {
        description: "Tas dengan desain praktis dan stylish. Cocok untuk berbagai aktivitas dengan banyak ruang penyimpanan.",
        specs: ["Material: Canvas", "Ukuran: 30x25 cm", "Warna: Multi", "Tali Adjustable"]
    },
    18: {
        description: "Dasi dengan desain formal dan elegan. Aksesoris yang sempurna untuk tampilan profesional di kantor atau acara formal.",
        specs: ["Bahan: Polyester Silk", "Ukuran: Standard", "Warna: Navy", "Pre-tied"]
    }
};

// Fungsi untuk membuka detail produk
function openProductDetail(id, name, price, image) {
    const modal = document.getElementById('productDetailModal');
    const data = productData[id];
    
    if (!data) {
        alert('Data produk tidak ditemukan!');
        return;
    }
    
    document.getElementById('detailImage').src = image;
    document.getElementById('detailName').textContent = name;
    document.getElementById('detailPrice').textContent = formatPrice(price);
    document.getElementById('detailDescription').textContent = data.description;
    
    const specsList = document.getElementById('detailSpecs');
    specsList.innerHTML = data.specs.map(spec => `<li>${spec}</li>`).join('');
    
    const addBtn = document.getElementById('detailAddToCart');
    addBtn.onclick = function() {
        addToCart(id, name, price);
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup detail produk
function closeProductDetail() {
    const modal = document.getElementById('productDetailModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fungsi Search Produk
function searchProducts() {
    const searchValue = document.querySelector('.search-input').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        product.style.display = name.includes(searchValue) ? 'block' : 'none';
    });
}

// Aktifkan search saat mengetik
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }
});