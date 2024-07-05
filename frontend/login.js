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
      return response.json();
    })
    .then((response) => {
      if (response.success == false) {
        // window.location.href = "./login.html";
        // add msg to ui here
        return;
      }
      localStorage.setItem("token", response.token);
      window.location.href = "./expenseForm.html";
    });
});

document.getElementById("forgot-password").addEventListener("click", () => {
  document.getElementById("forgot-password-form").style.display = "block";
});

document
  .getElementById("forgot-password-form")
  ?.addEventListener("submit", (e) => {
    e.preventDefault();
    const mail = document.getElementById("forgot-password-mail").value;
    fetch("http://localhost:4000/user/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: mail,
      }),
    });
    console.log(mail);
  });
