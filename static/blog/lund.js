// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== DOM Loaded ===");
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    loadCartFromStorage();
    
    // Initialize functions
    initializeSearch();
    initializeViewToggle();
    initializeFavorites();
    initializePaymentForm();
    initializeModalTabs();
    
    updateCartBadge();
});

// =========================================
// CART FUNCTIONALITY
// =========================================
let cart = [];

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    updateCartBadge();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const badges = document.querySelectorAll('.cart-badge, #cart-badge-header');
    
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// Helper: Format Currency
function formatCurrency(amount) {
    return 'IDR ' + parseInt(amount).toLocaleString('id-ID');
}

// =========================================
// CORE: ADD TO CART (DINAMIS)
// =========================================
function addToCart(productObj) {
    console.log(`[ADD TO CART]`, productObj);
    
    const existingItem = cart.find(item => item.productId == productObj.productId);
    
    if (existingItem) {
        existingItem.quantity += productObj.quantity;
    } else {
        cart.push({
            id: Date.now(), // Unique ID untuk item di cart
            productId: productObj.productId,
            name: productObj.name,
            price: parseInt(productObj.price),
            image: productObj.image, // Ini akan menyimpan URL Cloudinary
            quantity: productObj.quantity
        });
    }
    
    saveCartToStorage();
    updateCartBadge();
}

// =========================================
// MODAL PRODUCT (LOGIKA BARU)
// =========================================

// Fungsi ini sekarang menerima ELEMENT HTML (this), bukan cuma ID
function openProductModal(element) {
    // 1. Ambil data DARI DATABASE via Attribute HTML
    const ds = element.dataset;
    
    // Data produk live dari database
    const product = {
        id: ds.productId,
        name: ds.name,
        price: ds.price,
        image: ds.image,
        description: ds.description
    };

    console.log('[MODAL] Opening for:', product);

    // 2. Isi Modal dengan Data Tersebut
    const modalImg = document.getElementById('modalImage');
    modalImg.src = product.image;
    modalImg.alt = product.name;
    // Error handling jika gambar rusak
    modalImg.onerror = function() { this.src = 'https://via.placeholder.com/300x300?text=No+Image'; };

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCurrentPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalDescription').textContent = product.description;
    
    // Sembunyikan elemen yang tidak dipakai (stok/original price sementara)
    document.getElementById('modalOriginalPrice').style.display = 'none';
    document.getElementById('modalStock').style.display = 'none';

    // Reset input quantity
    document.getElementById('quantityInput').value = 1;

    // Simpan data produk sementara di Modal untuk tombol "Add to Cart"
    const modal = document.getElementById('productModal');
    modal.dataset.currentId = product.id;
    modal.dataset.currentName = product.name;
    modal.dataset.currentPrice = product.price;
    modal.dataset.currentImage = product.image;

    // Tampilkan Modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    feather.replace();
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// =========================================
// MODAL ACTIONS (ADD/BUY)
// =========================================

function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartFromModal() {
    const modal = document.getElementById('productModal');
    const qtyInput = document.getElementById('quantityInput');
    
    // Ambil data yang tadi kita tempel di modal
    const productObj = {
        productId: modal.dataset.currentId,
        name: modal.dataset.currentName,
        price: modal.dataset.currentPrice,
        image: modal.dataset.currentImage, // URL Cloudinary
        quantity: parseInt(qtyInput.value)
    };

    addToCart(productObj);
    
    showNotification(`${productObj.quantity}x ${productObj.name} ditambahkan!`);
    closeModal();
}

function buyNowFromModal() {
    addToCartFromModal();
    setTimeout(() => {
        window.location.href = '/cart/'; // Redirect ke halaman cart
    }, 500);
}

// =========================================
// UTILITIES & UI
// =========================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        background: #10b981; color: white;
        padding: 14px 24px; border-radius: 12px;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        z-index: 10000; transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(product => {
            const name = product.dataset.name.toLowerCase();
            product.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    if (!viewBtns.length) return;

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const isGrid = this.querySelector('[data-feather="grid"]');
            const grid = document.querySelector('.products-grid');
            if (grid) {
                if (isGrid) {
                    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
                } else {
                    grid.style.gridTemplateColumns = '1fr';
                }
            }
        });
    });
}

function initializeFavorites() {
    // Logic favorite sederhana (visual only)
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('favorited');
            this.style.color = this.classList.contains('favorited') ? '#ef4444' : '#64748b';
        });
    });
}

function toggleFavoriteModal() {
    const btn = document.querySelector('.favorite-modal-btn');
    if(btn) {
        btn.classList.toggle('favorited');
        const isFav = btn.classList.contains('favorited');
        showNotification(isFav ? 'Ditambahkan ke Wishlist' : 'Dihapus dari Wishlist');
    }
}

function initializeModalTabs() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const buttons = modal.querySelectorAll('.modal-tab-btn');
    const contents = modal.querySelectorAll('.modal-tab-content');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            modal.querySelector(`#tab-${tabId}`).classList.add('active');
        });
    });
}

// Payment Form Logic (Jika di halaman Payment)
function initializePaymentForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        // Pastikan cart tidak kosong
        if (cart.length === 0) {
            e.preventDefault();
            alert('Keranjang kosong!');
            window.location.href = '/products/';
            return;
        }

        // Masukkan data cart ke input hidden agar terkirim ke Django
        let cartInput = this.querySelector('input[name="cart_data"]');
        if (!cartInput) {
            cartInput = document.createElement('input');
            cartInput.type = 'hidden';
            cartInput.name = 'cart_data';
            this.appendChild(cartInput);
        }

        // Format data agar sesuai dengan views.py
        const cartDataForBackend = {};
        cart.forEach(item => {
            cartDataForBackend[item.productId] = {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            };
        });

        cartInput.value = JSON.stringify(cartDataForBackend);
    });
}