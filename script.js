/* ===========================
   SCRIPT.JS - UNWORTHY STORE
   =========================== */

// ---- STATE ----
let cart = []; // { id, name, size, price, img }

// ---- DOM REFS ----
const cartCountEl = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBodyEl = document.getElementById('cart-body');
const cartEmptyEl = document.getElementById('cart-empty');
const cartItemsList = document.getElementById('cart-items-list');
const cartFooterEl = document.getElementById('cart-footer');
const cartSubtotalEl = document.getElementById('cart-subtotal-price');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const modalSummary = document.getElementById('modal-cart-summary');
const modalTotal = document.getElementById('modal-total-price');

// ---- UTILITY ----
function formatRp(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

function getTotal() {
    return cart.reduce((s, item) => s + item.price, 0);
}

function updateCartCount() {
    const count = cart.length;
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
}

// ---- RENDER CART ----
function renderCart() {
    cartItemsList.innerHTML = '';
    const total = getTotal();

    if (cart.length === 0) {
        cartEmptyEl.style.display = 'flex';
        cartFooterEl.style.display = 'none';
    } else {
        cartEmptyEl.style.display = 'none';
        cartFooterEl.style.display = 'block';

        cart.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src=''"
                     style="${!item.img ? 'background:#eee' : ''}">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-size">Ukuran: ${item.size || 'M'}</p>
                    <p class="cart-item-price">${formatRp(item.price)}</p>
                </div>
                <button class="remove-item" data-idx="${idx}" aria-label="Hapus">✕</button>
            `;
            cartItemsList.appendChild(row);
        });

        cartSubtotalEl.textContent = formatRp(total);
    }

    updateCartCount();
}

// ---- ADD TO CART ----
function addToCart(id, name, price, img, size = 'M') {
    cart.push({ id, name, price, img, size });
    renderCart();
    openSidebar();
}

// ---- SIDEBAR ----
function openSidebar() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ---- QUICK ADD BUTTONS ----
document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const img = btn.dataset.img;

        // Check if size was selected on the card
        const card = btn.closest('.product-card');
        const activeSize = card?.querySelector('.size-btn.active');
        const size = activeSize ? activeSize.dataset.size : 'M';

        addToCart(id, name, price, img, size);

        // feedback
        const orig = btn.textContent;
        btn.textContent = '✓ Added!';
        btn.style.background = '#10B981';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
        }, 1600);
    });
});

// ---- SIZE SWATCHES ----
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const swatches = btn.closest('.size-swatches').querySelectorAll('.size-btn');
        swatches.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ---- CART OPEN/CLOSE ----
document.getElementById('open-cart').addEventListener('click', openSidebar);
document.getElementById('close-cart').addEventListener('click', closeSidebar);
cartOverlay.addEventListener('click', closeSidebar);

// ---- REMOVE FROM CART ----
cartItemsList.addEventListener('click', e => {
    const btn = e.target.closest('.remove-item');
    if (btn) {
        const idx = parseInt(btn.dataset.idx);
        cart.splice(idx, 1);
        renderCart();
    }
});

// ---- CHECKOUT ----
document.getElementById('open-checkout').addEventListener('click', () => {
    closeSidebar();
    // Populate modal summary
    modalSummary.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'summary-item';
        row.innerHTML = `<span>${item.name} (${item.size})</span><span>${formatRp(item.price)}</span>`;
        modalSummary.appendChild(row);
    });
    modalTotal.textContent = formatRp(getTotal());
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
});

document.getElementById('close-modal').addEventListener('click', () => {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
});

checkoutModal.addEventListener('click', e => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ---- FORM SUBMIT → WHATSAPP ----
checkoutForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('buyer-name').value.trim();
    const phone = document.getElementById('buyer-phone').value.trim();
    const address = document.getElementById('buyer-address').value.trim();
    const paymentOption = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentOption ? paymentOption.value : 'Belum dipilih';

    let msg = `*PESANAN BARU — UNWORTHY*\n\n`;
    msg += `*Nama:* ${name}\n`;
    msg += `*No. HP:* ${phone}\n`;
    msg += `*Alamat:* ${address}\n`;
    msg += `*Pembayaran:* ${paymentMethod}\n\n`;
    msg += `*Detail Pesanan:*\n`;

    cart.forEach((item, i) => {
        msg += `${i + 1}. ${item.name} (Ukuran: ${item.size}) — ${formatRp(item.price)}\n`;
    });

    msg += `\n*Total: ${formatRp(getTotal())}*\n\n`;
    msg += `Mohon konfirmasi pembayaran & pengiriman. Terima kasih! 🙏`;

    const waNumber = '6285183083705';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Reset
    cart = [];
    renderCart();
    checkoutModal.classList.remove('open');
    checkoutForm.reset();
    document.body.style.overflow = '';
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- ANNOUNCEMENT CLOSE ----
const annBar = document.getElementById('announcement-bar');
document.getElementById('close-announcement').addEventListener('click', () => {
    annBar.style.display = 'none';
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

// ---- PRODUCT FILTER ----
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
            const tag = card.dataset.tag || '';
            if (filter === 'all' || tag.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ---- INIT ----
renderCart();
