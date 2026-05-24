// app.js - POS with modal + scalable display considerations

// ---------- Configuration ----------
const INITIAL_RENDER = 50;   // how many product buttons to render initially
const LOAD_STEP = 50;        // how many to load on "Load more"
const MAX_NAME_SEARCH = 200; // limit for client-side name search to avoid freeze

// ---------- Data bootstrap (demo) ----------
// In real usage, 'inventory' should be fetched from server (paged).
// For demo/testing you can populate localStorage 'purchases'.
let inventory = JSON.parse(localStorage.getItem('purchases')) || [];

// If inventory is empty, generate demo items (only for testing; remove in production)
if (!inventory || inventory.length === 0) {
 window.location.href = "addStock.html";
  }

  localStorage.setItem('purchases', JSON.stringify(inventory))

// Fast id → item map for instant lookup (good for scans)
const idMap = new Map(inventory.map(it => [String(it.id).toLowerCase(), it]));

// ---------- State ----------
let renderedCount = 0;
let cart = [];
let selectedItem = null;

// ---------- Elements ----------
const productPanel = document.getElementById('productPanel');
const btnLoadMore = document.getElementById('btnLoadMore');
const searchInput = document.getElementById('search');
const btnClearSearch = document.getElementById('btnClearSearch');

const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const m_name = document.getElementById('m_name');
const m_id = document.getElementById('m_id');
const m_available = document.getElementById('m_available');
const m_price = document.getElementById('m_price');
const m_qty = document.getElementById('m_qty');
const m_total = document.getElementById('m_total');
const m_add = document.getElementById('m_add');
const m_cancel = document.getElementById('m_cancel');

const cartTableBody = document.querySelector('#cartTable tbody');
const grandTotalDisplay = document.getElementById('grandTotal');
const confirmSaleBtn = document.getElementById('confirmSale');
const clearCartBtn = document.getElementById('clearCart');
const showCart = document.getElementById("showCart");
showCart.addEventListener('click', ()=>{
  cart.style.display="block";
});

// ---------- Rendering product panel (partial render for scalability) ----------
function renderProductPanel(initial=false){
  // If initial, reset
  if (initial) { productPanel.innerHTML = ''; renderedCount = 0; }

  const to = Math.min(renderedCount + LOAD_STEP, inventory.length);
  for (let i = renderedCount; i < to; i++){
    const it = inventory[i];
    const card = document.createElement('div');
    card.className = 'product-btn';
    card.innerHTML = `
      <div class="product-name">
      <div class="pic-div"><img src="${it.image}" alt="" width="80" height="80"></div>
      <div>${escapeHtml(it.name)}</div>
      </div>
      <div class="product-price">Price: K${Number(it.sellPrice).toFixed(2)}</div>
      <div class="product-stock">Stock: ${it.qty}</div>
      <div class="product-actions">
        <button class="product-quick" data-index="${i}" title="add tocart">Add</button>
        <button class="product-open" data-index="${i}" title="Open item details">bulk</button>
      </div>
    `;
    // Quick add: default qty 1 and add
    card.querySelector('.product-quick').addEventListener('click', (e)=>{
      e.stopPropagation();
      handleProductQuickAdd(it);
    });
    // Open modal
    card.querySelector('.product-open').addEventListener('click', (e)=>{
      e.stopPropagation();
      openModalWithItem(it);
    });
    // allow clicking the card to open modal too
    card.addEventListener('click', ()=>openModalWithItem(it));
    productPanel.appendChild(card);
  }
  renderedCount = to;

  // Hide load more when all rendered
  btnLoadMore.style.display = renderedCount >= inventory.length ? 'none' : 'inline-block';
}
btnLoadMore.addEventListener('click', ()=> renderProductPanel());

// ---------- Quick-add and modal logic ----------
function handleProductQuickAdd(item){
  // Quick-add 1 unit without opening modal (but still check stock)
  const qty = 1;
  if (qty > item.qty) { showMessage('Insufficient stock', 'red'); return; }
  const existing = cart.find(c => c.id === item.id);
  if (existing) { existing.qty += qty; existing.total = existing.qty * existing.price; }
  else cart.push({ id: item.id, name: item.name, qty, price: Number(item.sellPrice), total: qty * Number(item.sellPrice) });
  renderCart();
  showMessage('Added 1 unit', 'green');
}

function openModalWithItem(item){
  selectedItem = item;
  // fill modal fields
  modalTitle.textContent = `Add — ${item.name}`;
  m_name.value = item.name;
  m_id.value = item.id;
  m_available.value = item.qty;
  m_price.value = Number(item.sellPrice).toFixed(2);
  m_qty.value = 1; // default as requested
  updateModalTotal();
  showModal();
  // focus qty for quick change
  setTimeout(()=> m_qty.focus(), 80);
}

function updateModalTotal(){
  const qty = Number(m_qty.value) || 0;
  const price = Number(m_price.value) || 0;
  m_total.value = (qty * price).toFixed(2);
}

// ---------- Modal show/hide ----------
function showModal(){ overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); }
function hideModal(){ overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); selectedItem = null; }

// modal controls
modalClose.addEventListener('click', hideModal);
m_cancel.addEventListener('click', hideModal);

// keyboard: Enter = add, Esc = close
overlay.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') hideModal();
  if (e.key === 'Enter' && document.activeElement !== searchInput){
    e.preventDefault(); modalAddToCart();
  }
});

// keep total in sync
m_qty.addEventListener('input', updateModalTotal);

// add from modal
m_add.addEventListener('click', modalAddToCart);
function modalAddToCart(){
  if (!selectedItem) return;
  const qty = Number(m_qty.value) || 0;
  if (qty <= 0) { showMessage('Enter valid quantity', 'red'); return; }
  if (qty > selectedItem.qty) { showMessage('Insufficient stock', 'red'); return; }
  const existing = cart.find(c=> c.id === selectedItem.id);
  if (existing){ existing.qty += qty; existing.total = existing.qty * existing.price; }
  else cart.push({ id: selectedItem.id, name: selectedItem.name, qty, price: Number(selectedItem.sellPrice), total: qty * Number(selectedItem.sellPrice) });

  renderCart();
  hideModal();
  showMessage('Item added to cart', 'green');
}

// ---------- Cart rendering & actions ----------
function renderCart(){
  cartTableBody.innerHTML = '';
  let grand = 0;
  cart.forEach((it, idx)=>{
    grand += it.total;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(it.name)}</td>
      <td><input type="number" min="1" value="${it.qty}" data-idx="${idx}" class="editQty"></td>
      <td>K${Number(it.price).toFixed(2)}</td>
      <td>K${Number(it.total).toFixed(2)}</td>
      <td><button data-idx="${idx}" class="remove">X</button></td>
    `;
    cartTableBody.appendChild(tr);
  });
  grandTotalDisplay.textContent = `Grand Total: K${grand.toFixed(2)}`;

  // attach listeners
  document.querySelectorAll('.editQty').forEach(inp => inp.addEventListener('input', (e)=>{
    const idx = Number(e.target.dataset.idx);
    const val = Number(e.target.value) || 0;
    if (val > 0){ cart[idx].qty = val; cart[idx].total = cart[idx].price * val; renderCart(); }
  }));
  document.querySelectorAll('.remove').forEach(btn => btn.addEventListener('click', ()=>{
    const idx = Number(btn.dataset.idx);
    cart.splice(idx,1); renderCart();
  }));
}

clearCartBtn.addEventListener('click', ()=>{
  if (!confirm('Clear all items from cart?')) return;
  cart = []; renderCart();
});

confirmSaleBtn.addEventListener('click', ()=>{
  if (cart.length === 0){ showMessage('Cart empty', 'red'); return; }
  const sales = JSON.parse(localStorage.getItem('sales')) || [];
  const date = new Date().toLocaleString();
  cart.forEach(it=>{
    sales.push({ ...it, date });
    // update inventory counts
    const inv = idMap.get(String(it.id).toLowerCase());
    if (inv) inv.qty = Math.max(0, inv.qty - it.qty);
  });
  localStorage.setItem('sales', JSON.stringify(sales));
  localStorage.setItem('purchases', JSON.stringify(inventory));
  // refresh UI
  cart = []; renderCart(); renderProductPanel(true); showMessage('Sale confirmed', 'green');
});

// ---------- Search & scan behavior ----------
// On Enter: if exact id found → open modal; otherwise attempt limited name search and open first match
searchInput.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter'){
    const term = searchInput.value.trim();
    if (!term) return;
    const byId = idMap.get(term.toLowerCase());
    if (byId) { openModalWithItem(byId); searchInput.value=''; return; }

    // fallback: limited name search to avoid freeze
    const safeLimit = Math.min(inventory.length, MAX_NAME_SEARCH);
    for (let i=0;i<safeLimit;i++){
      const it = inventory[i];
      if (it.name && it.name.toLowerCase().includes(term.toLowerCase())){
        openModalWithItem(it); searchInput.value=''; return;
      }
    }
    showMessage('No match found (try ID or refine name)', 'red');
  }
});

// clear search
btnClearSearch.addEventListener('click', ()=> { searchInput.value=''; searchInput.focus(); });

// ---------- Helper & init ----------
function escapeHtml(s){ return String(s).replace(/[&<>"'`]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;",'`':'&#96;'})[ch]); }
function showMessage(text, color='green'){
  // simple top-floating message (temporary)
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.position='fixed'; msg.style.top='18px'; msg.style.right='18px';
  msg.style.background = color === 'red' ? '#fee2e2' : '#e6f4ff';
  msg.style.color = color === 'red' ? '#b91c1c' : '#0b4fda';
  msg.style.padding='10px 12px'; msg.style.borderRadius='8px'; msg.style.boxShadow='0 6px 18px rgba(20,30,50,0.08)';
  document.body.appendChild(msg);
  setTimeout(()=> msg.remove(), 1800);
}

// initial render: show first chunk
renderProductPanel(true);
renderCart();

// Make overlay keyboard accessible
overlay.addEventListener('click', (e)=>{ if (e.target === overlay) hideModal(); });
