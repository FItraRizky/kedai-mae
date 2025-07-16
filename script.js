// DARK MODE
(function() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;
  const moonIcon = themeToggleBtn.querySelector('.fa-moon');
  const sunIcon = themeToggleBtn.querySelector('.fa-sun');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  function updateThemeIcon() {
    if (document.body.classList.contains('dark-mode')) {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'inline';
    } else {
      if (moonIcon) moonIcon.style.display = 'inline';
      if (sunIcon) sunIcon.style.display = 'none';
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
  } else {
    setTheme(false);
  }
  themeToggleBtn.addEventListener('click', function() {
    setTheme(!document.body.classList.contains('dark-mode'));
  });
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
  script.onload = function() { if (window.AOS) AOS.init(); };
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
      const nameEl = document.getElementById('catering-name');
      const name = nameEl ? nameEl.value.trim() : '';
      if (!name) {
        const err = document.querySelector('#group-catering-name .form-error');
        if (err) err.textContent = 'Nama wajib diisi.';
        valid = false;
      }
      // Telepon
      const phoneEl = document.getElementById('catering-phone');
      const phone = phoneEl ? phoneEl.value.trim() : '';
      if (!/^0[0-9]{9,}$/.test(phone) && !/^62[0-9]{9,}$/.test(phone)) {
        const err = document.querySelector('#group-catering-phone .form-error');
        if (err) err.textContent = 'Nomor telepon tidak valid.';
        valid = false;
      }
      // Tanggal
      const dateEl = document.getElementById('catering-date');
      const date = dateEl ? dateEl.value : '';
      if (!date) {
        const err = document.querySelector('#group-catering-date .form-error');
        if (err) err.textContent = 'Tanggal wajib diisi.';
        valid = false;
      } else {
        const today = new Date();
        const inputDate = new Date(date);
        today.setHours(0,0,0,0);
        if (inputDate < today) {
          const err = document.querySelector('#group-catering-date .form-error');
          if (err) err.textContent = 'Tanggal tidak boleh lampau.';
          valid = false;
        }
      }
      // Menu
      const menuEl = document.getElementById('catering-menu');
      const menu = menuEl ? menuEl.value.trim() : '';
      if (!menu) {
        const err = document.querySelector('#group-catering-menu .form-error');
        if (err) err.textContent = 'Menu pilihan wajib diisi.';
        valid = false;
      }
      // Total porsi
      const totalEl = document.getElementById('catering-total');
      const total = totalEl ? parseInt(totalEl.value) : NaN;
      if (isNaN(total) || total < 10) {
        const err = document.querySelector('#group-catering-total .form-error');
        if (err) err.textContent = 'Minimal 10 porsi.';
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
    let total = totalInput ? parseInt(totalInput.value) : 0;
    if (total < 10) total = 0;
    // Bisa tambahkan parsing menuInput untuk deteksi jumlah porsi per menu
    let estimasi = total * AVG_PRICE;
    if (estimasiInput) {
      estimasiInput.value = estimasi > 0 ? estimasi.toLocaleString('id-ID', {style:'currency', currency:'IDR', minimumFractionDigits:0}) : '';
    }
  }
  if (totalInput && estimasiInput) {
    totalInput.addEventListener('input', updateEstimasiHarga);
    if (menuInput) menuInput.addEventListener('input', updateEstimasiHarga);
    if (cateringForm) cateringForm.addEventListener('reset', function() {
      setTimeout(() => { if (estimasiInput) estimasiInput.value = ''; }, 50);
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
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
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
    document.querySelectorAll('.menu-item').forEach(item => {
      const name = item.querySelector('h3') ? item.querySelector('h3').textContent.toLowerCase() : '';
      if (name.includes(keyword)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
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

// Tambahkan inisialisasi Firebase di awal file
const firebaseConfig = {
  apiKey: "AIzaSyBCpivifQQX0KSlVX-nKKDqrLDQRpBcHfY",
  authDomain: "kedai-mae.firebaseapp.com",
  databaseURL: "https://kedai-mae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kedai-mae",
  storageBucket: "kedai-mae.appspot.com",
  messagingSenderId: "293737028509",
  appId: "1:293737028509:web:bc7c55d5d62dce63496d74",
  measurementId: "G-WQXWBEKCV7"
};
if (!window.firebase?.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// RENDER MENU MAKANAN DARI LOCALSTORAGE ADMIN
function renderMenuKategori(kategoriId, kategoriNama, data) {
  const kategori = document.querySelector('.menu-category#' + kategoriId);
  if (!kategori) return;
  kategori.innerHTML = '';
  data.filter(item => item.kategori === kategoriNama).forEach((item) => {
    // Use a more consistent ID format
    const itemId = item.nama.toLowerCase().replace(/\s+/g, '-');
    const article = document.createElement('article');
    article.className = 'menu-item';
    article.setAttribute('data-id', itemId);
    article.innerHTML = `
      <figure class="item-img">
        <img src="https://source.unsplash.com/400x300/?food,${encodeURIComponent(item.nama)}" alt="${item.nama}" loading="lazy">
        <figcaption>${item.nama}</figcaption>
      </figure>
      <div class="item-details">
        <h3>${item.nama}</h3>
        <p>Stok: <span class="stok-badge">${item.stok}</span></p>
        <footer class="item-footer">
          <span class="price">Rp ${parseInt(item.harga).toLocaleString('id-ID')}</span>
          <button class="btn add-to-cart" data-id="${itemId}" ${item.stok < 1 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>${item.stok < 1 ? 'Habis' : 'Pesan'}</button>
        </footer>
      </div>
    `;
    kategori.appendChild(article);
  });
}
function renderAllMenuFromFirebase() {
  db.ref('stokMakanan').on('value', function(snap) {
    const data = snap.val() || [];
    renderMenuKategori('makanan', 'makanan', data);
    renderMenuKategori('minuman', 'minuman', data);
    renderMenuKategori('snack', 'snack', data);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  enableMenuTabs();
  enableMenuSearch();
  renderAllMenuFromFirebase();
}); 