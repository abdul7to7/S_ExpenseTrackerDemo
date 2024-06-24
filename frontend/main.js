document.getElementById("signUpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  const username = document.getElementById("signUpUsername").value;
  const mail = document.getElementById("signUpMail").value;
  const password = document.getElementById("signUpPassword").value;
  console.log(username, mail, password);
  fetch("http://localhost:4000/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      mail: mail,
      password: password,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response is not Okay");
    }
    console.log(response);
  });
});

document.addEventListener("DOMContentLoaded", () => {});
