// app.js (اصلاح‌شده)
// ————————————————————————————
// خواندن اولیه از localStorage
let transactionListItems = JSON.parse(localStorage.getItem('transactions') || '[]');

// المنت‌ها (ممکنه توی بعضی صفحه‌ها وجود نداشته باشن)
const homeBtn = document.querySelector('#home');
const transactionsBtn = document.querySelector('#transaction');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionBody = document.getElementById('transactionBody');
const alertDismissible = document.querySelector('.alert-dismissible');
const totalBalanceEl = document.querySelector('#total-balance'); // span یا div در index.html
const incomePriceEl = document.getElementById('incomePrice'); // اگر در HTML موجود باشه
const expensePriceEl = document.getElementById('expense'); // در index.html احتمالاً همین id هست
const emptyStateEl = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAllBtn');

// ناوبری (اگر وجود داشتند)
if (homeBtn) {
  homeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
}
if (transactionsBtn) {
  transactionsBtn.addEventListener('click', () => { window.location.href = 'Transactions.html'; });
}

// کمک‌کننده‌ها
function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactionListItems));
}

function showAlert(message = '', type = 'danger', duration = 3000) {
  if (!alertDismissible) return;
  // type: 'danger' یا 'success'
  alertDismissible.classList.remove('d-none', 'alert-danger', 'alert-success');
  alertDismissible.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
  alertDismissible.innerText = message;
  setTimeout(() => {
    alertDismissible.classList.add('d-none');
  }, duration);
}

// نرمالایز نوع تراکنش (برای پوشش Income / income / Expence / expense / ... )
function normalizeType(raw) {
  if (!raw) return 'expense';
  const s = String(raw).trim().toLowerCase();
  if (s.includes('inc')) return 'income';
  if (s.includes('exp')) return 'expense';
  return s; // fallback
}

// افزودن تراکنش
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

  // پیام موفقیت
  showAlert('Transaction added successfully :)', 'success', 2000);

  clearInput();
}

function clearInput() {
  const descEl = document.querySelector('textarea[placeholder="Description"]');
  const amountEl = document.querySelector('input[placeholder="Enter price(Seperate Numbers with (.))"]');
  if (descEl) descEl.value = '';
  if (amountEl) amountEl.value = '';
}

// رندر جدول تراکنش‌ها
function renderTransactions() {
  if (!transactionBody) return;
  transactionBody.innerHTML = '';

  if (!transactionListItems || transactionListItems.length === 0) {
    if (emptyStateEl) emptyStateEl.classList.remove('d-none');
    return;
  } else {
    if (emptyStateEl) emptyStateEl.classList.add('d-none');
  }

  transactionListItems.forEach((item, idx) => {
    const row = document.createElement('tr');

    // رنگ سفارشی (سبز برای income، قرمز برای expense)
    if (item.type === 'income') {
      row.style.backgroundColor = '#198754';
      row.style.color = '#fff';
    } else if (item.type === 'expense') {
      row.style.backgroundColor = '#dc3545';
      row.style.color = '#fff';
    } else {
      row.style.backgroundColor = 'transparent';
      row.style.color = 'inherit';
    }

    row.innerHTML = `
      <th scope="row">${idx + 1}</th>
      <td>${item.amountPrice}</td>
      <td>${item.description}</td>
      <td>${escapeHtml(item.date)}</td>
    `;

    transactionBody.appendChild(row);
  });
}

// محاسبه و نمایش مجموع‌ها
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

  // اگر یک span ساده داری، مقدار را داخلش قرار بده
  totalBalanceEl.textContent = balance;

  // اگر spanهای جدا برای income/expense وجود دارند، پرشان کن
  if (incomePriceEl) incomePriceEl.textContent = totalIncome;
  if (expensePriceEl) expensePriceEl.textContent = totalExpense;
}

// پاک‌کردن همه تراکنش‌ها
function clearAllTransactions() {
  if (!confirm('Would you like CLEAR all Transactions ???')) return;
  transactionListItems = [];
  saveToLocalStorage();
  renderTransactions();
  renderTotalPrice();
  if (emptyStateEl) emptyStateEl.classList.remove('d-none');
  showAlert('All transactions cleared.', 'success', 1500);
}

// محافظت از محتوای ورودی در نمایش (اختیاری)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// هندل کردن clearAllBtn (در صورتی که وجود داشته باشد)
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', clearAllTransactions);
}

// هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
  // رندر اولیه
  renderTransactions();
  renderTotalPrice();

  // بایند دکمه افزودن اگر وجود داشته باشد
  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', addTransactionToList);
  }
});
