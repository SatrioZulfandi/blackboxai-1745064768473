// Transaction handling script

document.addEventListener('DOMContentLoaded', () => {
  const userRole = sessionStorage.getItem('userRole');
  const transactionTableBody = document.getElementById('transactionTableBody');
  const totalPriceEl = document.getElementById('totalPrice');
  const printBtn = document.getElementById('printBtn');

  let selectedMenus = JSON.parse(sessionStorage.getItem('selectedMenus')) || [];

  // Add quantity property if not present
  selectedMenus = selectedMenus.map(menu => ({ ...menu, quantity: menu.quantity || 1 }));

  function renderTransactionTable() {
    transactionTableBody.innerHTML = '';
    if (selectedMenus.length === 0) {
      transactionTableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-gray-600">Belum ada menu yang dipilih.</td></tr>';
      totalPriceEl.textContent = '0';
      return;
    }
    let total = 0;
    selectedMenus.forEach((menu, index) => {
      const subtotal = menu.price * menu.quantity;
      total += subtotal;

      const tr = document.createElement('tr');

      const nameTd = document.createElement('td');
      nameTd.className = 'p-2';
      nameTd.textContent = menu.name;

      const priceTd = document.createElement('td');
      priceTd.className = 'p-2';
      priceTd.textContent = `Rp ${menu.price.toLocaleString()}`;

      const quantityTd = document.createElement('td');
      quantityTd.className = 'p-2';
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.min = '1';
      quantityInput.value = menu.quantity;
      quantityInput.className = 'w-16 border border-gray-300 rounded px-2 py-1';
      quantityInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val < 1 || isNaN(val)) {
          e.target.value = menu.quantity;
          return;
        }
        selectedMenus[index].quantity = val;
        sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
        renderTransactionTable();
      });
      quantityTd.appendChild(quantityInput);

      const subtotalTd = document.createElement('td');
      subtotalTd.className = 'p-2';
      subtotalTd.textContent = `Rp ${subtotal.toLocaleString()}`;

      const actionTd = document.createElement('td');
      actionTd.className = 'p-2';
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Hapus';
      removeBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded';
      removeBtn.addEventListener('click', () => {
        selectedMenus.splice(index, 1);
        sessionStorage.setItem('selectedMenus', JSON.stringify(selectedMenus));
        renderTransactionTable();
      });
      actionTd.appendChild(removeBtn);

      tr.appendChild(nameTd);
      tr.appendChild(priceTd);
      tr.appendChild(quantityTd);
      tr.appendChild(subtotalTd);
      tr.appendChild(actionTd);

      transactionTableBody.appendChild(tr);
    });
    totalPriceEl.textContent = total.toLocaleString();
  }

  printBtn.addEventListener('click', () => {
    if (selectedMenus.length === 0) {
      alert('Tidak ada transaksi untuk dicetak.');
      return;
    }
    let printContent = '<h2>Nota Transaksi</h2><table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse;">';
    printContent += '<tr><th>Nama Menu</th><th>Harga</th><th>Jumlah</th><th>Subtotal</th></tr>';
    let total = 0;
    selectedMenus.forEach(menu => {
      const subtotal = menu.price * menu.quantity;
      total += subtotal;
      printContent += `<tr><td>${menu.name}</td><td>Rp ${menu.price.toLocaleString()}</td><td>${menu.quantity}</td><td>Rp ${subtotal.toLocaleString()}</td></tr>`;
    });
    printContent += `<tr><td colspan="3" style="text-align:right;"><strong>Total</strong></td><td><strong>Rp ${total.toLocaleString()}</strong></td></tr>`;
    printContent += '</table>';

    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><head><title>Nota Transaksi</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });

  renderTransactionTable();
});
