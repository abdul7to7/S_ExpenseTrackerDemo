//Dom Loading expenses
document.addEventListener("DOMContentLoaded", async () => {
  let data = await getAllExpenses();
  if (data && data.expenses) {
    data.expenses.forEach((expense) => {
      addExpenseToUI(expense);
    });
  }
  premiumUser(data.user.isPremium);
});

//adding an expense
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
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
    let newOrder = await fetch("http://localhost:4000/purchase/buymembership", {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    newOrder = await newOrder.json();
    console.log(newOrder);
    let options = {
      key: newOrder.key_id,
      order_id: newOrder.rzpOrder.id,
      handler: function (response) {
        fetch("http://localhost:4000/purchase/verifyPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            orderId: newOrder.orderId,
            rzpOrderId: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            alert(data.message);
            localStorage.setItem("token", data.token);
            premiumUser(data.user.isPremium);
          });
      },
    };
    let rzp_c = new Razorpay(options);
    rzp_c.open();
    rzp_c.on("payment.failed", (response) => {
      console.log(response);
      alert("Something went wrong");
    });
  });

document
  .getElementById("show-leaderboard-btn")
  ?.addEventListener("click", async () => {
    const leaderboardList = document.getElementById("leaderboard-list");
    while (leaderboardList.firstChild) {
      leaderboardList.removeChild(leaderboardList.firstChild);
    }
    let data = await getLeaderboard();
    data.usersWithExpenses.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.username} have total ${item.totalExpense} Expenses`;
      leaderboardList.append(li);
    });
    console.log(data);
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

function premiumUser(isPremium) {
  const premiumBtn = document.getElementById("buy-premium-btn");
  const premiumStatus = document.getElementById("premium");

  if (isPremium) {
    premiumBtn.style.display = "none";
    premiumStatus.style.display = "block";
  } else {
    premiumBtn.style.display = "block";
    premiumStatus.style.display = "none";
  }
}

async function getLeaderboard() {
  let data = await fetch("http://localhost:4000/expense/leaderboard", {
    headers: {
      token: localStorage.getItem("token"),
    },
  });
  data = await data.json();
  return data;
}
