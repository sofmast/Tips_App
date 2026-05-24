/* FORM */

const signupForm =
document.getElementById("signupForm");

const message =
document.getElementById("message");

const profileImageInput =
document.getElementById("profileImage");

const imagePreview =
document.getElementById("imagePreview");

/* IMAGE VARIABLE */

let profileImageData =
"images/default-user.png";

/* IMAGE PREVIEW */

profileImageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        profileImageData = e.target.result;

        imagePreview.src = profileImageData;
    };

    reader.readAsDataURL(file);

});

/* SUBMIT */

signupForm.addEventListener("submit", function(e){

    e.preventDefault();

    /* VALUES */

    const fullName =
    document.getElementById("fullName")
    .value.trim();

    const profession =
    document.getElementById("profession")
    .value.trim();

    const email =
    document.getElementById("email")
    .value.trim();

    const location =
    document.getElementById("location")
    .value.trim();

    const password =
    document.getElementById("password")
    .value;

    /* USERS */

    let users =
    JSON.parse(
    localStorage.getItem("oxytipsUsers"))
    || [];

    /* CHECK USER */

    const existingUser =
    users.find(user =>
    user.email === email);

    if(existingUser){

        message.style.display = "block";

        message.className =
        "message error";

        message.innerHTML =
        "Account already exists with this email.";

        return;
    }

    /* USER DATA */

    const userData = {

        id: Date.now(),

        fullName,
        profession,
        email,
        location,
        password,

        profileImage:
        profileImageData,

        followers:0,
        following:0,
        posts:0
    };

    /* SAVE */

    users.push(userData);

    localStorage.setItem(
    "oxytipsUsers",
    JSON.stringify(users)
    );

    /* LOGIN USER */

    localStorage.setItem(
    "loggedInUser",
    JSON.stringify(userData)
    );

    /* SUCCESS */

    message.style.display = "block";

    message.className =
    "message success";

    message.innerHTML =
    "Account created successfully.";

    signupForm.reset();

    /* REDIRECT */

    setTimeout(() => {

        window.location.href =
        "profile.html";

    }, 1500);

});