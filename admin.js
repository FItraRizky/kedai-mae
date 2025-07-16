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
    document.getElementById('edit-index').value = idx;
    document.getElementById('nama-makanan').value = item.nama;
    document.getElementById('harga-makanan').value = item.harga;
    document.getElementById('stok-makanan').value = item.stok;
    document.getElementById('kategori-makanan').value = item.kategori || '';
  });
}
window.hapusStok = function(idx) {
  getStok(function(data) {
    if (!confirm('Yakin hapus data ini?')) return;
    data.splice(idx, 1);
    setStok(data).then(() => renderTabel());
  });
}
document.getElementById('form-stok').onsubmit = function(e) {
  e.preventDefault();
  const nama = document.getElementById('nama-makanan').value.trim();
  const harga = parseInt(document.getElementById('harga-makanan').value);
  const stok = parseInt(document.getElementById('stok-makanan').value);
  const kategori = document.getElementById('kategori-makanan').value;
  if (!nama || isNaN(harga) || isNaN(stok) || harga < 0 || stok < 0 || !kategori) {
    alert('Data tidak valid!');
    return;
  }
  getStok(function(data) {
    const idx = document.getElementById('edit-index').value;
    if (idx === '') {
      data.push({ nama, harga, stok, kategori });
    } else {
      data[idx] = { nama, harga, stok, kategori };
    }
    setStok(data).then(() => {
      renderTabel();
      document.getElementById('form-stok').reset();
      document.getElementById('edit-index').value = '';
      document.getElementById('kategori-makanan').value = '';
    });
  });
};
// Realtime update tabel admin jika ada perubahan dari device lain
db.ref('stokMakanan').on('value', function() {
  renderTabel();
  renderMenuPreview();
});
renderTabel();
renderMenuPreview();
  
  
 