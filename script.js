Document.addEventListener('DOMContentLoaded', function() {
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

    // --- START: MODIFIED MOBILE MENU CODE (Hanya Bagian Ini yang Diubah) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    // **INITIATE ON LOAD:** Pastikan menu tersembunyi saat halaman pertama kali dimuat jika di mobile
    // Ini penting jika CSS Anda tidak secara default menyembunyikannya pada viewport mobile.
    // Asumsi: Menu seharusnya tersembunyi dengan 'right: -100%' atau 'transform: translateX(100%)'
    // Tambahkan style ini hanya jika menu seharusnya tidak terlihat saat awal load di mobile.
    // Jika CSS Anda sudah menanganinya, baris ini bisa diabaikan atau dihapus.
    if (window.innerWidth <= 768) {
        // Cek apakah menu tidak seharusnya aktif saat load
        if (!navLinks.classList.contains('active') && navLinks.style.right !== '-100%') {
             navLinks.style.right = '-100%'; // Sembunyikan menu secara eksplisit jika belum
        }
    }


    hamburger.addEventListener('click', function() {
        // Toggle 'active' class pada hamburger untuk transformasinya (misal jadi 'X')
        this.classList.toggle('active');
        // Tetap gunakan is-active jika CSS Anda memerlukannya. Saya kembalikan seperti kode Anda.
        this.classList.toggle('is-active'); 
        
        // Toggle 'active' class pada navLinks untuk mengontrol visibilitas/posisinya
        navLinks.classList.toggle('active');

        // Kontrol posisi menu secara eksplisit berdasarkan class 'active'
        if (navLinks.classList.contains('active')) {
            navLinks.style.right = '0'; // Tampilkan menu
            navItems.forEach((item, index) => {
                // Pastikan state awal untuk transisi
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                // Terapkan transisi dan state akhir
                item.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
                setTimeout(() => { // Sedikit delay agar transisi bisa diterapkan
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 10);
            });
        } else {
            navLinks.style.right = '-100%'; // Sembunyikan menu
            // Animasi item keluar sebelum container menu tertutup sepenuhnya
            navItems.forEach((item, index) => {
                // Ubah urutan delay agar animasi menutup lebih alami (dari bawah ke atas/kanan ke kiri)
                item.style.transition = `opacity 0.3s ease ${ (navItems.length - 1 - index) * 0.05}s, transform 0.3s ease ${ (navItems.length - 1 - index) * 0.05}s`;
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
            });
        }
    });

    // Close mobile menu when clicking a link with smooth transition
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { // Hanya berlaku untuk viewport mobile
                e.preventDefault(); // Cegah perilaku default link segera
                const target = link.getAttribute('href');

                // Animasi item menu keluar terlebih dahulu
                navItems.forEach((item, index) => {
                    item.style.transition = `opacity 0.3s ease ${ (navItems.length - 1 - index) * 0.05}s, transform 0.3s ease ${ (navItems.length - 1 - index) * 0.05}s`;
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(20px)';
                });

                // Setelah animasi item selesai, tutup container menu dan scroll
                setTimeout(() => {
                    navLinks.classList.remove('active'); // Hapus class active
                    navLinks.style.right = '-100%'; // Sembunyikan container menu secara eksplisit
                    hamburger.classList.remove('active'); // Reset ikon hamburger
                    hamburger.classList.remove('is-active'); // Pastikan 'is-active' juga dihapus

                    // Kemudian scroll ke target
                    if (target.startsWith('#')) {
                        const targetElement = document.querySelector(target);
                        if (targetElement) {
                            // Hitung offset berdasarkan tinggi header dinamis
                            const headerHeight = document.getElementById('header').offsetHeight;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = targetPosition - headerHeight;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        } else {
                            // Fallback jika target tidak ditemukan (jarang untuk hash links)
                            window.location.href = target;
                        }
                    } else {
                        // Untuk link eksternal atau full page link, langsung navigasi
                        window.location.href = target;
                    }
                }, 300); // Tunggu animasi item menu selesai (sesuaikan jika perlu)
            }
        });
    });
    // --- END: MODIFIED MOBILE MENU CODE ---

    // Enhanced Smooth Scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Hindari double handling jika sudah ditangani oleh mobile menu's click listener
            if (window.innerWidth > 768 || !this.closest('.nav-links')) {
                if (this.getAttribute('href') === '#') return;

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
            }
        });
    });

    // Menu Tab System with fade transition
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    category.classList.remove('active');
                }, 300);
            });

            this.classList.add('active');

            const categoryId = this.getAttribute('data-category');
            const activeCategory = document.getElementById(categoryId);

            setTimeout(() => {
                activeCategory.classList.add('active');
                setTimeout(() => {
                    activeCategory.style.opacity = '1';
                    activeCategory.style.transform = 'translateY(0)';
                }, 10);
            }, 300);
        });
    });

    // Enhanced Animation on Scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.menu-item, .info-item, .about-img, .about-text');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    const animatedElements = document.querySelectorAll('.menu-item, .info-item, .about-img, .about-text');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.9s ease ${index * 0.1}s, transform 0.9s ease ${index * 0.1}s`;
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Enhanced Dark Mode Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
        updateThemeIcon();
    }

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

    // Order Overlay Functionality
    document.querySelectorAll('.menu-item .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            if (this.classList.contains('add-to-cart')) {
                return;
            }

            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPriceText = menuItem.querySelector('.price').textContent;
            const itemPrice = parseInt(itemPriceText.replace(/\D/g, ''));
            const itemImage = menuItem.querySelector('.item-img img').src;

            const orderOverlay = document.createElement('div');
            orderOverlay.className = 'order-overlay active';
            orderOverlay.innerHTML = `
                <div class="order-form">
                    <span class="close-order">&times;</span>
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
            document.body.appendChild(orderOverlay);
            document.body.style.overflow = 'hidden';

            const orderQuantityInput = orderOverlay.querySelector('#order-quantity');
            const orderTotalDisplay = orderOverlay.querySelector('#order-total-display');

            const formatPrice = (price) => {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
            };

            const updateOrderTotal = () => {
                const quantity = parseInt(orderQuantityInput.value);
                const total = itemPrice * quantity;
                orderTotalDisplay.textContent = formatPrice(total);
            };

            orderQuantityInput.addEventListener('input', updateOrderTotal);

            const phone = '6287878177527';
            const waLink = `https://wa.me/${phone}`;

            orderOverlay.querySelector('.close-order').addEventListener('click', () => {
                document.body.removeChild(orderOverlay);
                document.body.style.overflow = 'auto';
            });

            orderOverlay.querySelector('.btn-cancel').addEventListener('click', () => {
                document.body.removeChild(orderOverlay);
                document.body.style.overflow = 'auto';
            });

            orderOverlay.querySelector('.btn-confirm').addEventListener('click', () => {
                const name = orderOverlay.querySelector('#order-name').value;
                const quantity = orderOverlay.querySelector('#order-quantity').value;
                const notes = orderOverlay.querySelector('#order-notes').value;

                if (!name) {
                    alert('Silakan masukkan nama Anda');
                    return;
                }

                if (!quantity || quantity < 1) {
                    alert('Jumlah pesanan tidak valid');
                    return;
                }

                const message = `Halo, saya ingin memesan:\nProduk: ${itemName}\nJumlah: ${quantity}\nTotal: ${orderTotalDisplay.textContent}\nNama: ${name}\nCatatan: ${notes || '-'}\n\nTerima kasih!`;

                const encodedMessage = encodeURIComponent(message);
                window.open(`${waLink}&text=${encodedMessage}`, '_blank');
                document.body.removeChild(orderOverlay);
                document.body.style.overflow = 'auto';
            });

            orderOverlay.addEventListener('click', (e) => {
                if (e.target === orderOverlay) {
                    document.body.removeChild(orderOverlay);
                    document.body.style.overflow = 'auto';
                }
            });
        });
    });
});
