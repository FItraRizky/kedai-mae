// Data stok makanan di localStorage
function getStok() {
  let data = JSON.parse(localStorage.getItem('stokMakanan') || '[]');
  if (!data || !Array.isArray(data) || data.length === 0) {
    data = [
      // Makanan
      { nama: 'Nasi Goreng Special', harga: 25000, stok: 20, kategori: 'makanan' },
      { nama: 'Mie Ayam Jamur', harga: 20000, stok: 15, kategori: 'makanan' },
      { nama: 'Sate Ayam Madura', harga: 30000, stok: 10, kategori: 'makanan' },
      // Minuman
      { nama: 'Es Teh Manis', harga: 5000, stok: 30, kategori: 'minuman' },
      { nama: 'Jus Alpukat', harga: 15000, stok: 18, kategori: 'minuman' },
      // Snack
      { nama: 'Kentang Goreng', harga: 12000, stok: 25, kategori: 'snack' },
      { nama: 'Roti Bakar Coklat Keju', harga: 18000, stok: 12, kategori: 'snack' }
    ];
    localStorage.setItem('stokMakanan', JSON.stringify(data));
  }
  return data;
}
function setStok(data) {
  localStorage.setItem('stokMakanan', JSON.stringify(data));
}
function renderTabel() {
  const data = getStok();
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
}
window.editStok = function(idx) {
  const data = getStok();
  const item = data[idx];
  document.getElementById('edit-index').value = idx;
  document.getElementById('nama-makanan').value = item.nama;
  document.getElementById('harga-makanan').value = item.harga;
  document.getElementById('stok-makanan').value = item.stok;
  document.getElementById('kategori-makanan').value = item.kategori || '';
}
window.hapusStok = function(idx) {
  if (!confirm('Yakin hapus data ini?')) return;
  const data = getStok();
  data.splice(idx, 1);
  setStok(data);
  renderTabel();
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
  const data = getStok();
  const idx = document.getElementById('edit-index').value;
  if (idx === '') {
    data.push({ nama, harga, stok, kategori });
  } else {
    data[idx] = { nama, harga, stok, kategori };
  }
  setStok(data);
  renderTabel();
  this.reset();
  document.getElementById('edit-index').value = '';
  document.getElementById('kategori-makanan').value = '';
};
renderTabel(); 