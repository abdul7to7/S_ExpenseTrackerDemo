//Dom Loading expenses
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
  let data = await getExpensesForPage(1);
  if (data && data.expenses) {
    data.expenses.forEach((expense) => {
      addExpenseToUI(expense);
    });
  }
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const currentPageEl = document.getElementById("currentPage");
  currentPageEl.textContent = currentPage;
  if (currentPage == 1) prevBtn.disabled = true;
  else prevBtn.disabled = false;
  if (data.lastPage) nextBtn.disabled = true;
  else nextBtn.disabled = false;

  premiumUser(data.user.isPremium);
});

document.getElementById("btns").addEventListener("click", async (e) => {
  let data;

  if (e.target.classList.contains("prev")) {
    if (currentPage > 1) {
      data = await getExpensesForPage(--currentPage);
    }
  } else if (e.target.classList.contains("next")) {
    data = await getExpensesForPage(++currentPage);
  }
  if (data && data.expenses) {
    const expenseListNode = document.getElementById("expense-list");
    while (expenseListNode.childNodes.length > 0)
      expenseListNode.removeChild(expenseListNode.lastChild);
    data.expenses.forEach((expense) => {
      addExpenseToUI(expense);
    });
  }
  //btns prev and next
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (currentPage == 1) prevBtn.disabled = true;
  else prevBtn.disabled = false;
  if (data.lastPage) nextBtn.disabled = true;
  else nextBtn.disabled = false;
  const currentPageEl = document.getElementById("currentPage");
  currentPageEl.textContent = currentPage;
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
    const heading = document.createElement("li");
    heading.innerHTML = "<h3>Most Expenses</h3>";
    heading.style.marginBottom = "5px";
    leaderboardList.append(heading);
    // leaderboardList.append(document.createElement("hr"));
    let data = await getLeaderboard();
    data.usersWithExpenses.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${item.username}</b> have total <b>${item.totalExpense}</b> Expenses`;
      li.style.fontSize = "14px";
      leaderboardList.append(li);
    });
    console.log(data);
  });

document
  .getElementById("dayToDayExpenseBtn")
  ?.addEventListener("click", (e) => {
    document.location = "./dayToDayExpense.html";
  });

function addExpenseToUI(expense) {
  const expenseListNode = document.getElementById("expense-list");

  let amountTextNode = document.createTextNode(expense.amount);
  let descriptionTextNode = document.createTextNode(expense.description);
  let categoryTextNode = document.createTextNode(expense.category);
  let liNode = document.createElement("li");
  liNode.classList.add("expense-item");
  let buttonText = document.createTextNode("Delete");
  let buttonNode = document.createElement("button");
  buttonNode.classList.add("btn", "delete-btn");
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

async function getExpensesForPage(page) {
  try {
    let response = await fetch(
      `http://localhost:4000/expense/get_expenses/${page}`,
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
    premiumStatus.style.display = "flex";
  } else {
    premiumBtn.style.display = "flex";
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
