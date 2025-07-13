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
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    generateWhatsAppMessage() {
        let message = "Halo Kedai Mae, saya ingin memesan:\n\n";
        
        this.items.forEach(item => {
            message += `➤ ${item.name}\n`;
            message += `   Jumlah: ${item.quantity}\n`;
            message += `   Harga: ${this.formatPrice(item.price)} (Total: ${this.formatPrice(item.price * item.quantity)})\n\n`;
        });
        
        message += `*Total Pesanan:* ${this.formatPrice(this.getTotal())}\n\n`;
        message += "Terima kasih!";
        
        return encodeURIComponent(message);
    }
}

// Inisialisasi keranjang
const cart = new Cart();

// Event listeners untuk keranjang
document.addEventListener('DOMContentLoaded', function() {
    // Toggle keranjang
    document.querySelector('.cart-icon').addEventListener('click', () => {
        document.querySelector('.cart-overlay').classList.add('active');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        document.querySelector('.cart-overlay').classList.remove('active');
    });

    document.querySelector('.cart-overlay').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.cart-overlay')) {
            document.querySelector('.cart-overlay').classList.remove('active');
        }
    });

    // Delegasi event untuk keranjang
    document.addEventListener('input', (e) => {
        if (e.target.matches('.cart-item-actions input[type="number"]')) {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value) || 1;
            cart.updateQuantity(id, quantity);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const id = e.target.closest('.remove-item').dataset.id;
            cart.removeItem(id);
        }
    });

    // Checkout
    document.querySelector('.btn-checkout').addEventListener('click', () => {
        if (cart.items.length > 0) {
            const phone = '6287878177527';
            const message = cart.generateWhatsAppMessage();
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            cart.clearCart();
        }
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