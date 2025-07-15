// DARK MODE
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  function updateThemeIcon() {
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    if (document.body.classList.contains('dark-mode')) {
      if (moonIcon) moonIcon.style.opacity = '1';
      if (sunIcon) sunIcon.style.opacity = '0.5';
    } else {
      if (moonIcon) moonIcon.style.opacity = '0.5';
      if (sunIcon) sunIcon.style.opacity = '1';
    }
  }
  function setTheme(dark) {
    if (dark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
  }
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    setTheme(true);
    if (themeToggle) themeToggle.checked = true;
  } else {
    setTheme(false);
    if (themeToggle) themeToggle.checked = false;
  }
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      setTheme(this.checked);
    });
  }
  updateThemeIcon();
})();

// HAMBURGER MENU
(function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    // Tutup menu saat klik link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  }
})();

// INISIALISASI AOS
if (window.AOS) {
  AOS.init();
} else {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js';
  script.onload = function() { AOS.init(); };
  document.body.appendChild(script);
}

// VALIDASI FORM CATERING (pesan.html)
document.addEventListener('DOMContentLoaded', function() {
  const cateringForm = document.getElementById('catering-form');
  if (cateringForm) {
    cateringForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      // Reset error
      cateringForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      // Nama
      const name = document.getElementById('catering-name').value.trim();
      if (!name) {
        document.querySelector('#group-catering-name .form-error').textContent = 'Nama wajib diisi.';
        valid = false;
      }
      // Telepon
      const phone = document.getElementById('catering-phone').value.trim();
      if (!/^0[0-9]{9,}$/.test(phone) && !/^62[0-9]{9,}$/.test(phone)) {
        document.querySelector('#group-catering-phone .form-error').textContent = 'Nomor telepon tidak valid.';
        valid = false;
      }
      // Tanggal
      const date = document.getElementById('catering-date').value;
      if (!date) {
        document.querySelector('#group-catering-date .form-error').textContent = 'Tanggal wajib diisi.';
        valid = false;
      } else {
        const today = new Date();
        const inputDate = new Date(date);
        today.setHours(0,0,0,0);
        if (inputDate < today) {
          document.querySelector('#group-catering-date .form-error').textContent = 'Tanggal tidak boleh lampau.';
          valid = false;
        }
      }
      // Menu
      const menu = document.getElementById('catering-menu').value.trim();
      if (!menu) {
        document.querySelector('#group-catering-menu .form-error').textContent = 'Menu pilihan wajib diisi.';
        valid = false;
      }
      // Total porsi
      const total = parseInt(document.getElementById('catering-total').value);
      if (isNaN(total) || total < 10) {
        document.querySelector('#group-catering-total .form-error').textContent = 'Minimal 10 porsi.';
        valid = false;
      }
      if (!valid) return;
      // Kirim permintaan (bisa ke WhatsApp atau tampilkan notifikasi sukses)
      showToast('Permintaan catering berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
      cateringForm.reset();
    });
  }
  // ESTIMASI HARGA OTOMATIS FORM CATERING
  const estimasiInput = document.getElementById('catering-estimasi');
  const totalInput = document.getElementById('catering-total');
  const menuInput = document.getElementById('catering-menu');
  // Rata-rata harga per porsi (bisa disesuaikan)
  const AVG_PRICE = 20000;
  function updateEstimasiHarga() {
    let total = parseInt(totalInput?.value) || 0;
    if (total < 10) total = 0;
    // Bisa tambahkan parsing menuInput untuk deteksi jumlah porsi per menu
    let estimasi = total * AVG_PRICE;
    if (estimasiInput) {
      estimasiInput.value = estimasi > 0 ? estimasi.toLocaleString('id-ID', {style:'currency', currency:'IDR', minimumFractionDigits:0}) : '';
    }
  }
  if (totalInput && estimasiInput) {
    totalInput.addEventListener('input', updateEstimasiHarga);
    menuInput?.addEventListener('input', updateEstimasiHarga);
    cateringForm?.addEventListener('reset', function() {
      setTimeout(() => { estimasiInput.value = ''; }, 50);
    });
  }
});

// NOTIFIKASI TOAST
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast-notif ' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add('show'); }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { document.body.removeChild(toast); }, 300);
  }, 3500);
}

// ANIMASI MUNCUL GAMBAR ABOUT DAN MENU DENGAN DELAY
function revealOnScroll() {
  // About
  var aboutImg = document.querySelector('.about-img');
  var aboutText = document.querySelector('.about-text');
  if (aboutImg && isInViewport(aboutImg)) aboutImg.classList.add('visible');
  if (aboutText && isInViewport(aboutText)) aboutText.classList.add('visible');
  // Menu (staggered)
  var menuItems = Array.from(document.querySelectorAll('.menu-item'));
  var delay = 0;
  menuItems.forEach(function(item, i) {
    if (isInViewport(item) && !item.classList.contains('visible')) {
      item.style.animationDelay = (delay/1000) + 's';
      item.classList.add('visible');
      delay += 120;
    }
  });
}
function isInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight - 50 &&
    rect.bottom > 0
  );
}
// ANIMASI MUNCUL HUBUNGI KAMI DENGAN DELAY
function revealContactInfo() {
  var infoItems = Array.from(document.querySelectorAll('.info-item'));
  var delay = 0;
  infoItems.forEach(function(item, i) {
    if (isInViewport(item) && !item.classList.contains('visible')) {
      item.style.animationDelay = (delay/1000) + 's';
      item.classList.add('visible');
      delay += 120;
    }
  });
}
// SMOOTH SCROLL UNTUK ANCHOR LINK
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(revealOnScroll, 200);
  setTimeout(revealContactInfo, 200);
  enableSmoothScroll();
});
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('scroll', revealContactInfo);

// TAB MENU MAKANAN/MINUMAN/SNACK
function enableMenuTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-category');
      menuCategories.forEach(catDiv => {
        if (catDiv.id === cat) {
          catDiv.classList.add('active');
        } else {
          catDiv.classList.remove('active');
        }
      });
      // Reset animasi muncul menu-item
      document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('visible');
        item.style.animationDelay = '';
      });
      setTimeout(revealOnScroll, 100);
    });
  });
}
// FITUR PENCARIAN MENU
function enableMenuSearch() {
  const searchInput = document.getElementById('menu-search-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    document.querySelectorAll('.menu-category').forEach(catDiv => {
      let hasVisible = false;
      catDiv.querySelectorAll('.menu-item').forEach(item => {
        const name = item.querySelector('h3')?.textContent?.toLowerCase() || '';
        const desc = item.querySelector('p')?.textContent?.toLowerCase() || '';
        if (name.includes(keyword) || desc.includes(keyword)) {
          item.style.display = '';
          hasVisible = true;
        } else {
          item.style.display = 'none';
        }
      });
      // Sembunyikan kategori jika tidak ada item yang cocok
      if (catDiv.classList.contains('active')) {
        catDiv.style.display = hasVisible ? 'grid' : 'none';
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', function() {
  enableMenuTabs();
  enableMenuSearch();
});

// PARALLAX JS UNTUK SECTION CATERING (AGAR MUNCUL DI IOS/MOBILE)
function enableCateringParallax() {
  const cateringSection = document.querySelector('.section.catering');
  if (!cateringSection) return;
  // Deteksi iOS atau mobile
  const isMobile = window.innerWidth < 900 || /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isMobile) return;
  // Simulasi parallax: geser background-position saat scroll
  function parallaxScroll() {
    const rect = cateringSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = cateringSection.offsetTop;
    const y = Math.max(0, scrollTop + window.innerHeight - offset);
    // Atur background position Y (efek parallax)
    cateringSection.style.backgroundPosition = `center ${-y * 0.15}px`;
  }
  window.addEventListener('scroll', parallaxScroll);
  // Inisialisasi posisi awal
  parallaxScroll();
}
document.addEventListener('DOMContentLoaded', function() {
  enableCateringParallax();
}); 