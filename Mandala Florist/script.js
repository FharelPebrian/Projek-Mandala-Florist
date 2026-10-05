/* ============================================================
   KONFIGURASI TOKO
   ============================================================ */
const WHATSAPP_NUMBER = "62811444349";
const ADMIN_WHATSAPP_NUMBER = "62811444347";
const STORE_EMAIL = "order@mandalaflorist.com";
const STORE_PHONE = "+62811444349";

const products = [
    { id: 1, name: "Duka Cita Flowers Board", price: 350000, image: "assets/papan-bunga-1.jpg", tag: "Mulai Rp350 Ribu", desc: "Papan bunga duka cita dengan rangkaian elegan dan penuh empati." },
    { id: 2, name: "Selamat & Sukses Flowers Board", price: 2000000, image: "assets/papan-bunga-2.jpg", tag: "Premium", desc: "Papan bunga premium untuk ucapan selamat dan sukses." },
    { id: 3, name: "Selamat & Sukses Flowers Board", price: 2000000, image: "assets/papan-bunga-3.jpg", tag: "Premium", desc: "Desain mewah dengan bunga pilihan untuk momen istimewa." },
    { id: 4, name: "Selamat & Sukses Flowers Board", price: 1500000, image: "assets/papan-bunga-4.jpg", tag: "Pilihan Favorit", desc: "Papan bunga favorit dengan komposisi bunga segar." },
    { id: 5, name: "Selamat & Sukses Flowers Board", price: 1000000, image: "assets/papan-bunga-5.jpg", tag: "Terlaris", desc: "Pilihan terlaris untuk berbagai acara formal." },
    { id: 6, name: "Selamat & Sukses Flowers Board", price: 750000, image: "assets/papan-bunga-6.jpg", tag: "Populer", desc: "Papan bunga populer dengan harga terjangkau." },
    { id: 7, name: "Selamat & Sukses Flowers Board", price: 500000, image: "assets/papan-bunga-7.jpg", tag: "Hemat", desc: "Pilihan hemat untuk ucapan yang tetap berkesan." },
    { id: 8, name: "Selamat & Sukses Flowers Board", price: 350000, image: "assets/papan-bunga-8.jpg", tag: "Hemat", desc: "Papan bunga ekonomis untuk berbagai kebutuhan." }
];

/* ============================================================
   UTILITAS
   ============================================================ */
const rupiah = value => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
}).format(value);

const $ = id => document.getElementById(id);

/* ============================================================
   STATE KERANJANG
   ============================================================ */
let cart = JSON.parse(localStorage.getItem("mandala_cart") || "[]");

function saveCart() {
    localStorage.setItem("mandala_cart", JSON.stringify(cart));
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ============================================================
   RENDER PRODUK
   ============================================================ */
const grid = $("productGrid");

function renderProducts(filter = "semua") {
    grid.innerHTML = "";
    products.forEach(product => {
        const match = filter === "semua" ||
            (filter === "350000" && product.price <= 350000) ||
            (filter === "750000" && product.price === 750000) ||
            (filter === "1000000" && product.price === 1000000) ||
            (filter === "1500000" && product.price >= 1500000);

        if (!match) return;

        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="tag">${product.tag}</span>
            </div>
            <div class="product-body">
                <h3>${product.name}</h3>
                <div class="product-price">${rupiah(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary order-btn" data-add="${product.id}">+ Keranjang</button>
                    <button class="plus-btn" data-add="${product.id}" aria-label="Tambah ke keranjang">+</button>
                    <button class="detail-btn" data-detail="${product.id}" aria-label="Detail">👁</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

/* ============================================================
   FILTER
   ============================================================ */
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        renderProducts(button.dataset.filter);
    });
});

/* ============================================================
   TOAST
   ============================================================ */
const toast = $("toast");
let toastTimer;
function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ============================================================
   KERANJANG
   ============================================================ */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    }
    saveCart();
    renderCart();
    showToast(`${product.name} ditambahkan ke keranjang.`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
    renderCart();
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    showToast("Keranjang dikosongkan.");
}

/* ============================================================
   RENDER KERANJANG (DRAWER & SUMMARY)
   ============================================================ */
function renderCart() {
    const count = getCartCount();
    $("cartCount").textContent = count;

    const drawerBody = $("cartDrawerBody");
    const summaryItems = $("summaryItems");
    const summaryTotal = $("summaryTotal");
    const cartTotal = $("cartTotal");

    if (cart.length === 0) {
        drawerBody.innerHTML = `<p class="empty-cart">Keranjang masih kosong.</p>`;
        summaryItems.innerHTML = `<p class="empty-summary">Keranjang masih kosong.</p>`;
        summaryTotal.textContent = "Total: Rp0";
        cartTotal.textContent = "Total: Rp0";
        return;
    }

    drawerBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${rupiah(item.price)}</p>
                <div class="cart-item-actions">
                    <button data-minus="${item.id}">−</button>
                    <span>${item.qty}</span>
                    <button data-plus="${item.id}">+</button>
                    <button class="cart-item-remove" data-remove="${item.id}">Hapus</button>
                </div>
            </div>
        </div>
    `).join("");

    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span class="summary-name">${item.name} × ${item.qty}</span>
            <span class="summary-price">${rupiah(item.price * item.qty)}</span>
        </div>
    `).join("");

    const total = getCartTotal();
    summaryTotal.textContent = `Total: ${rupiah(total)}`;
    cartTotal.textContent = `Total: ${rupiah(total)}`;
}

/* ============================================================
   EVENT DELEGATION: PRODUK & KERANJANG
   ============================================================ */
grid.addEventListener("click", event => {
    const addBtn = event.target.closest("[data-add]");
    if (addBtn) {
        addToCart(Number(addBtn.dataset.add));
        return;
    }
    const detailBtn = event.target.closest("[data-detail]");
    if (detailBtn) {
        const product = products.find(p => p.id === Number(detailBtn.dataset.detail));
        if (product) {
            showToast(`${product.name} — ${rupiah(product.price)}. ${product.desc}`);
        }
    }
});

$("cartDrawerBody").addEventListener("click", event => {
    const plus = event.target.closest("[data-plus]");
    if (plus) { updateQty(Number(plus.dataset.plus), 1); return; }
    const minus = event.target.closest("[data-minus]");
    if (minus) { updateQty(Number(minus.dataset.minus), -1); return; }
    const remove = event.target.closest("[data-remove]");
    if (remove) { removeFromCart(Number(remove.dataset.remove)); }
});

/* ============================================================
   DRAWER KERANJANG
   ============================================================ */
const drawer = $("cartDrawer");
const overlay = $("cartOverlay");

function openCart() {
    drawer.classList.add("show");
    overlay.classList.add("show");
}
function closeCart() {
    drawer.classList.remove("show");
    overlay.classList.remove("show");
}

$("cartBtn").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("goCheckout").addEventListener("click", closeCart);

/* ============================================================
   FORM CHECKOUT
   ============================================================ */
$("orderForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Keranjang masih kosong. Tambahkan produk terlebih dahulu.");
        return;
    }

    const customerName = $("customerName").value.trim();
    const customerPhone = $("customerPhone").value.trim();
    const customerEmail = $("customerEmail").value.trim();
    const recipient = $("recipient").value.trim();
    const location = $("location").value.trim();
    const message = $("message").value.trim();
    const sendMethod = $("sendMethod").value;

    const itemLines = cart.map(item =>
        `- ${item.name} × ${item.qty} = ${rupiah(item.price * item.qty)}`
    ).join("\n");

    const total = getCartTotal();

    const body = [
        "Halo Mandala Florist, saya ingin melakukan pemesanan papan bunga.",
        "",
        "Detail Pesanan:",
        itemLines,
        "",
        `Total: ${rupiah(total)}`,
        `Nama Pemesan: ${customerName}`,
        `Nomor WhatsApp: ${customerPhone || "-"}`,
        `Email: ${customerEmail || "-"}`,
        `Acara/Tujuan: ${recipient}`,
        `Lokasi Pemasangan: ${location}`,
        `Ucapan: ${message || "-"}`
    ].join("\n");

    if (sendMethod === "wa") {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`, "_blank");
        // Notifikasi ke admin
        setTimeout(() => {
            const adminBody = "Pesanan baru dari website:\n\n" + body;
            window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(adminBody)}`, "_blank");
        }, 500);
    } else if (sendMethod === "email") {
        const subject = encodeURIComponent("Pesanan Papan Bunga - Mandala Florist");
        const mailBody = encodeURIComponent(body);
        window.location.href = `mailto:${STORE_EMAIL}?subject=${subject}&body=${mailBody}`;
    } else if (sendMethod === "telp") {
        window.location.href = `tel:${STORE_PHONE}`;
        showToast("Silakan sampaikan detail pesanan Anda melalui telepon.");
    }

    showToast("Pesanan diproses. Terima kasih!");
});

/* ============================================================
   TOMBOL KONTAK
   ============================================================ */
$("contactWa").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo Mandala Florist, saya ingin bertanya tentang papan bunga.")}`;
$("contactEmail").href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent("Pertanyaan tentang Papan Bunga")}`;
$("contactTelp").href = `tel:${STORE_PHONE}`;

/* ============================================================
   KOSONGKAN KERANJANG
   ============================================================ */
$("clearCartBtn").addEventListener("click", clearCart);

/* ============================================================
   INISIALISASI
   ============================================================ */
renderProducts();
renderCart();