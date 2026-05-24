const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

window.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove("active");
  }
});

window.addEventListener("resize", () => {
  if(window.innerWidth > 900){
    navLinks.classList.remove("active");
  }
});

year.textContent = new Date().getFullYear();