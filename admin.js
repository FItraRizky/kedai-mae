// Konfigurasi Firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Inisialisasi Firebase Auth (pakai config yang sama)
const auth = firebase.auth();

// Login
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.onclick = function() {
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');
    const email = emailEl ? emailEl.value : '';
    const pass = passEl ? passEl.value : '';
    auth.signInWithEmailAndPassword(email, pass)
      .catch(err => {
        if (errorEl) errorEl.textContent = err.message;
      });
  };
}
// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.onclick = function() {
    auth.signOut();
  };
}
// Tampilkan/hidden form sesuai status login
auth.onAuthStateChanged(function(user) {
  const isLoggedIn = !!user;
  const loginSection = document.getElementById('login-section');
  const logoutBtn = document.getElementById('logout-btn');
  const adminForm = document.querySelector('.admin-form');
  const tabelStok = document.getElementById('tabel-stok');
  const tabelMenuPreview = document.getElementById('tabel-menu-preview');
  if (loginSection) loginSection.style.display = isLoggedIn ? 'none' : '';
  if (logoutBtn) logoutBtn.style.display = isLoggedIn ? '' : 'none';
  if (adminForm) adminForm.style.display = isLoggedIn ? '' : 'none';
  if (tabelStok) tabelStok.style.display = isLoggedIn ? '' : 'none';
  if (tabelMenuPreview && tabelMenuPreview.parentElement) tabelMenuPreview.parentElement.style.display = isLoggedIn ? '' : 'none';
});

// CRUD dan realtime
function getStok(callback) {
  db.ref('stokMakanan').once('value', snap => {
    callback(snap.val() || []);
  });
}
function setStok(data) {
  return db.ref('stokMakanan').set(data);
}
function renderTabel() {
  getStok(function(data) {
    const tbody = document.querySelector('#tabel-stok tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nama}</td>
        <td>Rp ${parseInt(item.harga).toLocaleString('id-ID')}</td>
        <td>${item.stok}</td>
        <td>${item.kategori ? item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1) : '-'}</td>
        <td>
          <button class="btn-edit" onclick="editStok(${i})">Edit</button>
          <button class="btn-delete" onclick="hapusStok(${i})">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });
}
function renderMenuPreview() {
  getStok(function(data) {
    const tbody = document.querySelector('#tabel-menu-preview tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nama}</td>
        <td>Rp ${parseInt(item.harga).toLocaleString('id-ID')}</td>
        <td>${item.stok}</td>
        <td>${item.kategori ? item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1) : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}
window.editStok = function(idx) {
  getStok(function(data) {
    const item = data[idx];
    const idxEl = document.getElementById('edit-index');
    const namaEl = document.getElementById('nama-makanan');
    const hargaEl = document.getElementById('harga-makanan');
    const stokEl = document.getElementById('stok-makanan');
    const kategoriEl = document.getElementById('kategori-makanan');
    if (idxEl) idxEl.value = idx;
    if (namaEl) namaEl.value = item.nama;
    if (hargaEl) hargaEl.value = item.harga;
    if (stokEl) stokEl.value = item.stok;
    if (kategoriEl) kategoriEl.value = item.kategori || '';
  });
}
window.hapusStok = function(idx) {
  getStok(function(data) {
    if (!confirm('Yakin hapus data ini?')) return;
    data.splice(idx, 1);
    setStok(data).then(() => renderTabel());
  });
}
const formStok = document.getElementById('form-stok');
if (formStok) {
  formStok.onsubmit = function(e) {
    e.preventDefault();
    const namaEl = document.getElementById('nama-makanan');
    const hargaEl = document.getElementById('harga-makanan');
    const stokEl = document.getElementById('stok-makanan');
    const kategoriEl = document.getElementById('kategori-makanan');
    const idxEl = document.getElementById('edit-index');
    const nama = namaEl ? namaEl.value.trim() : '';
    const harga = hargaEl ? parseInt(hargaEl.value) : NaN;
    const stok = stokEl ? parseInt(stokEl.value) : NaN;
    const kategori = kategoriEl ? kategoriEl.value : '';
    if (!nama || isNaN(harga) || isNaN(stok) || harga < 0 || stok < 0 || !kategori) {
      alert('Data tidak valid!');
      return;
    }
    getStok(function(data) {
      const idx = idxEl ? idxEl.value : '';
      if (idx === '') {
        data.push({ nama, harga, stok, kategori });
      } else {
        data[idx] = { nama, harga, stok, kategori };
      }
      setStok(data).then(() => {
        renderTabel();
        if (formStok) formStok.reset();
        if (idxEl) idxEl.value = '';
        if (kategoriEl) kategoriEl.value = '';
      });
    });
  };
}
// Realtime update tabel admin jika ada perubahan dari device lain
db.ref('stokMakanan').on('value', function() {
  renderTabel();
  renderMenuPreview();
});
renderTabel();
renderMenuPreview();
  
  
 