// Read Data From LocalStorage
let transactionListItems = JSON.parse(localStorage.getItem('transactions') || '[]');

const homeBtn = document.querySelector('#home');
const transactionsBtn = document.querySelector('#transaction');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionBody = document.getElementById('transactionBody');
const alertDismissible = document.querySelector('.alert-dismissible');
const areltMassage = document.querySelector('#alertmassage')
const totalBalanceEl = document.querySelector('#total-balance');
const incomePriceEl = document.getElementById('incomePrice');
const expensePriceEl = document.getElementById('expensePrice');
const emptyStateEl = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchBtn = document.querySelector('#searchBtn');
const todayDate = document.querySelector('#today-date');
const tableList = document.querySelector('#tableList');
const modalTransactionBody = document.getElementById('modalTransactionBody');

// Showing ToDay Date
function updateDateEveryDay() {
    if (!todayDate) return;
    let now = new Date();
    let showNewDate = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    todayDate.innerHTML = `${showNewDate}`;
}
updateDateEveryDay();

// Nav Links
if (homeBtn) homeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
if (transactionsBtn) transactionsBtn.addEventListener('click', () => { window.location.href = 'Transactions.html'; });

// Saving To LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactionListItems));
}

// Show Alarm
function showAlert(message = '', type = 'danger', duration = 3000) {
    if (!alertDismissible) return;
    areltMassage.innerHTML = message
    alertDismissible.classList.remove('d-none', 'alert-danger', 'alert-success');
    alertDismissible.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
    setTimeout(() => {
        alertDismissible.classList.add('d-none');
    }, duration);
}

// Normalize Transactions
function normalizeType(raw) {
    if (!raw) return 'expense';
    const s = String(raw).trim().toLowerCase();
    if (s.includes('inc')) return 'income';
    if (s.includes('exp')) return 'expense';
    return s;
}

// Add Transactions
function addTransactionToList(e) {
    e?.preventDefault?.();

    const descEl = document.querySelector('textarea[placeholder="Description"]');
    const amountEl = document.querySelector('input[placeholder="Enter price(Seperate Numbers with (.))"]');
    const typeEl = document.querySelector('select[name="select-cost"]');

    const description = (descEl?.value || '').trim();
    const amountPrice = parseFloat(amountEl?.value);
    const typeRaw = typeEl?.value || 'expense';
    const type = normalizeType(typeRaw);

    if (!description || Number.isNaN(amountPrice)) {
        showAlert('Please Enter valid desc & price !!', 'danger', 3000);
        return;
    }

    const transactionItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fa-IR'),
        amountPrice,
        description,
        type
    };

    transactionListItems.push(transactionItem);
    saveToLocalStorage();

    renderTransactions();
    renderTotalPrice();
    showAlert('Transaction added successfully :)', 'success', 2000);
    clearInput();
}

function clearInput() {
    const descEl = document.querySelector('textarea[placeholder="Description"]');
    const amountEl = document.querySelector('input[placeholder="Enter price(Seperate Numbers with (.))"]');
    if (descEl) descEl.value = '';
    if (amountEl) amountEl.value = '';
}

// Render Transactions
function renderTransactions() {
    if (transactionBody) transactionBody.innerHTML = '';
    if (modalTransactionBody) modalTransactionBody.innerHTML = '';

    if (!transactionListItems || transactionListItems.length === 0) {
        if (emptyStateEl) {
            emptyStateEl.classList.remove('d-none');
            if (tableList) tableList.classList.add('d-none');
            return;
        }
    } else {
        if (emptyStateEl) emptyStateEl.classList.add('d-none');
        if (tableList) tableList.classList.remove('d-none');
    }

    transactionListItems.forEach((item, idx) => {
        const row = document.createElement('tr');
        if (item.type === 'income') row.classList.add('table-success');
        else if (item.type === 'expense') row.classList.add('table-danger');

        row.innerHTML = `
            <th scope="row">${idx + 1}</th>
            <td>${item.amountPrice}</td>
            <td>${item.description}</td>
            <td>${escapeHtml(item.date)}</td>
        `;

        if (transactionBody) transactionBody.appendChild(row);
        if (modalTransactionBody) modalTransactionBody.appendChild(row.cloneNode(true));
    });
}

// Calculating & show Price / Balance 
function renderTotalPrice() {
    if (!totalBalanceEl) return;

    let totalIncome = 0;
    let totalExpense = 0;

    transactionListItems.forEach((item) => {
        const t = normalizeType(item.type);
        const amount = Number(item.amountPrice) || 0;
        if (t === 'income') totalIncome += amount;
        else totalExpense += amount;
    });

    const balance = totalIncome - totalExpense;
    totalBalanceEl.textContent = balance;
    if (incomePriceEl) incomePriceEl.textContent = totalIncome;
    if (expensePriceEl) expensePriceEl.textContent = totalExpense;

}
// Clear All Transactions
function clearAllTransactions() {
    if (!confirm('Would you like CLEAR all Transactions ???')) return;
    transactionListItems = [];
    saveToLocalStorage();
    renderTransactions();
    renderTotalPrice();
    if (emptyStateEl) emptyStateEl.classList.remove('d-none');
    showAlert('All transactions cleared.', 'success', 1500);
}

// Search & Show Modal
function searchBtnItems() {
    if (!modalTransactionBody) return;
    modalTransactionBody.innerHTML = '';

    const inputSearchElem = document.querySelector('#inputSearchElem');
    const query = (inputSearchElem?.value || '').toLowerCase().trim();
    if (!query) return;

    const filtered = transactionListItems.filter(
        (item) => item.description.toLowerCase().includes(query) || String(item.amountPrice).includes(query)
    );

    filtered.forEach((item, idx) => {
        const row = document.createElement('tr');
        if (item.type === 'income') row.classList.add('table-success');
        else if (item.type === 'expense') row.classList.add('table-danger');

        row.innerHTML = `
            <th scope="row">${idx + 1}</th>
            <td>${item.amountPrice}</td>
            <td>${item.description}</td>
            <td>${escapeHtml(item.date)}</td>
        `;

        modalTransactionBody.appendChild(row);
    });
    inputSearchElem.innerHTML = ''
}

// escape html (اختیاری)
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// EventListeners
if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllTransactions);
if (searchBtn) searchBtn.addEventListener('click', searchBtnItems);
if (addTransactionBtn) addTransactionBtn.addEventListener('click', addTransactionToList);

document.addEventListener('DOMContentLoaded', () => {
    renderTransactions();
    renderTotalPrice();
});

