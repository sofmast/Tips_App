
const signinForm = document.getElementById("signinForm");
const message = document.getElementById("message");

signinForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value;

    const users = JSON.parse(localStorage.getItem("oxytipsUsers")) || [];

    const validUser = users.find(user =>
        user.email === email &&
        user.password === password
    );

    if(validUser){

        localStorage.setItem("loggedInUser",
        JSON.stringify(validUser));

        message.style.display = "block";
        message.className = "message success";
        message.innerHTML = "Login successful.";

        setTimeout(() => {

            window.location.href = "profile.html";

        }, 1200);

    }else{

        message.style.display = "block";
        message.className = "message error";
        message.innerHTML = "Invalid email or password.";
    }

});