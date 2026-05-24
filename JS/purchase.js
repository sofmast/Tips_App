
const products = [
    {
        id:'DR001',
        name:'Paracetamol',
        category:'Drug',
        price:18,
        stock:250,
        image:'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop',
    },
    {
        id:'DR002',
        name:'Amoxicillin',
        category:'Drug',
        price:45,
        stock:130,
        image:'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800&auto=format&fit=crop',
    },
    {
        id:'DR003',
        name:'Vitamin C',
        category:'Drug',
        price:25,
        stock:190,
        image:'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop',
    },
    {
        id:'DV001',
        name:'Oxygen Cylinder',
        category:'Device',
        price:2500,
        stock:12,
        image:'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=800&auto=format&fit=crop',
    },
    {
        id:'DV002',
        name:'Nebulizer',
        category:'Device',
        price:1200,
        stock:24,
        image:'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop',
    },
    {
        id:'DV003',
        name:'Pulse Oximeter',
        category:'Device',
        price:650,
        stock:40,
        image:'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
    }
];

const productPanel = document.getElementById('productPanel');
const searchInput = document.getElementById('search');
const cartBody = document.getElementById('cartBody');
const overlayModal = document.getElementById('overlayModal');
const toast = document.getElementById('toast');

let cart = [];
let currentProduct = null;
let currentFilter = 'all';

function renderProducts(){

    const keyword = searchInput.value.toLowerCase();

    const filtered = products.filter(product=>{

        const matchSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.id.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

        const matchCategory =
        currentFilter === 'all' ||
        product.category === currentFilter;

        return matchSearch && matchCategory;
    });

    productPanel.innerHTML = filtered.map(product=>`

        <div class="product-card">

            <img src="${product.image}" class="product-image">

            <div class="product-content">

                <div class="badge-row">
                    <span class="category-badge">${product.category}</span>
                    <span class="stock-badge">Stock ${product.stock}</span>
                </div>

                <div class="product-name">${product.name}</div>

                <div class="product-id">${product.id}</div>

                <div class="product-price">K${product.price}</div>

                <div class="product-actions">

                    <button class="btn-add" onclick="openModal('${product.id}')">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add
                    </button>

                    <button class="btn-view">
                        <i class="fa-solid fa-eye"></i>
                    </button>

                </div>

            </div>

        </div>

    `).join('');
}

function openModal(id){

    currentProduct = products.find(product=>product.id === id);

    document.getElementById('m_name').value = currentProduct.name;
    document.getElementById('m_id').value = currentProduct.id;
    document.getElementById('m_category').value = currentProduct.category;
    document.getElementById('m_price').value = currentProduct.price;
    document.getElementById('m_qty').value = 1;
    document.getElementById('m_total').value = currentProduct.price;

    overlayModal.classList.remove('hidden');
}

function closeModal(){
    overlayModal.classList.add('hidden');
}

function calculateModalTotal(){

    const qty = Number(document.getElementById('m_qty').value) || 1;
    const price = Number(document.getElementById('m_price').value);

    document.getElementById('m_total').value = qty * price;
}

function addToCart(){

    const qty = Number(document.getElementById('m_qty').value);
    const supplier = document.getElementById('m_supplier').value.trim();

    if(!supplier){
        showToast('Enter supplier name');
        return;
    }

    const existing = cart.find(item=>item.id === currentProduct.id);

    if(existing){
        existing.qty += qty;
    }
    else{

        cart.push({
            ...currentProduct,
            qty,
            supplier
        });
    }

    renderCart();
    closeModal();
    showToast('Item added to purchase cart');
}

function renderCart(){

    cartBody.innerHTML = cart.map((item,index)=>`

        <tr>
            <td>
                <strong>${item.name}</strong><br>
                <small>${item.category}</small>
            </td>

            <td>
                <input
                type="number"
                min="1"
                value="${item.qty}"
                class="qty-input"
                onchange="updateQty(${index}, this.value)">
            </td>

            <td>
                K${(item.qty * item.price).toFixed(2)}
            </td>

            <td>
                <button class="remove" onclick="removeItem(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>

    `).join('');

    updateTotals();
}

function updateQty(index,value){

    cart[index].qty = Number(value);

    if(cart[index].qty < 1){
        cart[index].qty = 1;
    }

    renderCart();
}

function removeItem(index){

    cart.splice(index,1);
    renderCart();

    showToast('Item removed');
}

function updateTotals(){

    const totalQty = cart.reduce((sum,item)=>sum + item.qty,0);

    const totalCost = cart.reduce((sum,item)=>sum + (item.qty * item.price),0);

    document.getElementById('grandQty').textContent = totalQty;
    document.getElementById('grandTotal').textContent = `K${totalCost.toFixed(2)}`;

    document.getElementById('summaryItems').textContent = cart.length;
    document.getElementById('summaryCost').textContent = `K${totalCost.toFixed(2)}`;
}

function clearCart(){

    cart = [];
    renderCart();

    showToast('Cart cleared');
}

function confirmPurchase(){

    if(cart.length === 0){
        showToast('No items in cart');
        return;
    }

    const purchases = JSON.parse(localStorage.getItem('oxytips_purchases')) || [];

    const purchaseRecord = {
        purchaseId:'PUR-' + Date.now(),
        items:cart,
        total:cart.reduce((sum,item)=>sum + (item.qty * item.price),0),
        createdAt:new Date().toLocaleString()
    };

    purchases.push(purchaseRecord);

    localStorage.setItem('oxytips_purchases', JSON.stringify(purchases));

    showToast('Purchase saved successfully');

    clearCart();
}

function showToast(message){

    toast.textContent = message;

    toast.classList.add('show');

    setTimeout(()=>{
        toast.classList.remove('show');
    },2500);
}

searchInput.addEventListener('input',renderProducts);

document.getElementById('btnClearSearch').addEventListener('click',()=>{
    searchInput.value = '';
    renderProducts();
});

Array.from(document.querySelectorAll('.filter-btn')).forEach(btn=>{

    btn.addEventListener('click',()=>{

        document.querySelectorAll('.filter-btn').forEach(button=>{
            button.classList.remove('active');
        });

        btn.classList.add('active');

        currentFilter = btn.dataset.filter;

        renderProducts();
    });
});

document.getElementById('m_qty').addEventListener('input',calculateModalTotal);

document.getElementById('modalClose').addEventListener('click',closeModal);

document.getElementById('m_cancel').addEventListener('click',closeModal);

document.getElementById('m_add').addEventListener('click',addToCart);

document.getElementById('clearCart').addEventListener('click',clearCart);

document.getElementById('confirmPurchase').addEventListener('click',confirmPurchase);

const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

function openMenu(){
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
}

function closeMenu(){
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
}

document.getElementById('menuToggle').addEventListener('click',openMenu);
document.getElementById('closeMenu').addEventListener('click',closeMenu);
overlay.addEventListener('click',closeMenu);

renderProducts();
renderCart();