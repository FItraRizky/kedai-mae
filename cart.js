// Sistem Keranjang Belanja
class Cart {
    constructor() {
        this.items = [];
        this.loadCart();
        this.updateCartUI();
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push({...item});
        }
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(i => i.id === id);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartUI();
        } else if (quantity <= 0) {
            this.removeItem(id);
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('kedaiMaeCart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('kedaiMaeCart');
        this.items = savedCart ? JSON.parse(savedCart) : [];
    }

    updateCartUI() {
        const cartItemsEl = document.querySelector('.cart-items');
        const cartEmptyEl = document.querySelector('.cart-empty');
        const cartCountEl = document.querySelector('.cart-count');
        const totalPriceEl = document.querySelector('.total-price');

        // Update count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;

        // Update items list
        cartItemsEl.innerHTML = '';
        
        if (this.items.length === 0) {
            cartEmptyEl.style.display = 'flex';
            document.querySelector('.cart-footer').style.display = 'none';
            cartItemsEl.style.display = 'none';
        } else {
            cartEmptyEl.style.display = 'none';
            document.querySelector('.cart-footer').style.display = 'flex';
            cartItemsEl.style.display = 'block';
            
            this.items.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${this.formatPrice(item.price)} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsEl.appendChild(cartItemEl);
            });

            // Update total
            totalPriceEl.textContent = this.formatPrice(this.getTotal());
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    }

    generateWhatsAppMessage() {
        let message = "Halo Kedai Mae, saya ingin memesan:\n\n";
        this.items.forEach(item => {
            message += `➤ ${item.name}\n`;
            message += ` Jumlah: ${item.quantity}\n`;
            message += ` Harga: ${this.formatPrice(item.price)}\n`;
            message += ` Subtotal: ${this.formatPrice(item.price * item.quantity)}\n\n`;
        });
        message += `Total Pesanan: ${this.formatPrice(this.getTotal())}\n\n`;
        message += "Terima kasih!";
        return message;
    }
}

// Utility: Format price as IDR
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

// Utility: Trap focus inside a modal
function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleTab(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
}

function createOrderOverlay({ itemName, itemPrice, itemPriceText, itemImage }) {
    const overlay = document.createElement('div');
    overlay.className = 'order-overlay active';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <div class="order-form" tabindex="-1">
            <span class="close-order" aria-label="Tutup">&times;</span>
            <h2>Detail Pesanan</h2>
            <div class="order-product-info">
                <img id="order-product-img" src="${itemImage}" alt="${itemName}">
                <h3 id="order-product-name">${itemName}</h3>
                <p id="order-product-price">${itemPriceText}</p>
            </div>
            <div class="form-group">
                <label for="order-quantity">Jumlah:</label>
                <input type="number" id="order-quantity" value="1" min="1">
            </div>
            <div class="form-group">
                <label for="order-notes">Catatan (opsional):</label>
                <textarea id="order-notes" rows="3" placeholder="Contoh: tidak pedas, tanpa es, dll."></textarea>
            </div>
            <div class="form-group">
                <label for="order-name">Nama Anda:</label>
                <input type="text" id="order-name" placeholder="Masukkan nama Anda" autocomplete="name">
            </div>
            <div class="order-summary">
                <p>Total: <span id="order-total-display">${itemPriceText}</span></p>
            </div>
            <div class="order-footer">
                <button class="btn btn-cancel" type="button">Batal</button>
                <button class="btn btn-confirm" type="button">Konfirmasi Pesanan</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const orderForm = overlay.querySelector('.order-form');
    orderForm.focus();
    overlay.querySelector('#order-name').focus();
    return overlay;
}

function closeOrderOverlay(overlay, restoreFocusTo) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = 'auto';
        if (restoreFocusTo) restoreFocusTo.focus();
    }
}

function handleOrderButtonClick(e) {
    e.preventDefault();
    if (this.classList.contains('add-to-cart')) return;

    const menuItem = this.closest('.menu-item');
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPriceText = menuItem.querySelector('.price').textContent;
    const itemPrice = parseInt(itemPriceText.replace(/\D/g, ''));
    const itemImage = menuItem.querySelector('.item-img img').src;

    const overlay = createOrderOverlay({ itemName, itemPrice, itemPriceText, itemImage });
    const orderQuantityInput = overlay.querySelector('#order-quantity');
    const orderTotalDisplay = overlay.querySelector('#order-total-display');
    const closeBtn = overlay.querySelector('.close-order');
    const cancelBtn = overlay.querySelector('.btn-cancel');
    const confirmBtn = overlay.querySelector('.btn-confirm');
    const nameInput = overlay.querySelector('#order-name');
    const notesInput = overlay.querySelector('#order-notes');
    let removeTrap = trapFocus(overlay);

    // Update total on quantity change
    orderQuantityInput.addEventListener('input', () => {
        const quantity = parseInt(orderQuantityInput.value) || 1;
        orderTotalDisplay.textContent = formatPrice(itemPrice * quantity);
    });

    // Close overlay handler
    const closeHandler = () => {
        closeOrderOverlay(overlay, this);
        removeTrap();
    };

    closeBtn.addEventListener('click', closeHandler);
    cancelBtn.addEventListener('click', closeHandler);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeHandler();
    });

    // Close on Escape key
    overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeHandler();
    });

    // Confirm order
    confirmBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const quantity = orderQuantityInput.value;
        const notes = notesInput.value.trim();

        if (!name) {
            alert('Silakan masukkan nama Anda');
            nameInput.focus();
            return;
        }
        if (!quantity || quantity < 1) {
            alert('Jumlah pesanan tidak valid');
            orderQuantityInput.focus();
            return;
        }

        const message = `Halo, saya ingin memesan:\nProduk: ${itemName}\nJumlah: ${quantity}\nTotal: ${orderTotalDisplay.textContent}\nNama: ${name}\nCatatan: ${notes || '-'}\n\nTerima kasih!`;
        const encodedMessage = encodeURIComponent(message);
        const phone = '6287878177527';
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        closeHandler();
    });
}

// Attach event listeners (use event delegation if menu items are dynamic)
document.querySelectorAll('.menu-item .btn').forEach(button => {
    button.addEventListener('click', handleOrderButtonClick);
});

document.addEventListener('DOMContentLoaded', function() {
    const cart = new Cart();

    // Open Cart
    document.querySelector('.cart-icon').addEventListener('click', () => {
        document.querySelector('.cart-overlay').classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close Cart
    document.querySelector('.close-cart').addEventListener('click', () => {
        document.querySelector('.cart-overlay').classList.remove('active');
        document.body.style.overflow = 'auto'; // Allow scrolling
    });

    // Close cart when clicking outside
    document.querySelector('.cart-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-overlay')) {
            document.querySelector('.cart-overlay').classList.remove('active');
            document.body.style.overflow = 'auto'; // Allow scrolling
        }
    });

    // Update quantity
    document.querySelector('.cart-items').addEventListener('change', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value);
            cart.updateQuantity(id, quantity);
        }
    });

    // Remove item
    document.querySelector('.cart-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const id = e.target.dataset.id || e.target.closest('.remove-item').dataset.id;
            cart.removeItem(id);
        }
    });

    // Handle checkout button (Lanjut ke WhatsApp)
    document.querySelector('.btn-checkout').addEventListener('click', function() {
        if (cart.items.length === 0) {
            alert('Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
            return;
        }

        const phone = '6287878177527'; // Ganti dengan nomor WhatsApp Anda
        const message = cart.generateWhatsAppMessage();
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        cart.clearCart();
    });

    // Tambahkan item ke keranjang
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.dataset.id;
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = parseInt(menuItem.querySelector('.price').textContent.replace(/\D/g, ''));
            
            cart.addItem({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            });

            // Tampilkan notifikasi
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<i class="fas fa-check"></i> ${itemName} ditambahkan ke keranjang`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });
});