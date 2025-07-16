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
        const cartFooterEl = document.querySelector('.cart-footer');

        // Update count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;

        // Update items list
        if (cartItemsEl) cartItemsEl.innerHTML = '';
        
        if (this.items.length === 0) {
            if (cartEmptyEl) cartEmptyEl.style.display = 'flex';
            if (cartFooterEl) cartFooterEl.style.display = 'none';
            if (cartItemsEl) cartItemsEl.style.display = 'none';
        } else {
            if (cartEmptyEl) cartEmptyEl.style.display = 'none';
            if (cartFooterEl) cartFooterEl.style.display = 'flex';
            if (cartItemsEl) cartItemsEl.style.display = 'block';
            
            this.items.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${this.formatPrice(item.price)}  ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                if (cartItemsEl) cartItemsEl.appendChild(cartItemEl);
            });

            // Update total
            if (totalPriceEl) totalPriceEl.textContent = this.formatPrice(this.getTotal());
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    }

    generateWhatsAppMessage() {
        let message = "Halo Kedai Mae, saya ingin memesan:\n\n";
        this.items.forEach(item => {
            message += `  ${item.name}\n`;
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
    if (orderForm) orderForm.focus();
    const nameInput = overlay.querySelector('#order-name');
    if (nameInput) nameInput.focus();
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
    if (!menuItem) return;
    const itemNameEl = menuItem.querySelector('h3');
    const itemPriceTextEl = menuItem.querySelector('.price');
    const itemImageEl = menuItem.querySelector('.item-img img');
    if (!itemNameEl || !itemPriceTextEl || !itemImageEl) return;
    const itemName = itemNameEl.textContent;
    const itemPriceText = itemPriceTextEl.textContent;
    const itemPrice = parseInt(itemPriceText.replace(/\D/g, ''));
    const itemImage = itemImageEl.src;

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
    if (orderQuantityInput && orderTotalDisplay) {
      orderQuantityInput.addEventListener('input', () => {
        const quantity = parseInt(orderQuantityInput.value) || 1;
        orderTotalDisplay.textContent = formatPrice(itemPrice * quantity);
      });
    }

    // Close overlay handler
    const closeHandler = () => {
        closeOrderOverlay(overlay, this);
        removeTrap();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeHandler);
    if (cancelBtn) cancelBtn.addEventListener('click', closeHandler);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeHandler();
    });

    // Close on Escape key
    overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeHandler();
    });

    // Confirm order
    if (confirmBtn) confirmBtn.addEventListener('click', () => {
        const name = nameInput ? nameInput.value.trim() : '';
        const quantity = orderQuantityInput ? orderQuantityInput.value : 1;
        const notes = notesInput ? notesInput.value.trim() : '';

        if (!name) {
            if (typeof showToast === 'function') {
                showToast('Silakan masukkan nama Anda', 'error');
            } else {
                alert('Silakan masukkan nama Anda');
            }
            return;
        }
        if (isNaN(quantity) || quantity < 1) {
            if (typeof showToast === 'function') {
                showToast('Jumlah pesanan tidak valid', 'error');
            } else {
                alert('Jumlah pesanan tidak valid');
            }
            return;
        }
        // Lanjutkan proses order...
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
                    <option value="midtrans">Midtrans (Otomatis)</option>
                    <option value="xendit">Xendit (Otomatis)</option>
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
                <div id="cart-payment-midtrans" style="display:none">
                    <p>Anda akan diarahkan ke halaman pembayaran Midtrans (simulasi/sandbox).</p>
                </div>
                <div id="cart-payment-xendit" style="display:none">
                    <p>Anda akan diarahkan ke halaman pembayaran Xendit (simulasi/sandbox).</p>
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
    if (orderForm) orderForm.focus();
    const nameInput = overlay.querySelector('#cart-order-name');
    if (nameInput) nameInput.focus();

    // Payment method logic
    const paymentMethodSelect = overlay.querySelector('#cart-order-payment-method');
    const paymentInstructions = overlay.querySelector('.payment-instructions');
    const buktiBayarGroup = overlay.querySelector('#cart-bukti-bayar-group');
    function showPaymentInstructions(method) {
        if (paymentInstructions) paymentInstructions.style.display = 'block';
        if (buktiBayarGroup) buktiBayarGroup.style.display = (method === 'wa' || method === 'midtrans' || method === 'xendit') ? 'none' : 'block';
        ['qris','transfer','ovo','gopay','dana','wa','midtrans','xendit'].forEach(m => {
            const el = overlay.querySelector(`#cart-payment-${m}`);
            if (el) el.style.display = (m === method) ? 'block' : 'none';
        });
    }
    if (paymentMethodSelect) paymentMethodSelect.addEventListener('change', function() {
        showPaymentInstructions(this.value);
    });
    showPaymentInstructions(paymentMethodSelect ? paymentMethodSelect.value : 'qris'); // Default to qris if select is not found

    // Close logic
    const closeHandler = () => {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = 'auto';
    };
    if (overlay) overlay.querySelector('.close-order')?.addEventListener('click', closeHandler);
    if (overlay) overlay.querySelector('.btn-cancel')?.addEventListener('click', closeHandler);
    if (overlay) overlay.addEventListener('click', e => {
        if (e.target === overlay) closeHandler();
    });
    if (overlay) overlay.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeHandler();
    });

    // Confirm order logic
    if (overlay) overlay.querySelector('.btn-confirm')?.addEventListener('click', () => {
        const name = nameInput ? nameInput.value.trim() : '';
        const paymentMethod = paymentMethodSelect ? paymentMethodSelect.value : 'qris'; // Default to qris if select is not found
        let buktiText = '';
        const buktiFile = overlay.querySelector('#cart-order-bukti');
        if (!name) {
            if (typeof showToast === 'function') {
                showToast('Silakan masukkan nama Anda', 'error');
            } else {
                alert('Silakan masukkan nama Anda');
            }
            if (nameInput) nameInput.focus();
            return;
        }
        if (['midtrans','xendit'].includes(paymentMethod)) {
            closeHandler();
            setTimeout(() => {
                if (typeof showToast === 'function') showToast('Anda akan diarahkan ke halaman pembayaran otomatis.', 'info');
                // Simulasi redirect ke sandbox
                if (paymentMethod === 'midtrans') {
                    window.open('https://simulator.sandbox.midtrans.com/', '_blank');
                } else {
                    window.open('https://checkout-staging.xendit.co/demo/', '_blank');
                }
            }, 500);
            // Kurangi stok dan clear cart
            const stok = getStokData();
            cart.items.forEach(item => {
                if (stok[item.id] !== undefined) {
                    stok[item.id] = Math.max(0, stok[item.id] - item.quantity);
                }
            });
            setStokData(stok);
            cart.clearCart();
            updateStokBadge();
            if (onSuccess) onSuccess();
            return;
        }
        if (paymentMethod !== 'wa' && buktiFile && buktiFile.files.length > 0) {
            buktiText = `\nBukti pembayaran terlampir (lihat gambar).`;
        }
        const message = `Halo Kedai Mae, saya ingin memesan:\n\n${cart.items.map(item => `  ${item.name}\n Jumlah: ${item.quantity}\n Harga: ${cart.formatPrice(item.price)}\n Subtotal: ${cart.formatPrice(item.price * item.quantity)}\n`).join('\n')}Total Pesanan: ${cart.formatPrice(cart.getTotal())}\nNama: ${name}\nMetode Pembayaran: ${paymentMethod}${buktiText}\n\nTerima kasih!`;
        const encodedMessage = encodeURIComponent(message);
        const phone = '6287878177527';
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        closeHandler();
        const stok = getStokData();
        cart.items.forEach(item => {
            if (stok[item.id] !== undefined) {
                stok[item.id] = Math.max(0, stok[item.id] - item.quantity);
            }
        });
        setStokData(stok);
        cart.clearCart();
        updateStokBadge();
        if (onSuccess) onSuccess();
        if (typeof showToast === 'function') {
            showToast('Pesanan berhasil dikirim! Silakan cek WhatsApp Anda untuk konfirmasi.', 'success');
        }
    });
}

// SISTEM STOK MENU
const DEFAULT_STOK = {
  'nasi-goreng-special': 10,
  'mie-ayam-jamur': 8,
  'sate-ayam-madura': 5,
  'es-teh-manis': 20,
  'jus-alpukat': 7,
  'kentang-goreng': 12,
  'roti-bakar-coklat': 6
};
menuItemsParent.addEventListener('click', function(e) {
    const btn = e.target.closest('.menu-item .btn');
    if (btn && btn.classList.contains('add-to-cart')) {
      const menuItem = btn.closest('.menu-item');
      const itemId = menuItem.dataset.id;
      const itemName = menuItem.querySelector('h3').textContent;
      const itemPrice = parseInt(menuItem.querySelector('.price').textContent.replace(/\D/g, ''));
      
      cart.addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: 1
      });
      
      if (typeof showToast === 'function') {
        showToast(`${itemName} ditambahkan ke keranjang`, 'success');
      }
      return;
    }
    if (btn) handleOrderButtonClick.call(btn, e);
  });
document.addEventListener('DOMContentLoaded', updateStokBadge);

// Attach event listeners (use event delegation if menu items adalah dinamis)
menuItemsParent.addEventListener('click', function(e) {
    const btn = e.target.closest('.menu-item .btn');
    if (btn && btn.classList.contains('add-to-cart')) {
      const menuItem = btn.closest('.menu-item');
      const itemId = menuItem.dataset.id;
      const itemName = menuItem.querySelector('h3').textContent;
      const itemPrice = parseInt(menuItem.querySelector('.price').textContent.replace(/\D/g, ''));
      
      cart.addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: 1
      });
      
      if (typeof showToast === 'function') {
        showToast(`${itemName} ditambahkan ke keranjang`, 'success');
      }
      return;
    }
    if (btn) handleOrderButtonClick.call(btn, e);
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
            if (typeof showToast === 'function') {
                showToast('Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.', 'error');
            } else {
                alert('Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
            }
            return;
        }
        showCartPaymentModal(cart, () => {
            // Kurangi stok
            const stok = getStokData();
            cart.items.forEach(item => {
                if (stok[item.id] !== undefined) {
                    stok[item.id] = Math.max(0, stok[item.id] - item.quantity);
                }
            });
            setStokData(stok);
            cart.clearCart();
            updateStokBadge();
            if (typeof showToast === 'function') {
                showToast('Pesanan berhasil dikirim! Silakan cek WhatsApp Anda untuk konfirmasi.', 'success');
            }
        });
    });

    // Tambahkan item ke keranjang
    // HAPUS: document.querySelectorAll('.add-to-cart').forEach(btn => { ... });
});

// Integrasi ulang translate jika cart.js di-load setelah translate.js
if (window.applyTranslation) {
  document.addEventListener('DOMContentLoaded', function() {
    const lang = localStorage.getItem('lang') || 'id';
    window.applyTranslation(lang);
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
      langSwitcher.value = lang;
      langSwitcher.addEventListener('change', function() {
        window.applyTranslation(this.value);
      });
    }
  });
}