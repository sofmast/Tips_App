/* =========================
   MENU
========================= */

const menuBtn =
document.getElementById("menuBtn");

const sidebar =
document.getElementById("sidebar");

menuBtn.onclick = ()=>{

    sidebar.classList.toggle("active");

};

/* =========================
   STORAGE
========================= */

let users =
JSON.parse(
localStorage.getItem("oxytipsUsers")
) || [];

const posts =
JSON.parse(
localStorage.getItem("oxytipsPosts")
) || [];

const currentUser =
JSON.parse(
localStorage.getItem("loggedInUser")
);

/* =========================
   ADMIN INFO
========================= */

if(currentUser){

    document.getElementById("adminName")
    .innerText =
    currentUser.fullName;

    document.getElementById("adminImage")
    .src =
    currentUser.profileImage ||
    "images/default-user.png";
}

/* =========================
   STATS
========================= */

function updateStats(){

    document.getElementById("totalUsers")
    .innerText = users.length;

    document.getElementById("totalPosts")
    .innerText = posts.length;

    document.getElementById("activeUsers")
    .innerText = users.length;
}

updateStats();

/* =========================
   ELEMENTS
========================= */

const usersTableBody =
document.getElementById("usersTableBody");

const mobileUsers =
document.getElementById("mobileUsers");

const searchInput =
document.getElementById("searchInput");

const modal =
document.getElementById("userModal");

const openModal =
document.getElementById("openModal");

const closeModal =
document.getElementById("closeModal");

const userForm =
document.getElementById("userForm");

const modalTitle =
document.getElementById("modalTitle");

const imageInput =
document.getElementById("profileImageFile");

const imagePreview =
document.getElementById("imagePreview");

/* =========================
   VARIABLES
========================= */

let editIndex = null;
let profileBase64 = "";

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", ()=>{

    renderUsers(searchInput.value);

});

/* =========================
   IMAGE PREVIEW
========================= */

imageInput.addEventListener(
"change",
function(){

    const file = this.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(e){

        profileBase64 =
        e.target.result;

        imagePreview.innerHTML = `
            <img src="${profileBase64}">
        `;
    };

    reader.readAsDataURL(file);
});

/* =========================
   RENDER USERS
========================= */

function renderUsers(search=""){

    usersTableBody.innerHTML = "";
    mobileUsers.innerHTML = "";

    const filteredUsers =
    users.filter(user=>{

        const userData = `
            ${user.fullName}
            ${user.email}
            ${user.profession}
        `.toLowerCase();

        return userData.includes(
            search.toLowerCase()
        );
    });

    filteredUsers.forEach((user,index)=>{

        /* DESKTOP */

        usersTableBody.innerHTML += `

        <tr>

            <td>

                <div class="user">

                    <img
                    src="${
                        user.profileImage ||
                        'images/default-user.png'
                    }">

                    <div>

                        <h4>
                            ${user.fullName}
                        </h4>

                    </div>

                </div>

            </td>

            <td>${user.email}</td>

            <td>
                ${
                    user.profession ||
                    'Healthcare Professional'
                }
            </td>

            <td>

                <span class="status">
                    Active
                </span>

            </td>

            <td>

                <div class="action-btns">

                    <button
                    class="edit-btn"
                    onclick="editUser(${index})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                    class="delete-btn"
                    onclick="deleteUser(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>
        `;

        /* MOBILE */

        mobileUsers.innerHTML += `

        <div class="mobile-card">

            <div class="mobile-top">

                <img
                src="${
                    user.profileImage ||
                    'images/default-user.png'
                }">

                <div>

                    <h4>
                        ${user.fullName}
                    </h4>

                    <p>
                        ${
                            user.profession ||
                            'Healthcare Professional'
                        }
                    </p>

                </div>

            </div>

            <div class="mobile-meta">

                <div class="meta">

                    <span>Email</span>

                    <strong>
                        ${user.email}
                    </strong>

                </div>

            </div>

            <div class="mobile-actions">

                <button
                class="edit-btn"
                onclick="editUser(${index})">

                    Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteUser(${index})">

                    Delete

                </button>

            </div>

        </div>
        `;
    });

    updateStats();
}

renderUsers();

/* =========================
   MODAL
========================= */

openModal.onclick = ()=>{

    window.location.href='signup.html';

    modalTitle.innerText =
    "Add User";

    userForm.reset();

    profileBase64 = "";

    editIndex = null;

    imagePreview.innerHTML = `
        <div class="preview-placeholder">
            Image Preview
        </div>
    `;
};

closeModal.onclick = ()=>{

    modal.classList.remove("active");

};

window.onclick = (e)=>{

    if(e.target === modal){

        modal.classList.remove("active");
    }
};

/* =========================
   SAVE USER
========================= */

userForm.addEventListener(
"submit",
(e)=>{

    e.preventDefault();

    const userData = {

        fullName:
        document.getElementById("fullName").value,

        email:
        document.getElementById("email").value,

        profession:
        document.getElementById("profession").value,

        profileImage:
        profileBase64
    };

    if(editIndex === null){

        users.push(userData);

    }else{

        users[editIndex] =
        userData;
    }

    localStorage.setItem(
        "oxytipsUsers",
        JSON.stringify(users)
    );

    renderUsers();

    modal.classList.remove("active");

});

/* =========================
   EDIT USER
========================= */

function editUser(index){

    const user = users[index];

    document.getElementById("fullName")
    .value = user.fullName;

    document.getElementById("email")
    .value = user.email;

    document.getElementById("profession")
    .value =
    user.profession || "";

    profileBase64 =
    user.profileImage || "";

    if(profileBase64){

        imagePreview.innerHTML = `
            <img src="${profileBase64}">
        `;

    }else{

        imagePreview.innerHTML = `
            <div class="preview-placeholder">
                Image Preview
            </div>
        `;
    }

    editIndex = index;

    modalTitle.innerText =
    "Edit User";

    modal.classList.add("active");
}

/* =========================
   DELETE USER
========================= */

function deleteUser(index){

    const confirmDelete =
    confirm(
        "Delete this user?"
    );

    if(confirmDelete){

        users.splice(index,1);

        localStorage.setItem(
            "oxytipsUsers",
            JSON.stringify(users)
        );

        renderUsers();
    }
}

/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")
.addEventListener("click",(e)=>{

    e.preventDefault();

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
    "admin-login.html";
});