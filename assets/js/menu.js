// Menu management and display script

document.addEventListener('DOMContentLoaded', () => {
  const userRole = sessionStorage.getItem('userRole');
  const menuListEl = document.getElementById('menuList');
  const menuForm = document.getElementById('menuForm');
  const menuIdInput = document.getElementById('menuId');
  const menuNameInput = document.getElementById('menuName');
  const menuPriceInput = document.getElementById('menuPrice');
  const menuCategoryInput = document.getElementById('menuCategory');
  const cancelEditBtn = document.getElementById('cancelEdit');

  let menus = JSON.parse(localStorage.getItem('menus')) || [];

  function saveMenus() {
    localStorage.setItem('menus', JSON.stringify(menus));
  }

  function renderMenuList() {
    menuListEl.innerHTML = '';
    if (menus.length === 0) {
      menuListEl.innerHTML = '<p class="text-gray-600">Belum ada menu tersedia.</p>';
      return;
    }
    menus.forEach((menu) => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow flex flex-col justify-between';

      const nameEl = document.createElement('h3');
      nameEl.textContent = menu.name;
      nameEl.className = 'font-semibold text-lg';

      const categoryEl = document.createElement('p');
      categoryEl.textContent = `Kategori: ${menu.category}`;
      categoryEl.className = 'text-gray-600 text-sm';

      const priceEl = document.createElement('p');
      priceEl.textContent = `Harga: Rp ${menu.price.toLocaleString()}`;
      priceEl.className = 'text-gray-800 font-medium mt-2';

      card.appendChild(nameEl);
      card.appendChild(categoryEl);
      card.appendChild(priceEl);

      if (userRole === 'admin') {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'mt-4 flex space-x-2';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded';
        editBtn.addEventListener('click', () => {
          menuIdInput.value = menu.id;
          menuNameInput.value = menu.name;
          menuPriceInput.value = menu.price;
          menuCategoryInput.value = menu.category;
          cancelEditBtn.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded';
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Hapus menu "${menu.name}"?`)) {
            menus = menus.filter((m) => m.id !== menu.id);
            saveMenus();
            renderMenuList();
          }
        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        card.appendChild(btnContainer);
      } else {
        // For kasir and pelanggan, add a select button for transactions
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Pilih';
        selectBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mt-4';
        selectBtn.addEventListener('click', () => {
          // Save selected menu to sessionStorage for transaksi page
          let selectedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];
          const existing = selectedMenus.find((m) => m.id === menu.id);
          if (!existing) {
            selectedMenus.push(menu);
            sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
            alert(`Menu "${menu.name}" ditambahkan ke transaksi.`);
          } else {
            alert(`Menu "${menu.name}" sudah dipilih.`);
          }
        });
        card.appendChild(selectBtn);
      }

      menuListEl.appendChild(card);
    });
  }

  menuForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = menuIdInput.value;
    const name = menuNameInput.value.trim();
    const price = parseInt(menuPriceInput.value);
    const category = menuCategoryInput.value;

    if (!name || !price || !category) {
      alert('Semua field harus diisi dengan benar.');
      return;
    }

    if (id) {
      // Edit existing menu
      const index = menus.findIndex((m) => m.id === id);
      if (index !== -1) {
        menus[index] = { id, name, price, category };
      }
    } else {
      // Add new menu
      const newMenu = {
        id: Date.now().toString(),
        name,
        price,
        category,
      };
      menus.push(newMenu);
    }

    saveMenus();
    renderMenuList();
    menuForm.reset();
    menuIdInput.value = '';
    cancelEditBtn.classList.add('hidden');
  });

  cancelEditBtn?.addEventListener('click', () => {
    menuForm.reset();
    menuIdInput.value = '';
    cancelEditBtn.classList.add('hidden');
  });

  renderMenuList();
});
