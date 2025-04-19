// Sales report script

document.addEventListener('DOMContentLoaded', () => {
  const reportTableBody = document.getElementById('reportTableBody');
  const grandTotalEl = document.getElementById('grandTotal');
  const filterForm = document.getElementById('filterForm');

  // Sample transaction data stored in localStorage (simulate)
  // Each transaction: { date: 'YYYY-MM-DD', total: number }
  // For demo, we will aggregate from stored transactions in localStorage key 'transactions'
  // transactions is an array of { id, date, items: [{id, name, price, quantity}], total }

  function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  }

  function filterTransactions(startDate, endDate) {
    const transactions = getTransactions();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  }

  function aggregateByDate(transactions) {
    const map = {};
    transactions.forEach(t => {
      if (!map[t.date]) {
        map[t.date] = { count: 0, total: 0 };
      }
      map[t.date].count += 1;
      map[t.date].total += t.total;
    });
    return map;
  }

  function renderReport(dataMap) {
    reportTableBody.innerHTML = '';
    let grandTotal = 0;
    const dates = Object.keys(dataMap).sort();
    if (dates.length === 0) {
      reportTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-600">Tidak ada data transaksi.</td></tr>';
      grandTotalEl.textContent = '0';
      return;
    }
    dates.forEach(date => {
      const row = document.createElement('tr');
      const dateTd = document.createElement('td');
      dateTd.className = 'p-2';
      dateTd.textContent = date;

      const countTd = document.createElement('td');
      countTd.className = 'p-2';
      countTd.textContent = dataMap[date].count;

      const totalTd = document.createElement('td');
      totalTd.className = 'p-2';
      totalTd.textContent = dataMap[date].total.toLocaleString();

      row.appendChild(dateTd);
      row.appendChild(countTd);
      row.appendChild(totalTd);

      reportTableBody.appendChild(row);

      grandTotal += dataMap[date].total;
    });
    grandTotalEl.textContent = grandTotal.toLocaleString();
  }

  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    if (!startDateInput || !endDateInput) {
      alert('Harap isi tanggal mulai dan tanggal akhir.');
      return;
    }
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
    if (startDate > endDate) {
      alert('Tanggal mulai harus sebelum tanggal akhir.');
      return;
    }
    const filtered = filterTransactions(startDate, endDate);
    const aggregated = aggregateByDate(filtered);
    renderReport(aggregated);
  });

  // Initial render with last 7 days
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 7);
  document.getElementById('startDate').value = priorDate.toISOString().slice(0, 10);
  document.getElementById('endDate').value = today.toISOString().slice(0, 10);
  filterForm.dispatchEvent(new Event('submit'));
});
