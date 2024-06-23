document.getElementById("signUpButton").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("button clicked");
  const username = document.getElementById("signUpUsername");
  const mail = document.getElementById("signUpMail");
  const password = document.getElementById("signUpPassword");
  fetch("backend/user/signup", {
    method: "POST",
    body: {
      username: username,
      mail: mail,
      password: password,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response is not Okay");
    }
    console.log(response);
  });
});
