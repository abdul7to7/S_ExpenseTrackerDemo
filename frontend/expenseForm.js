document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:4000/expense/get_expenses", {
    headers: {
      token: localStorage.getItem("token"),
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      const expenseListNode = document.getElementById("expense-list");
      data.expenses.forEach((expense) => {
        let amountTextNode = document.createTextNode(expense.amount);
        let descriptionTextNode = document.createTextNode(expense.description);
        let categoryTextNode = document.createTextNode(expense.category);
        let liNode = document.createElement("li");
        let buttonText = document.createTextNode("Delete");
        let buttonNode = document.createElement("button");
        buttonNode.setAttribute("expense_id", expense.id);
        buttonNode.appendChild(buttonText);
        liNode.appendChild(amountTextNode);
        liNode.appendChild(document.createTextNode(" || "));
        liNode.appendChild(descriptionTextNode);
        liNode.appendChild(document.createTextNode(" || "));
        liNode.appendChild(categoryTextNode);
        liNode.appendChild(document.createTextNode(" "));
        liNode.appendChild(buttonNode);
        expenseListNode.appendChild(liNode);
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

document.getElementById("expenseForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  const expenseAmount = document.getElementById("expenseAmount").value;
  const expenseDesc = document.getElementById("expenseDesc").value;
  const expenseCat = document.getElementById("expenseCat").value;
  console.log(expenseDesc);
  fetch("http://localhost:4000/expense/add_expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      amount: expenseAmount,
      description: expenseDesc,
      category: expenseCat,
    }),
  }).then((response) => {
    window.location.reload();
  });
});

document.getElementById("expense-list").addEventListener("click", (e) => {
  e.preventDefault();
  expense_id = e.target.getAttribute("expense_id");
  if (expense_id) {
    fetch(`http://localhost:4000/expense/delete_expense/${expense_id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    }).then(() => {
      window.location.reload();
    });
  }
});
