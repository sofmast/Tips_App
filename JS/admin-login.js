
const adminCredentials = {
  username: "O2tips",
  password: "admin1996@oxytips"
};

const loginForm = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");

// SHOW / HIDE PASSWORD

togglePassword.addEventListener("click", () => {

  if(password.type === "password"){
    password.type = "text";
    togglePassword.textContent = "Hide";
  }else{
    password.type = "password";
    togglePassword.textContent = "Show";
  }

});

// LOGIN AUTHENTICATION

loginForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const enteredUsername = username.value.trim();
  const enteredPassword = password.value.trim();

  if(
    enteredUsername === adminCredentials.username &&
    enteredPassword === adminCredentials.password
  ){

    message.textContent = "Login successful. Redirecting...";
    message.className = "message success";

    // STORE SESSION
    localStorage.setItem("oxytipsAdminLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "adminDboard.html";
    }, 1500);

  }else{

    message.textContent = "Invalid username or password.";
    message.className = "message error";

  }

});