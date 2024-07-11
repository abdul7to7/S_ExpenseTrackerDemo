const server = "https://s-expense-tracker-demo-backend.vercel.app";

document.getElementById("signUpForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  const username = document.getElementById("signUpUsername").value;
  const mail = document.getElementById("signUpMail").value;
  const password = document.getElementById("signUpPassword").value;
  console.log(username, mail, password);
  fetch(`${server}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      mail: mail,
      password: password,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.suceess == false) {
        window.location.reload();
        //send msg here
        return;
      }
      localStorage.setItem("token", response.token);
      window.location.href = "./expenseForm.html";
    });
});
