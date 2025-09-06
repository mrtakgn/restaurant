// Admin Panel JavaScript - Responsive Version
let menuItems = [];
let editingItemId = null;
let deleteItemId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
    setupEventListeners();
});

// Clear localStorage and reload default data
function clearAndReloadData() {
    localStorage.removeItem('menuItems');
    loadMenuItems();
    alert('Veriler temizlendi ve varsayılan ürünler yüklendi!');
}

// Load menu items from localStorage or default data
function loadMenuItems() {
    const savedItems = localStorage.getItem('menuItems');
    if (savedItems) {
        try {
            menuItems = JSON.parse(savedItems);
        } catch (e) {
            console.error('localStorage verisi bozuk, varsayılan veriler yükleniyor...');
            menuItems = getDefaultMenuItems();
            saveMenuItems();
        }
    } else {
        menuItems = getDefaultMenuItems();
        saveMenuItems();
    }
    renderMenuItems();
}

// Get default menu items
function getDefaultMenuItems() {
    return [
        {
            id: 1,
            name: 'Mercimek Çorbası',
            category: 'soups',
            price: 25,
            description: 'Geleneksel tarifimizle hazırlanan nefis mercimek çorbası',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 2,
            name: 'Yayla Çorbası',
            category: 'soups',
            price: 28,
            description: 'Yoğurt ve pirinçle hazırlanan geleneksel çorba',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 3,
            name: 'Adana Kebap',
            category: 'mains',
            price: 85,
            description: 'Acılı kıyma ile hazırlanan geleneksel Adana kebap',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 4,
            name: 'Tavuk Şinitzel',
            category: 'mains',
            price: 65,
            description: 'Çıtır kaplamalı tavuk göğsü, patates kızartması ile',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 5,
            name: 'Baklava',
            category: 'desserts',
            price: 35,
            description: 'Geleneksel tarifimizle hazırlanan cevizli baklava',
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 6,
            name: 'Türk Kahvesi',
            category: 'beverages',
            price: 15,
            description: 'Geleneksel yöntemle pişirilen Türk kahvesi',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
    ];
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('search-items').addEventListener('input', filterItems);
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', filterItems);
}

// Render menu items in table
function renderMenuItems(items = menuItems) {
    const tbody = document.getElementById('menu-items-tbody');
    tbody.innerHTML = '';

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #666;">Henüz ürün eklenmemiş</td></tr>';
        return;
    }

    items.forEach(function(item) {
        const row = document.createElement('tr');
        
        // Create image cell
        const imgCell = document.createElement('td');
        imgCell.setAttribute('data-label', 'Resim');
        const img = document.createElement('img');
        img.src = item.image || 'https://via.placeholder.com/50x50?text=Resim';
        img.alt = item.name;
        img.className = 'item-image';
        imgCell.appendChild(img);
        
        // Create name cell
        const nameCell = document.createElement('td');
        nameCell.setAttribute('data-label', 'Ürün Adı');
        nameCell.textContent = item.name;
        
        // Create category cell
        const categoryCell = document.createElement('td');
        categoryCell.setAttribute('data-label', 'Kategori');
        categoryCell.setAttribute('data-price', '₺' + item.price);
        categoryCell.textContent = getCategoryName(item.category);
        
        // Create price cell
        const priceCell = document.createElement('td');
        priceCell.setAttribute('data-label', 'Fiyat');
        priceCell.textContent = '₺' + item.price;
        
        // Create description cell
        const descCell = document.createElement('td');
        descCell.setAttribute('data-label', 'Açıklama');
        descCell.textContent = item.description;
        
        // Create actions cell
        const actionsCell = document.createElement('td');
        actionsCell.setAttribute('data-label', 'İşlemler');
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.onclick = function() { editItem(item.id); };
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Düzenle';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = function() { deleteItem(item.id); };
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Sil';
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        actionsCell.appendChild(actionsDiv);
        
        // Append all cells to row
        row.appendChild(imgCell);
        row.appendChild(nameCell);
        row.appendChild(categoryCell);
        row.appendChild(priceCell);
        row.appendChild(descCell);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
}

// Get category name in Turkish
function getCategoryName(category) {
    const categories = {
        'soups': 'Çorbalar',
        'mains': 'Ana Yemekler',
        'desserts': 'Tatlılar',
        'beverages': 'İçecekler'
    };
    return categories[category] || category;
}

// Filter items based on search and category
function filterItems() {
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredItems = menuItems.filter(function(item) {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                             item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    renderMenuItems(filteredItems);
}

// Open add item modal
function openAddItemModal() {
    editingItemId = null;
    document.getElementById('modal-title').textContent = 'Yeni Ürün Ekle';
    document.getElementById('item-form').reset();
    document.getElementById('item-modal').style.display = 'block';
}

// Edit item
function editItem(id) {
    const item = menuItems.find(function(item) { return item.id === id; });
    if (!item) return;
    
    editingItemId = id;
    document.getElementById('modal-title').textContent = 'Ürünü Düzenle';
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('item-modal').style.display = 'block';
}

// Save item (add or edit)
function saveItem(event) {
    event.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const description = document.getElementById('item-description').value;
    const image = document.getElementById('item-image').value;
    
    if (editingItemId) {
        // Edit existing item
        const itemIndex = menuItems.findIndex(function(item) { return item.id === editingItemId; });
        if (itemIndex !== -1) {
            menuItems[itemIndex] = {
                id: menuItems[itemIndex].id,
                name: name,
                category: category,
                price: price,
                description: description,
                image: image
            };
        }
    } else {
        // Add new item
        const newId = Math.max.apply(Math, menuItems.map(function(item) { return item.id; })) + 1;
        menuItems.push({
            id: newId,
            name: name,
            category: category,
            price: price,
            description: description,
            image: image
        });
    }
    
    saveMenuItems();
    renderMenuItems();
    closeModal();
    
    // Show success message
    alert(editingItemId ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla eklendi!');
}

// Delete item
function deleteItem(id) {
    const item = menuItems.find(function(item) { return item.id === id; });
    if (!item) return;
    
    deleteItemId = id;
    document.getElementById('delete-item-name').textContent = item.name;
    document.getElementById('delete-modal').style.display = 'block';
}

// Confirm delete
function confirmDelete() {
    if (deleteItemId) {
        menuItems = menuItems.filter(function(item) { return item.id !== deleteItemId; });
        saveMenuItems();
        renderMenuItems();
        closeDeleteModal();
        alert('Ürün başarıyla silindi!');
    }
}

// Close modal
function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
    editingItemId = null;
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    deleteItemId = null;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const itemModal = document.getElementById('item-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    if (event.target === itemModal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

// Export menu to JSON
function exportMenu() {
    const dataStr = JSON.stringify(menuItems, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu-items.json';
    link.click();
    URL.revokeObjectURL(url);
}
