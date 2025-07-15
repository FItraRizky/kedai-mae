// Data menu default (samakan id dengan data-id di index.html)
const defaultStok = [
  {id:'nasi-goreng-special', name:'Nasi Goreng Special', stok:10},
  {id:'mie-ayam-jamur', name:'Mie Ayam Jamur', stok:10},
  {id:'sate-ayam-madura', name:'Sate Ayam Madura', stok:10},
  {id:'es-teh-manis', name:'Es Teh Manis', stok:10},
  {id:'jus-alpukat', name:'Jus Alpukat', stok:10},
  {id:'kentang-goreng', name:'Kentang Goreng', stok:10},
  {id:'roti-bakar-coklat', name:'Roti Bakar Coklat Keju', stok:10}
];
function getStokList() {
  return JSON.parse(localStorage.getItem('kedaiMaeStok')||'null') || defaultStok;
}
function saveStokList(list) {
  localStorage.setItem('kedaiMaeStok', JSON.stringify(list));
}
// Login logic
const loginBox = document.querySelector('.admin-login');
const panelBox = document.querySelector('.admin-panel');
const loginBtn = document.getElementById('login-btn');
const passInput = document.getElementById('admin-pass');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
loginBtn.onclick = function(){
  if(passInput.value==='admin123'){
    loginBox.style.display='none';panelBox.style.display='block';
    renderStokTable();
  }else{
    loginError.style.display='block';
  }
};
logoutBtn.onclick = function(){
  panelBox.style.display='none';loginBox.style.display='block';passInput.value='';
};
// Render table
function renderStokTable(){
  const list = getStokList();
  const tbody = document.getElementById('stok-tbody');
  tbody.innerHTML = '';
  list.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td><td><input type='number' min='0' value='${item.stok}' data-id='${item.id}'></td>`;
    tbody.appendChild(tr);
  });
}
// Simpan stok
  document.getElementById('stok-form').onsubmit = function(e){
    e.preventDefault();
    const list = getStokList();
    document.querySelectorAll('#stok-tbody input').forEach(input=>{
      const item = list.find(i=>i.id===input.dataset.id);
      if(item) item.stok = parseInt(input.value)||0;
    });
    saveStokList(list);
    document.getElementById('stok-notif').style.display='block';
    setTimeout(()=>{document.getElementById('stok-notif').style.display='none';},2000);
  };
