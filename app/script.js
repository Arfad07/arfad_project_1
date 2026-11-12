
// Get HTML elements
const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");
const transactionForm = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");


// Load saved transactions
let transactions = [];

try {
    transactions = JSON.parse(
        localStorage.getItem("spendwiseTransactions")
    ) || [];
} catch (error) {
    transactions = [];
}


// Set today's date
const today = new Date();

dateInput.value = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.getElementById("currentDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// Format amount in Indian Rupees
function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}


// Save transactions in browser
function saveTransactions() {
    localStorage.setItem(
        "spendwiseTransactions",
        JSON.stringify(transactions)
    );
}


// Update dashboard
function updateDashboard() {

    const income = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const balance = income - expense;

    balanceElement.textContent = formatMoney(balance);
    incomeElement.textContent = formatMoney(income);
    expenseElement.textContent = formatMoney(expense);

}


// Display transaction history
function displayTransactions() {

    transactionList.replaceChildren();

    if (transactions.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty";
        emptyMessage.textContent = "No transactions yet.";

        transactionList.appendChild(emptyMessage);
        return;
    }

    transactions.forEach(item => {

        const transaction = document.createElement("div");
        transaction.className = "transaction";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const heading = document.createElement("h3");
        heading.textContent = item.title;

        const date = document.createElement("p");
        date.textContent = item.date;

        info.append(heading, date);

        const right = document.createElement("div");
        right.className = "transaction-right";

        const amount = document.createElement("span");
        amount.className = "transaction-amount";

        const sign = item.type === "income" ? "+" : "-";

        amount.textContent = sign + formatMoney(item.amount);

        amount.style.color =
            item.type === "income" ? "#34d399" : "#fb7185";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTransaction(item.id);
        });

        right.append(amount, deleteButton);

        transaction.append(info, right);

        transactionList.appendChild(transaction);

    });

}


// Add new transaction
transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const date = dateInput.value;

    if (
        !title ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !date
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    const newTransaction = {
        id: crypto.randomUUID(),
        title: title,
        amount: amount,
        type: type,
        date: date
    };

    transactions.unshift(newTransaction);

    saveTransactions();

    updateDashboard();

    displayTransactions();

    transactionForm.reset();

    dateInput.value = today.toISOString().slice(0, 10);

});


// Delete transaction
function deleteTransaction(id) {

    transactions = transactions.filter(
        item => item.id !== id
    );

    saveTransactions();

    updateDashboard();

    displayTransactions();

}


// Start application
updateDashboard();
displayTransactions();
 