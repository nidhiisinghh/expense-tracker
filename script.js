let expenses = [];
let totalBalance = 0;

const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseModal = document.getElementById('expenseModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalBalanceElement = document.getElementById('totalBalance');
const generateQRCodeBtn = document.getElementById('generateQRCodeBtn');
const upiIdInput = document.getElementById('upiId');
const qrCodeContainer = document.getElementById('qrCodeContainer');

if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));
    totalBalance = parseFloat(localStorage.getItem('totalBalance'));
    updateExpenseList();
    totalBalanceElement.textContent = totalBalance.toFixed(2);
}

addExpenseBtn.addEventListener('click', () => {
    expenseModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    expenseModal.style.display = 'none';
});

expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('expenseTitle').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    const expense = { title, amount, category };
    expenses.push(expense);
    totalBalance += amount;
    
    updateExpenseList();
    totalBalanceElement.textContent = totalBalance.toFixed(2);

    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('totalBalance', totalBalance.toFixed(2));

    expenseModal.style.display = 'none';
    expenseForm.reset();
});

function updateExpenseList() {
    expenseList.innerHTML = ''; 

    if (expenses.length === 0) {
        const noExpensesMessage = document.createElement('li');
        noExpensesMessage.textContent = "No expenses recorded.";
        expenseList.appendChild(noExpensesMessage);
    } else {
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.classList.add('expense-item');
            li.innerHTML = `
                <span class="expense-title">${expense.title}</span> - 
                <span class="expense-amount">₹${expense.amount.toFixed(2)}</span> 
                <span class="expense-category">(${expense.category})</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            expenseList.appendChild(li);
        });

        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                totalBalance -= expenses[index].amount;
                expenses.splice(index, 1); 
                updateExpenseList(); 
                totalBalanceElement.textContent = totalBalance.toFixed(2);

                localStorage.setItem('expenses', JSON.stringify(expenses));
                localStorage.setItem('totalBalance', totalBalance.toFixed(2));
            });
        });
    }
}

generateQRCodeBtn.addEventListener('click', () => {
    const upiId = upiIdInput.value;
    if (upiId) {
        if (totalBalance > 0) {
            const upiLink = `upi://pay?pa=${upiId}&pn=ExpenseTracker&mc=1234&tid=202112345678&am=${totalBalance.toFixed(2)}&cu=INR&url=http://www.expensetracker.com`;
            const qrCode = generateQRCode(upiLink);
            qrCodeContainer.innerHTML = '';
            qrCodeContainer.appendChild(qrCode);
        } else {
            Swal.fire('Total balance is zero', 'Add expenses to generate a QR code for payment.', 'warning');
        }
    } else {
        Swal.fire('Invalid UPI ID', 'Please enter a valid UPI ID.', 'error');
    }
});

function generateQRCode(data) {
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;
    return img;
}