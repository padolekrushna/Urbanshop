// app.js - Common logic for Urbanshop

// ===== Toast Notification =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        const c = document.createElement('div');
        c.id = 'toast-container';
        c.className = 'toast-container';
        document.body.appendChild(c);
        return showToast(message, type, duration);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ===== Wishlist Logic =====
function getWishlist() { return JSON.parse(localStorage.getItem("urbanshop_wishlist") || "[]"); }
function toggleWishlist(id) { const items = getWishlist(); const updated = items.includes(id) ? items.filter(x => x !== id) : [...items, id]; localStorage.setItem("urbanshop_wishlist", JSON.stringify(updated)); updateWishlistCount(); return updated; }
function updateWishlistCount() { const el = document.getElementById('wishlist-count'); if (el) el.innerText = getWishlist().length; }

// ===== Auth Logic =====
async function getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) console.error('getSession error:', error.message);
    return session ? session.user : null;
}
async function checkAdminStatus(user) {
    if (!supabaseClient || !user) return false;
    const { data, error } = await supabaseClient.from('profiles').select('role').eq('id', user.id).single();
    if (error) { console.error('Admin check failed:', error.message); return false; }
    return data && data.role === 'admin';
}
async function signOut() { if (supabaseClient) { await supabaseClient.auth.signOut(); window.location.reload(); } }

// ===== Analytics =====
async function trackEvent(eventType, productId = null) {
    fetch(`${CONFIG.API_URL}/analytics/event`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_type: eventType, product_id: productId, user_id: supabaseClient ? ((await supabaseClient.auth.getUser()).data?.user?.id || null) : null }) }).catch(console.error);
}

// ===== Products Fetching =====
async function fetchProducts() {
    if (supabaseClient) {
        const { data, error } = await supabaseClient.from('products').select('*');
        if (!error && data) return data;
    }
    try { const res = await fetch(`${CONFIG.API_URL}/products`); const json = await res.json(); return json.items; } catch (e) { console.error("Failed to fetch products:", e); return []; }
}
async function fetchProductById(id) {
    if (supabaseClient) { const { data, error } = await supabaseClient.from('products').select('*').eq('id', id).single(); if (!error && data) return data; }
    try { const res = await fetch(`${CONFIG.API_URL}/products`); const json = await res.json(); return json.items.find(p => p.id == id) || null; } catch (e) { return null; }
}
function getProductImageUrl(p, size = '300x200') { let url = p.image_url || `https://via.placeholder.com/${size}?text=No+Image`; if (p.image_url && !p.image_url.startsWith('http') && supabaseClient) { url = supabaseClient.storage.from('product-images').getPublicUrl(p.image_url).data.publicUrl; } return url; }
function getProductThumbnail(p) { return getProductImageUrl(p, '50'); }

// ===== Render Products =====
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const wishlist = getWishlist();
    if (products.length === 0) { container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No products found. Try a different search or category.</p></div>'; return; }
    products.forEach(p => {
        const isWishlisted = wishlist.includes(p.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        const imageUrl = getProductImageUrl(p);
        card.innerHTML = `
            <a href="product.html?id=${p.id}">
                <img src="${imageUrl}" alt="${p.title}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="product-category">${p.category || 'Category'}</div>
                <div class="product-title">${p.title}</div>
                <div class="product-price">₹${p.price}</div>
            </a>
            <div class="product-actions">
                <button class="btn-primary" onclick="buyProduct(${p.id})">Buy Now</button>
                <button class="btn-secondary" onclick="toggleWishlistBtn(this, ${p.id})">${isWishlisted ? '♥ Saved' : '♡ Save'}</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function buyProduct(id) { trackEvent('reseller_click', id); showToast('Redirecting to reseller...', 'info'); }
function toggleWishlistBtn(btn, id) { const updated = toggleWishlist(id); btn.innerText = updated.includes(id) ? '♥ Saved' : '♡ Save'; showToast(updated.includes(id) ? 'Added to wishlist' : 'Removed from wishlist', 'success'); }

// ===== Setup Header =====
async function setupHeader() {
    updateWishlistCount();
    const user = await getCurrentUser();
    const accountLink = document.getElementById('account-link');
    const adminLink = document.getElementById('admin-link');
    if (user) { accountLink.innerText = 'Logout'; accountLink.href = '#'; accountLink.onclick = (e) => { e.preventDefault(); signOut(); }; const isAdmin = await checkAdminStatus(user); if (isAdmin && adminLink) adminLink.style.display = 'flex'; }
    else { accountLink.innerText = 'Account'; accountLink.href = 'auth.html'; if (adminLink) adminLink.style.display = 'none'; }
}

// ===== Product Management (Admin) =====
async function uploadProductImage(file) { if (!supabaseClient || !file) return null; const fileName = `${Date.now()}_${file.name}`; const { error } = await supabaseClient.storage.from('product-images').upload(fileName, file); if (error) { console.error('Image upload failed:', error.message); return null; } return fileName; }
async function createProduct(productData) { if (!supabaseClient) return { error: 'Supabase not configured', data: null }; const { data, error } = await supabaseClient.from('products').insert([productData]).select(); return { data, error }; }
async function deleteProduct(id) { if (!supabaseClient) return { error: 'Supabase not configured' }; const { error } = await supabaseClient.from('products').delete().eq('id', id); return { error }; }
async function updateProduct(id, productData) { if (!supabaseClient) return { error: 'Supabase not configured', data: null }; const { data, error } = await supabaseClient.from('products').update(productData).eq('id', id).select(); return { data, error }; }
async function toggleProductActive(id, isActive) { if (!supabaseClient) return { error: 'Supabase not configured' }; const { error } = await supabaseClient.from('products').update({ is_active: isActive }).eq('id', id); return { error }; }
async function fetchCategories() { if (!supabaseClient) return []; const { data, error } = await supabaseClient.from('categories').select('name').order('name'); if (error) { console.error('Categories fetch failed:', error.message); return []; } return data || []; }

// ===== Admin Refresh =====
async function refreshAdminProducts() {
    const tbody = document.querySelector('#admin-products tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;">Loading...</td></tr>';
    const products = await fetchProducts();
    if (products.length === 0) { tbody.innerHTML = '<tr><td colspan="7" class="admin-no-products"><div class="empty-icon">📦</div><p>No products found.</p></td></tr>'; return; }
    tbody.innerHTML = '';
    products.forEach(p => {
        const tr = document.createElement('tr'); const imageUrl = getProductThumbnail(p); const isActive = p.is_active !== false;
        tr.innerHTML = `<td>${p.id}</td><td><img src="${imageUrl}" width="50" height="50" style="object-fit:contain;border-radius:4px;" onerror="this.src='https://via.placeholder.com/50?text=N/A'"></td><td>${p.title}</td><td>${p.category || 'N/A'}</td><td>₹${p.price}</td><td><span class="badge-${isActive ? 'active' : 'inactive'}">${isActive ? 'Active' : 'Inactive'}</span></td><td><button onclick="openEditModal(${JSON.stringify(p).replace(/"/g, '&quot;')})" class="btn-edit">Edit</button><button onclick="toggleActiveBtn(${p.id}, ${isActive})" class="btn-toggle">${isActive ? 'Deactivate' : 'Activate'}</button><button onclick="deleteProductBtn(${p.id})" class="btn-delete">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
async function deleteProductBtn(id) { if (!confirm('Delete this product?')) return; showToast('Deleting...', 'info'); const { error } = await deleteProduct(id); if (error) showToast('Delete failed: ' + error.message, 'error'); else { showToast('Product deleted.', 'success'); await refreshAdminProducts(); } }
async function toggleActiveBtn(id, currentStatus) { const newStatus = !currentStatus; const { error } = await toggleProductActive(id, newStatus); if (error) showToast('Toggle failed: ' + error.message, 'error'); else { showToast('Product ' + (newStatus ? 'activated' : 'deactivated') + '.', 'success'); await refreshAdminProducts(); } }
function openEditModal(p) { currentEditId = p.id; document.getElementById('edit-title').value = p.title || ''; document.getElementById('edit-price').value = p.price || ''; document.getElementById('edit-category').value = p.category || ''; document.getElementById('edit-location').value = p.location || ''; document.getElementById('edit-description').value = p.description || ''; document.getElementById('edit-image-url').value = p.image_url && p.image_url.startsWith('http') ? p.image_url : ''; document.getElementById('edit-reseller-link').value = p.reseller_link || ''; document.getElementById('edit-active').checked = p.is_active !== false; document.getElementById('edit-modal').style.display = 'block'; }
function closeEditModal() { document.getElementById('edit-modal').style.display = 'none'; currentEditId = null; }

// ===== Storefront Utilities =====
function searchProducts(query, products) { if (!query) return products; return products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())); }
function filterByCategory(category, products) { if (!category) return products; return products.filter(p => (p.category || '').toLowerCase() === category.toLowerCase()); }
function sortProducts(products, field, direction) { return products.sort((a, b) => { let va = a[field], vb = b[field]; if (field === 'price') { va = parseFloat(va); vb = parseFloat(vb); } if (va < vb) return direction === 'asc' ? -1 : 1; if (va > vb) return direction === 'asc' ? 1 : -1; return 0; }); }

// ===== Global Load =====
document.addEventListener('DOMContentLoaded', () => { updateWishlistCount(); setupHeader(); trackEvent('page_view'); });
