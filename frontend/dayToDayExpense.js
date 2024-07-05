document.addEventListener("DOMContentLoaded", async (e) => {
  document.getElementById("currentYear").textContent = new Date().getFullYear();
  const table = document.getElementById("mainTable");
  let td;
  let data = await getAllExpenses();
  let lastYear = 2000;
  let lastMonth = 1;
  let total = 0;
  data.expenses.forEach((expense) => {
    addExpenseToUI(expense);
    total += expense.amount;
  });
  console.log(lastMonth, lastYear);
  const newRow = table.insertRow(-1);
  const newCell = newRow.insertCell(0);
  newCell.textContent = `Total Expenses = ${total}`;
  newCell.colSpan = table.rows[0].cells.length;
  newCell.classList.add("numbers");
  newRow.style.backgroundColor = "lightblue";
  console.log(data);
});

async function getAllExpenses() {
  let data = await fetch("http://localhost:4000/expense/get_expenses", {
    headers: {
      token: localStorage.getItem("token"),
    },
  });
  data = await data.json();
  return data;
}

function addExpenseToUI(expense) {
  let tr = document.createElement("tr");
  let tdAmount = document.createElement("td");
  let tdDescription = document.createElement("td");
  let tdCategory = document.createElement("td");
  let tdDate = document.createElement("td");
  tdAmount.textContent = expense.amount;
  tdDescription.textContent = expense.description;
  tdCategory.textContent = expense.category;
  tdDate.textContent = expense.createdAt.substring(0, 10);
  tdDescription.classList.add("names");
  tdCategory.classList.add("names");
  tdDate.classList.add("names");
  tdAmount.classList.add("numbers");
  tr.appendChild(tdDate);
  tr.appendChild(tdDescription);
  tr.appendChild(tdCategory);
  tr.appendChild(tdAmount);
  const table = document.getElementById("mainTable");
  table.appendChild(tr);
}
