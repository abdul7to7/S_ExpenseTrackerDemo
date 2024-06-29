//Dom Loading expenses
document.addEventListener("DOMContentLoaded", async () => {
  let data = await getAllExpenses();
  if (data) {
    data.expenses.forEach((expense) => {
      addExpenseToUI(expense);
    });
  }
});

//adding an expense
document
  .getElementById("expenseForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("button clicked");
    const amount = document.getElementById("expenseAmount").value;
    const description = document.getElementById("expenseDesc").value;
    const category = document.getElementById("expenseCat").value;
    let response = await postExpense({ amount, description, category });
    if (response) {
      console.log(response.message);
      addExpenseToUI(response.expense);
    }
  });

//deleting an expense
document.getElementById("expense-list").addEventListener("click", async (e) => {
  e.preventDefault();
  expense_id = e.target.getAttribute("expense_id");
  let response;
  if (expense_id) {
    response = await deleteExpense(expense_id);
  }
  if (response) {
    //delete from UI
    console.log(response.message);
    removeFromUI(e.target);
  }
});

document
  .getElementById("buy-premium-btn")
  .addEventListener("click", async (e) => {
    let response = await fetch("http://localhost:4000/purchase/buymembership", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    response = await response.json();
    console.log(response);
    let options = {
      key: response.key_id,
      order_id: response.order.id,
      handler: function (response) {
        fetch("http://localhost:4000/purchase/verifyPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(response);
            alert(data.message);
          });
      },
    };
    let rzp_c = new Razorpay(options);
    rzp_c.open();
    e.preventDefault();
    rzp_c.on("payment.failed", (response) => {
      console.log(response);
      alert("Something went wrong");
    });
  });

function addExpenseToUI(expense) {
  const expenseListNode = document.getElementById("expense-list");

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
}

function removeFromUI(targetElement) {
  let parent = targetElement.parentNode.parentNode;
  parent.removeChild(targetElement.parentNode);
}

async function postExpense(expense) {
  try {
    let response = await fetch("http://localhost:4000/expense/add_expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
      }),
    });
    response = await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getAllExpenses() {
  try {
    let response = await fetch("http://localhost:4000/expense/get_expenses", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    response = await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function deleteExpense(id) {
  try {
    let response = await fetch(
      `http://localhost:4000/expense/delete_expense/${id}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    response = await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
}
