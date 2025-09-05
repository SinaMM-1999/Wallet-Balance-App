// // <!DOCTYPE html>
// // <html lang="fa" dir="rtl">
// // <head>
// //   <meta charset="utf-8" />
// //   <meta name="viewport" content="width=device-width,initial-scale=1" />
// //   <title>لیست تراکنش‌ها</title>
// //   <!-- Bootstrap 5 -->
// //   <link rel="stylesheet"
// //         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
// // </head>
// // <body class="bg-dark text-light">

// //   <div class="container py-4">
// //     <div class="d-flex justify-content-between align-items-center mb-3">
// //       <h3 class="m-0">لیست تراکنش‌ها</h3>
// //       <div class="d-flex gap-2">
// //         <a href="./index.html" class="btn btn-outline-info">بازگشت</a>
// //         <button id="clearAllBtn" class="btn btn-outline-danger">پاک‌کردن همه</button>
// //       </div>
// //     </div>

// //     <div class="table-responsive">
// //       <table class="table table-dark table-striped table-hover align-middle mb-0">
// //         <thead class="table-secondary text-dark">
// //           <tr>
// //             <th style="width: 72px">#</th>
// //             <th>تاریخ</th>
// //             <th>مبلغ</th>
// //             <th>توضیحات</th>
// //             <th>نوع</th>
// //           </tr>
// //         </thead>
// //         <tbody id="transactionBody"></tbody>
// //       </table>
// //     </div>

// //     <!-- پیام خالی بودن -->
// //     <div id="emptyState" class="text-center text-secondary py-5 d-none">
// //       هنوز تراکنشی ثبت نشده.
// //     </div>
// //   </div>

// //   <!-- Bootstrap Bundle -->
// //   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

// //   <!-- فایل اصلی پروژه (همین را در هر دو صفحه لود کن) -->
// //   <script src="./app.js"></script>

// //   <!-- اسکریپت‌های مخصوص همین صفحه -->
//   <script>
//     // اگر جدول خالی بود، پیام "هنوز تراکنشی ثبت نشده" را نشان بده
//     document.addEventListener('DOMContentLoaded', () => {
//       const data = JSON.parse(localStorage.getItem('transactions') || '[]');
//       const emptyState = document.getElementById('emptyState');
//       const hasRows = Array.isArray(data) && data.length > 0;
//       emptyState.classList.toggle('d-none', hasRows);
//     });

//     // پاک‌کردن همه تراکنش‌ها

//     const clearAllBtn = document.getElementById('clearAllBtn');
//     clearAllBtn.addEventListener('click', () => {
//       if (!confirm('همه تراکنش‌ها پاک شود؟')) return;
//       localStorage.removeItem('transactions');
//       // به‌روزرسانی وضعیت داخلی app.js
//       if (typeof transactionListItems !== 'undefined') {
//         transactionListItems = [];
//       }
//       // رندر مجدد اگر تابع موجود است
//       if (typeof renderTransactions === 'function') {
//         renderTransactions();
//       }
//       document.getElementById('emptyState').classList.remove('d-none');
//     });
//   </script>
// // </body>
// // </html>












