document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  const mail = document.getElementById("loginMail").value;
  const password = document.getElementById("loginPassword").value;
  console.log(mail, password);
  fetch("http://localhost:4000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: mail,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        window.location.href = "/ExpenseTrackerDemo/frontend/login.html";
      }
      return response.json();
    })
    .then((response) => {
      localStorage.setItem("token", response.token);
      window.location.href = "/ExpenseTrackerDemo/frontend/expenseForm.html";
    });
});
