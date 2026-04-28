const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", () => {
  const userInput = document.getElementById("user-input").value;
  const userPass = document.getElementById("user-pass").value;
  if (userInput === "admin" && userPass === "admin123") {
    alert("Login Successful");
  } else {
    alert("Enter the valid user & password");
  }
});
