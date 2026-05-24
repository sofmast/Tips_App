// AUTH CHECK

const isLoggedIn = localStorage.getItem("oxytipsAdminLoggedIn");

if(isLoggedIn !== "true"){
  window.location.href = "admin-login.html";
}

// SIDEBAR TOGGLE

const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("oxytipsAdminLoggedIn");

  window.location.href = "admin-login.html";

});