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

    // Enhanced Mobile Menu with staggered animation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X
    if (this.classList.contains('active')) {
        navLinks.style.right = '0';
        navItems.forEach((item, index) => {
            item.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
    } else {
        navLinks.style.right = '-100%';
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
        });
    }
});

    // Close mobile menu when clicking a link with smooth transition
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const target = link.getAttribute('href');
                
                // Animate menu closing first
                navItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(20px)';
                });
                
                setTimeout(() => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.classList.remove('is-active');
                    
                    // Then scroll to target
                    if (target.startsWith('#')) {
                        const targetElement = document.querySelector(target);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    }
                }, 300);
            }
        });
    });

    // Enhanced Smooth Scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
        });
    });

    

    // Menu Tab System with fade transition
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and categories
            tabBtns.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    category.classList.remove('active');
                }, 300);
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding category with fade-in effect
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

    // Initialize animated elements with staggered delay
    const animatedElements = document.querySelectorAll('.menu-item, .info-item, .about-img, .about-text');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.9s ease ${index * 0.1}s, transform 0.9s ease ${index * 0.1}s`;
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

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
    
    // Listen for toggle changes with smooth transition
    themeToggle.addEventListener('change', function() {
        document.body.style.transition = 'background-color 0.9s ease, color 0.9s ease';
        
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        updateThemeIcon();
        
        // Reset transition after mode change
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
    
    // Update icon based on theme with animation
    function updateThemeIcon() {
        const moonIcon = document.querySelector('.fa-moon');
        const sunIcon = document.querySelector('.fa-sun');
        
        if (document.body.classList.contains('dark-mode')) {
            moonIcon.style.transition = 'opacity 0.6s ease';
            sunIcon.style.transition = 'opacity 0.6s ease';
            moonIcon.style.opacity = '0.5';
            sunIcon.style.opacity = '1';
        } else {
            moonIcon.style.transition = 'opacity 06s ease';
            sunIcon.style.transition = 'opacity 0.6s ease';
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0.5';
        }
    }
    
    // Initial icon update
    updateThemeIcon();

    // Enhanced Ordering System with Form
    document.querySelectorAll('.btn[href^="https://wa.me/6287878177527"]').forEach(orderBtn => {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const waLink = this.getAttribute('href');
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;
            
            // Create order form overlay
            const orderOverlay = document.createElement('div');
            orderOverlay.className = 'order-overlay';
            orderOverlay.innerHTML = `
                <div class="order-form">
                    <div class="order-header">
                        <h3>Pesan ${itemName}</h3>
                        <span class="close-order">&times;</span>
                    </div>
                    <div class="order-body">
                        <div class="form-group">
                            <label for="order-name">Nama Anda</label>
                            <input type="text" id="order-name" placeholder="Masukkan nama Anda" required>
                        </div>
                        <div class="form-group">
                            <label for="order-quantity">Jumlah Pesanan</label>
                            <input type="number" id="order-quantity" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label for="order-notes">Catatan Tambahan</label>
                            <textarea id="order-notes" placeholder="Contoh: Pedas, Tidak pakai bawang, dll"></textarea>
                        </div>
                        <div class="order-summary">
                            <p>Total: <span id="order-total">${itemPrice}</span></p>
                        </div>
                    </div>
                    <div class="order-footer">
                        <button class="btn btn-cancel">Batal</button>
                        <button class="btn btn-confirm">Konfirmasi Pesanan</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(orderOverlay);
            
            // Calculate total price when quantity changes
            const quantityInput = orderOverlay.querySelector('#order-quantity');
            const totalDisplay = orderOverlay.querySelector('#order-total');
            
            quantityInput.addEventListener('change', function() {
                const price = parseInt(itemPrice.replace(/\D/g, ''));
                const total = price * this.value;
                totalDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;
            });
            
            // Close overlay
            orderOverlay.querySelector('.close-order').addEventListener('click', () => {
                document.body.removeChild(orderOverlay);
            });
            
            orderOverlay.querySelector('.btn-cancel').addEventListener('click', () => {
                document.body.removeChild(orderOverlay);
            });
            
            // Confirm order
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
                
                const message = `Halo, saya ingin memesan:
Produk: ${itemName}
Jumlah: ${quantity}
Total: ${totalDisplay.textContent}
Nama: ${name}
Catatan: ${notes || '-'}

Terima kasih!`;
                
                const encodedMessage = encodeURIComponent(message);
                window.open(`${waLink}&text=${encodedMessage}`, '_blank');
                document.body.removeChild(orderOverlay);
            });
            
            // Close when clicking outside
            orderOverlay.addEventListener('click', (e) => {
                if (e.target === orderOverlay) {
                    document.body.removeChild(orderOverlay);
                }
            });
        });
    });
});
