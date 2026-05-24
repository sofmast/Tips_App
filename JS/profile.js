
/* =========================
   MOBILE MENU
========================= */

const menuToggle =
document.getElementById("menuToggle");

const mobileMenu =
document.getElementById("mobileMenu");

const closeMenu =
document.getElementById("closeMenu");

const overlay =
document.getElementById("overlay");

/* OPEN MENU */

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.add("active");

    overlay.classList.add("active");

});

/* CLOSE MENU */

function closeMobileMenu(){

    mobileMenu.classList.remove("active");

    overlay.classList.remove("active");
}

closeMenu.addEventListener("click", closeMobileMenu);

overlay.addEventListener("click", closeMobileMenu);

/* =========================
   GET CURRENT USER
========================= */

const currentUser =
JSON.parse(
localStorage.getItem("loggedInUser")
);

/* =========================
   CHECK LOGIN
========================= */

if(!currentUser){

    window.location.href = "siip.html";
}

/* =========================
   USER DATA
========================= */

const userData = {

    fullName:
    currentUser.fullName ||
    "Oxytips User",

    email:
    currentUser.email ||
    "No Email",

    profession:
    currentUser.profession ||
    "Healthcare Professional",

    location:
    currentUser.location ||
    "Lusaka, Zambia",

    profileImage:
    currentUser.profileImage ||
    "images/default-user.png",

    followers:
    currentUser.followers || 0,

    following:
    currentUser.following || 0,

    posts:
    currentUser.posts || 0
};

/* =========================
   SAFE IMAGE FUNCTION
========================= */

function setImage(element, imagePath){

    if(!element) return;

    element.src = imagePath;

    element.onerror = function(){

        this.src = "images/default-user.png";
    };
}

/* =========================
   HEADER USER
========================= */

const headerUserName =
document.getElementById("headerUserName");

const headerUserImage =
document.getElementById("headerUserImage");

headerUserName.textContent =
userData.fullName;

setImage(
headerUserImage,
userData.profileImage
);

/* =========================
   PROFILE CARD
========================= */

const profileName =
document.getElementById("profileName");

const profileRole =
document.getElementById("profileRole");

const profileAvatar =
document.getElementById("profileAvatar");

profileName.textContent =
userData.fullName;

profileRole.textContent =
userData.profession;

setImage(
profileAvatar,
userData.profileImage
);

/* =========================
   ABOUT SECTION
========================= */

document.getElementById("aboutProfession")
.textContent =
userData.profession;

document.getElementById("aboutEmail")
.textContent =
userData.email;

document.getElementById("aboutLocation")
.textContent =
userData.location;

/* =========================
   PROFILE STATS
========================= */

const statNumbers =
document.querySelectorAll(".stat-box h3");

if(statNumbers.length >= 3){

    statNumbers[0].textContent =
    userData.posts;

    statNumbers[1].textContent =
    userData.followers;

    statNumbers[2].textContent =
    userData.following;
}

/* =========================
   POSTS USER INFO
========================= */

const postUserNames =
document.querySelectorAll(".postUserName");

postUserNames.forEach(name => {

    name.textContent =
    userData.fullName;

});

const postUserImages =
document.querySelectorAll(".postUserImage");

postUserImages.forEach(image => {

    setImage(
    image,
    userData.profileImage
    );

});


/* =========================
   POSTS SYSTEM
========================= */

const postsContainer =
document.getElementById("postsContainer");

const publishPostBtn =
document.getElementById("publishPostBtn");

const postText =
document.getElementById("postText");

const postImageInput =
document.getElementById("postImageInput");

const postPreview =
document.getElementById("postPreview");

const createPostUserImage =
document.getElementById("createPostUserImage");

const createPostUserName =
document.getElementById("createPostUserName");

/* USER */

createPostUserName.textContent =
userData.fullName;

setImage(
createPostUserImage,
userData.profileImage
);

/* POSTS */

let posts =
JSON.parse(
localStorage.getItem("oxytipsPosts")
) || [];

/* IMAGE */

let selectedPostImage = "";

/* IMAGE PREVIEW */

postImageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        selectedPostImage =
        e.target.result;

        postPreview.src =
        selectedPostImage;

        postPreview.style.display =
        "block";
    };

    reader.readAsDataURL(file);

});

/* CREATE POST */

publishPostBtn.addEventListener("click", () => {

    const content =
    postText.value.trim();

    if(content === "" &&
       selectedPostImage === ""){

        alert(
        "Please write something or upload an image."
        );

        return;
    }

    /* NEW POST */

    const newPost = {

        id: Date.now(),

        author:
        userData.fullName,

        authorImage:
        userData.profileImage,

        profession:
        userData.profession,

        content,

        image:
        selectedPostImage,

        likes:0,
        comments:0,

        createdAt:
        new Date().toLocaleString()
    };

    /* SAVE */

    posts.unshift(newPost);

    localStorage.setItem(
    "oxytipsPosts",
    JSON.stringify(posts)
    );

    /* UPDATE USER POSTS */

    userData.posts += 1;

    currentUser.posts =
    userData.posts;

    localStorage.setItem(
    "loggedInUser",
    JSON.stringify(currentUser)
    );

    /* UPDATE USERS ARRAY */

    let users =
    JSON.parse(
    localStorage.getItem("oxytipsUsers")
    ) || [];

    users = users.map(user => {

        if(user.email === currentUser.email){

            return currentUser;
        }

        return user;
    });

    localStorage.setItem(
    "oxytipsUsers",
    JSON.stringify(users)
    );

    /* RESET */

    postText.value = "";

    postImageInput.value = "";

    selectedPostImage = "";

    postPreview.style.display = "none";

    /* RELOAD POSTS */

    renderPosts();

    updatePostCount();
});

/* =========================
   UPDATE POST COUNT
========================= */

function updatePostCount(){

    const statNumbers =
    document.querySelectorAll(".stat-box h3");

    if(statNumbers.length >= 1){

        statNumbers[0].textContent =
        userData.posts;
    }
}

/* =========================
   RENDER POSTS
========================= */

function renderPosts(){

    postsContainer.innerHTML = "";

    if(posts.length === 0){

        postsContainer.innerHTML = `

        <div class="post-box">

            <div class="post-content"
            style="text-align:center;">

                No posts available yet.

            </div>

        </div>
        `;

        return;
    }

    posts.forEach(post => {

        postsContainer.innerHTML += `

        <div class="post-box">

            <div class="post-top">

                <img
                src="${post.authorImage}"
                alt="User">

                <div class="post-user">

                    <h3>${post.author}</h3>

                    <p>${post.createdAt}</p>

                </div>

            </div>

            <div class="post-content">

                ${post.content}

            </div>

            ${post.image ? `

            <img
            src="${post.image}"
            class="post-image">

            ` : ""}

            <div class="post-actions">

                <button class="action-btn">

                    <i class="fa-regular fa-heart"></i>

                    Like (${post.likes})

                </button>

                <button class="action-btn">

                    <i class="fa-regular fa-comment"></i>

                    Comment (${post.comments})

                </button>

                <button class="action-btn">

                    <i class="fa-solid fa-share"></i>

                    Share

                </button>

            </div>

        </div>
        `;
    });

}

/* INITIAL RENDER */

renderPosts();

updatePostCount();



/* =========================
   LOGOUT
========================= */

const logoutButtons =
document.querySelectorAll(".logout-link");

logoutButtons.forEach(button => {

    button.addEventListener("click", function(e){

        e.preventDefault();

        /* REMOVE LOGIN */

        localStorage.removeItem(
        "loggedInUser"
        );

        /* REDIRECT */

        window.location.href =
        "index.html";

    });

});

/* =========================
   DEBUG
========================= */

console.log(
"Current User:",
currentUser
);
