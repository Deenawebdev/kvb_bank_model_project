let users = [];
let transactions = [];
let currentUser = null;
let currentBalance = 0;
let transactionAction = null;

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const mobile = document.getElementById('reg-mobile').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('reg-message').textContent = 'Passwords do not match.';
        return;
    }

    if (users.find(user => user.username === username)) {
        document.getElementById('reg-message').textContent = 'Username already exists.';
        return;
    }

    users.push({ username, email, mobile, password, role: 'user' });
    document.getElementById('reg-message').textContent = 'Registration successful!';
    showLogin();
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        if (user.role === 'admin') {
            showAdminDashboard();
        } else {
            showUserDashboard();
        }
    } else {
        document.getElementById('login-message').textContent = 'Invalid username or password.';
    }
});

document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('admin-login-username').value;
    const password = document.getElementById('admin-login-password').value;

    if (username === 'admin@deena' && password === 'deena2326') {
        showAdminDashboard();
    } else {
        document.getElementById('admin-login-message').textContent = 'Invalid admin credentials.';
    }
});

document.getElementById('loan-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const years = parseInt(document.getElementById('loan-years').value);
    const rate = parseFloat(document.getElementById('interest-rate').value) / 100;

    const monthlyInterest = rate / 12;
    const numberOfPayments = years * 12;

    const monthlyPayment = (amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    document.getElementById('loan-result').textContent = `Monthly Payment: $${monthlyPayment.toFixed(2)}, Total Payment: $${totalPayment.toFixed(2)}, Total Interest: $${totalInterest.toFixed(2)}`;
});

document.getElementById('deposit-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (transactionAction === 'withdraw') {
        alert('Please complete or cancel the withdraw action before making a deposit.');
        return;
    }
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    openPopup('Deposit', amount);
});

document.getElementById('withdraw-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (transactionAction === 'deposit') {
        alert('Please complete or cancel the deposit action before making a withdrawal.');
        return;
    }
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (amount > currentBalance) {
        alert('Insufficient funds.');
        return;
    }
    openPopup('Withdraw', amount);
});

document.getElementById('confirmation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const account = document.getElementById('confirm-account').value;
    const password = document.getElementById('confirm-password').value;

    const user = users.find(user => user.mobile === account && user.password === password);
    if (user) {
        if (transactionAction === 'Deposit') {
            currentBalance += parseFloat(document.getElementById('deposit-amount').value);
            transactions.push({ type: 'Deposit', amount: parseFloat(document.getElementById('deposit-amount').value) });
        } else if (transactionAction === 'Withdraw') {
            currentBalance -= parseFloat(document.getElementById('withdraw-amount').value);
            transactions.push({ type: 'Withdraw', amount: parseFloat(document.getElementById('withdraw-amount').value) });
        }
        updateStatement();
        document.getElementById('current-balance').textContent = currentBalance.toFixed(2);
        closePopup();
    } else {
        alert('Invalid account number or password.');
    }
});

function openPopup(action, amount) {
    document.getElementById('confirmation-message').textContent = `Are you sure you want to ${action} $${amount.toFixed(2)}?`;
    transactionAction = action;
    document.getElementById('confirmation-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    document.getElementById('confirmation-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    transactionAction = null;
}

function updateStatement() {
    const statementContent = transactions.map(transaction => `<p>${transaction.type}: $${transaction.amount.toFixed(2)}</p>`).join('');
    document.getElementById('statement-content').innerHTML = statementContent;
}

function showRegistration() {
    document.getElementById('registration').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
}

function showLogin() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'none';
}

function showAdminDashboard() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('user-dashboard').style.display = 'none';

    const userTableBody = document.getElementById('user-table').getElementsByTagName('tbody')[0];
    userTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.role}</td>
        </tr>
    `).join('');
}

function showUserDashboard() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';

    document.getElementById('user-account-number').textContent = currentUser.mobile;
    document.getElementById('current-balance').textContent = currentBalance.toFixed(2);
}

function clearUserTable() {
    document.getElementById('user-table').getElementsByTagName('tbody')[0].innerHTML = '';
}

function toggleStatement() {
    const statement = document.getElementById('statement');
    if (statement.style.display === 'none') {
        statement.style.display = 'block';
    } else {
        statement.style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    currentBalance = 0;
    transactions = [];
    document.getElementById('user-account-number').textContent = '';
    document.getElementById('current-balance').textContent = '0';
    document.getElementById('loan-result').textContent = '';
    showLogin();
}