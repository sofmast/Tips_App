
/* MOBILE MENU */

const menuToggle =
document.getElementById("menuToggle");

const navLinks =
document.getElementById("navLinks");

menuToggle.addEventListener("click",(e)=>{

  e.stopPropagation();

  navLinks.classList.toggle("active");

});

/* CLOSE OUTSIDE */

document.addEventListener("click",(e)=>{

  const insideMenu =
  navLinks.contains(e.target);

  const menuBtn =
  menuToggle.contains(e.target);

  if(!insideMenu && !menuBtn){

    navLinks.classList.remove("active");

  }

});

/* CLOSE AFTER CLICKING LINK */

document
.querySelectorAll(".nav-links a")
.forEach(link=>{

  link.addEventListener("click",()=>{

    navLinks.classList.remove("active");

  });

});

/* POSTS */

let posts =
JSON.parse(
localStorage.getItem("adminPosts")
) || [];

function renderPosts(){

  const container =
  document.getElementById("postsContainer");

  container.innerHTML = "";

  if(posts.length === 0){

    container.innerHTML = `
      <div class="empty">
        No posts available yet.
      </div>
    `;

    return;
  }

  posts.forEach(post=>{

    const card =
    document.createElement("div");

    card.className = "post-card";

    card.innerHTML = `

      ${
        post.image
        ?
        `
        <img
        src="${post.image}"
        class="post-image">
        `
        :
        ``
      }

      <div class="post-content">

        <span class="post-badge">
          OxyTips Article
        </span>

        <p class="post-text">
          ${post.content}
        </p>

        ${
          post.video
          ?
          `
          <video controls class="post-video">
            <source
            src="${post.video}"
            type="video/mp4">
          </video>
          `
          :
          ""
        }

        <br><br>

        <small>
          Published:
          ${post.createdAt || "Recently"}
        </small>

      </div>

    `;

    container.appendChild(card);

  });

}

renderPosts();

/* DYNAMIC COPYRIGHT YEAR */

document.getElementById("year").textContent =
new Date().getFullYear();
