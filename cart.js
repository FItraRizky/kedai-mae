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

// Tambahkan modal pembayaran pada checkout keranjang
function showCartPaymentModal(cart, onSuccess) {
    const overlay = document.createElement('div');
    overlay.className = 'order-overlay active';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <div class="order-form" tabindex="-1">
            <span class="close-order" aria-label="Tutup">&times;</span>
            <h2>Pembayaran & Konfirmasi</h2>
            <div class="form-group">
                <label for="cart-order-name">Nama Anda:</label>
                <input type="text" id="cart-order-name" placeholder="Masukkan nama Anda" autocomplete="name">
            </div>
            <div class="form-group">
                <label for="cart-order-payment-method">Metode Pembayaran:</label>
                <select id="cart-order-payment-method">
                    <option value="qris">QRIS (All Bank/OVO/Gopay/Dana)</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="ovo">OVO</option>
                    <option value="gopay">Gopay</option>
                    <option value="dana">Dana</option>
                    <option value="wa">Bayar via WhatsApp (COD/Manual)</option>
                </select>
            </div>
            <div class="form-group payment-instructions" style="display:none">
                <div id="cart-payment-qris" style="display:none">
                    <p>Scan QRIS berikut untuk pembayaran:</p>
                    <img src="qris-sample.png" alt="QRIS" style="max-width:200px;display:block;margin:10px auto;">
                    <p>Atas Nama: Kedai Mae</p>
                </div>
                <div id="cart-payment-transfer" style="display:none">
                    <p>Transfer ke rekening berikut:</p>
                    <ul>
                        <li>BCA: 1234567890 a.n. Kedai Mae</li>
                        <li>Mandiri: 9876543210 a.n. Kedai Mae</li>
                    </ul>
                </div>
                <div id="cart-payment-ovo" style="display:none">
                    <p>Kirim ke OVO: 0812-3456-7890 a.n. Kedai Mae</p>
                </div>
                <div id="cart-payment-gopay" style="display:none">
                    <p>Kirim ke Gopay: 0812-3456-7890 a.n. Kedai Mae</p>
                </div>
                <div id="cart-payment-dana" style="display:none">
                    <p>Kirim ke Dana: 0812-3456-7890 a.n. Kedai Mae</p>
                </div>
                <div id="cart-payment-wa" style="display:none">
                    <p>Silakan lanjutkan pembayaran atau konfirmasi langsung melalui WhatsApp admin. Klik Konfirmasi Pesanan untuk chat otomatis.</p>
                </div>
            </div>
            <div class="form-group" id="cart-bukti-bayar-group" style="display:none">
                <label for="cart-order-bukti">Upload Bukti Pembayaran:</label>
                <input type="file" id="cart-order-bukti" accept="image/*">
            </div>
            <div class="order-summary">
                <p>Total: <span id="cart-order-total-display">${cart.formatPrice(cart.getTotal())}</span></p>
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
    overlay.querySelector('#cart-order-name').focus();

    // Payment method logic
    const paymentMethodSelect = overlay.querySelector('#cart-order-payment-method');
    const paymentInstructions = overlay.querySelector('.payment-instructions');
    const buktiBayarGroup = overlay.querySelector('#cart-bukti-bayar-group');
    function showPaymentInstructions(method) {
        paymentInstructions.style.display = 'block';
        buktiBayarGroup.style.display = (method === 'wa') ? 'none' : 'block';
        ['qris','transfer','ovo','gopay','dana','wa'].forEach(m => {
            const el = overlay.querySelector(`#cart-payment-${m}`);
            if (el) el.style.display = (m === method) ? 'block' : 'none';
        });
    }
    paymentMethodSelect.addEventListener('change', function() {
        showPaymentInstructions(this.value);
    });
    showPaymentInstructions(paymentMethodSelect.value);

    // Close logic
    const closeHandler = () => {
        overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = 'auto';
    };
    overlay.querySelector('.close-order').addEventListener('click', closeHandler);
    overlay.querySelector('.btn-cancel').addEventListener('click', closeHandler);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeHandler();
    });
    overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeHandler();
    });

    // Confirm order logic
    overlay.querySelector('.btn-confirm').addEventListener('click', () => {
        const name = overlay.querySelector('#cart-order-name').value.trim();
        const paymentMethod = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
        let buktiText = '';
        const buktiFile = overlay.querySelector('#cart-order-bukti').files[0];
        if (!name) {
            alert('Silakan masukkan nama Anda');
            overlay.querySelector('#cart-order-name').focus();
            return;
        }
        if (paymentMethodSelect.value !== 'wa' && buktiFile) {
            buktiText = `\nBukti pembayaran terlampir (lihat gambar).`;
        }
        const message = `Halo Kedai Mae, saya ingin memesan:\n\n${cart.items.map(item => `➤ ${item.name}\n Jumlah: ${item.quantity}\n Harga: ${cart.formatPrice(item.price)}\n Subtotal: ${cart.formatPrice(item.price * item.quantity)}\n`).join('\n')}Total Pesanan: ${cart.formatPrice(cart.getTotal())}\nNama: ${name}\nMetode Pembayaran: ${paymentMethod}${buktiText}\n\nTerima kasih!`;
        const encodedMessage = encodeURIComponent(message);
        const phone = '6287878177527';
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        closeHandler();
        if (onSuccess) onSuccess();
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
        showCartPaymentModal(cart, () => cart.clearCart());
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