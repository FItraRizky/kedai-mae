document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Sticky Header with smoother transition
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll <= 0) {
            header.classList.remove('header-scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.classList.add('header-scrolled');
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.classList.add('header-scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    
    // Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', function() {
    // Toggle class active
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle body overflow
    document.body.style.overflow = this.classList.contains('active') ? 'hidden' : 'auto';
    
    // Animate nav items
    navItems.forEach((item, index) => {
        if (this.classList.contains('active')) {
            item.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
        }
    });
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Animate out
            navItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            });
            
            // Close menu after animation
            setTimeout(() => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Navigate to target
                if (target.startsWith('#')) {
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    window.location.href = target;
                }
            }, 300);
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        navItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
        });
    }
});
  

    // Enhanced Smooth Scrolling with offset (untuk tautan di luar menu hamburger)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Hindari konflik dengan penanganan tautan di menu hamburger jika sudah ditangani di sana
            if (window.innerWidth <= 768 && this.closest('.nav-links')) {
                return; // Biarkan event listener di atas yang menanganinya
            }
            
            if (this.getAttribute('href') === '#') return; // Jangan gulir jika href hanya '#'
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Menu Tab System with fade transition
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Set active category on load
    if (tabBtns.length > 0 && menuCategories.length > 0) {
        tabBtns[0].classList.add('active');
        menuCategories[0].classList.add('active');
        menuCategories[0].style.opacity = '1';
        menuCategories[0].style.transform = 'translateY(0)';
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and categories
            tabBtns.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => {
                // Dimulai dengan transisi keluar
                category.style.opacity = '0';
                category.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    category.classList.remove('active');
                }, 300); // Sesuai dengan durasi transisi
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding category with fade-in effect
            const categoryId = this.getAttribute('data-category');
            const activeCategory = document.getElementById(categoryId);
            
            setTimeout(() => {
                activeCategory.classList.add('active');
                // Beri sedikit jeda untuk memastikan kelas 'active' sudah diterapkan sebelum memulai fade-in
                setTimeout(() => {
                    activeCategory.style.opacity = '1';
                    activeCategory.style.transform = 'translateY(0)';
                }, 10);
            }, 300); // Sesuaikan dengan durasi transisi keluar sebelumnya
        });
    });

    // Enhanced Animation on Scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.menu-item, .info-item, .about-img, .about-text');
        elements.forEach(element => {
            // Hanya animasi jika elemen belum terlihat atau dianimasikan
            if (element.style.opacity === '1') return;

            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3; // Muncul ketika 1/3 layar dari bawah

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animated elements with staggered delay
    const animatedElements = document.querySelectorAll('.menu-item, .info-item, .about-img, .about-text');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.9s ease ${index * 0.1}s, transform 0.9s ease ${index * 0.1}s`;
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load to animate elements already in view

    // Enhanced Dark Mode Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved user preference or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        updateThemeIcon();
    }

    // Listen for toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const moonIcon = document.querySelector('.fa-moon');
        const sunIcon = document.querySelector('.fa-sun');
        if (document.body.classList.contains('dark-mode')) {
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0.5';
        } else {
            moonIcon.style.opacity = '0.5';
            sunIcon.style.opacity = '1';
        }
    }

    function createOrderOverlay({ itemName, itemPrice, itemPriceText, itemImage }) {
        const overlay = document.createElement('div');
        overlay.className = 'order-overlay active';
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
                    <input type="text" id="order-name" placeholder="Masukkan nama Anda">
                </div>
                <div class="order-summary">
                    <p>Total: <span id="order-total-display">${itemPriceText}</span></p>
                </div>
                <div class="order-footer">
                    <button class="btn btn-cancel">Batal</button>
                    <button class="btn btn-confirm">Konfirmasi Pesanan</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.order-form').focus();
        return overlay;
    }

    function closeOrderOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
            document.body.style.overflow = 'auto';
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
        const formatPrice = price => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

        orderQuantityInput.addEventListener('input', () => {
            const quantity = parseInt(orderQuantityInput.value) || 1;
            orderTotalDisplay.textContent = formatPrice(itemPrice * quantity);
        });

        const closeHandler = () => closeOrderOverlay(overlay);
        overlay.querySelector('.close-order').addEventListener('click', closeHandler);
        overlay.querySelector('.btn-cancel').addEventListener('click', closeHandler);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeHandler();
        });

        // Setelah overlay dibuat (dalam createOrderOverlay atau handleOrderButtonClick)
        const paymentMethodSelect = overlay.querySelector('#order-payment-method');
        const paymentInstructions = overlay.querySelector('.payment-instructions');
        const buktiBayarGroup = overlay.querySelector('#bukti-bayar-group');

        function showPaymentInstructions(method) {
            paymentInstructions.style.display = 'block';
            // Field bukti hanya untuk metode non-WA
            buktiBayarGroup.style.display = (method === 'wa') ? 'none' : 'block';
            ['qris','transfer','ovo','gopay','dana','wa'].forEach(m => {
                const el = overlay.querySelector(`#payment-${m}`);
                if (el) el.style.display = (m === method) ? 'block' : 'none';
            });
        }
        paymentMethodSelect.addEventListener('change', function() {
            showPaymentInstructions(this.value);
        });
        // Tampilkan default QRIS saat overlay muncul
        showPaymentInstructions(paymentMethodSelect.value);

        // Pada konfirmasi pesanan:
        overlay.querySelector('.btn-confirm').addEventListener('click', () => {
            const name = overlay.querySelector('#order-name').value.trim();
            const quantity = overlay.querySelector('#order-quantity').value;
            const notes = overlay.querySelector('#order-notes').value.trim();
            const spicy = overlay.querySelector('#order-spicy').value;

            if (!name) {
                alert('Silakan masukkan nama Anda');
                return;
            }
            if (!quantity || quantity < 1) {
                alert('Jumlah pesanan tidak valid');
                return;
            }

            const paymentMethod = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
            let buktiText = '';
            const buktiFile = overlay.querySelector('#order-bukti').files[0];
            if (paymentMethodSelect.value !== 'wa' && buktiFile) {
                buktiText = `\nBukti pembayaran terlampir (lihat gambar).`;
            }
            const message = `Halo, saya ingin memesan:\nProduk: ${itemName}\nJumlah: ${quantity}\nTingkat Pedas: ${spicy}\nTotal: ${orderTotalDisplay.textContent}\nNama: ${name}\nMetode Pembayaran: ${paymentMethod}${buktiText}\nCatatan: ${notes || '-'}\n\nTerima kasih!`;
            const encodedMessage = encodeURIComponent(message);
            const phone = '6287878177527';
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
            closeOrderOverlay(overlay);
        });
    }

    // Attach event listeners
    document.querySelectorAll('.menu-item .btn').forEach(button => {
        button.addEventListener('click', handleOrderButtonClick);
    });
});