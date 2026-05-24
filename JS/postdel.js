let posts = JSON.parse(localStorage.getItem("adminPosts")) || [];

/* SAVE POST */
function savePost(){

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const category = document.getElementById("category").value;

  const imageFile = document.getElementById("imageInput").files[0];
  const videoFile = document.getElementById("videoInput").files[0];

  if(!title || !content || !category){
    alert("Please fill all required fields.");
    return;
  }

  const post = {
    id: Date.now(),
    title,
    content,
    category,
    image:"",
    video:"",
    PostStatus:"Ok",
    createdAt:new Date().toLocaleString()

  };

  /* HANDLE IMAGE */
  if(imageFile){

    const reader = new FileReader();

    reader.onload = function(e){
      post.image = e.target.result;

      handleVideo(post, videoFile);
    };

    reader.readAsDataURL(imageFile);

  }else{
    handleVideo(post, videoFile);
  }
}

/* HANDLE VIDEO */
function handleVideo(post, videoFile){

  if(videoFile){

    const reader = new FileReader();

    reader.onload = function(e){
      post.video = e.target.result;

      finalizePost(post);
    };

    reader.readAsDataURL(videoFile);

  }else{
    finalizePost(post);
  }
}

/* FINALIZE SAVE */
function finalizePost(post){

  posts.unshift(post);

  localStorage.setItem(
    "adminPosts",
    JSON.stringify(posts)
  );

  renderPosts();
  renderMedia();
  clearForm();

  alert("Post published successfully!");
}

/* RENDER POSTS */
function renderPosts(){

  const container =
    document.getElementById("postsContainer");

  const postCount =
    document.getElementById("postCount");

  container.innerHTML = "";

  postCount.textContent = posts.length;

  if(posts.length === 0){

    container.innerHTML = `
      <div class="empty">
        No posts available yet.
      </div>
    `;

    return;
  }

  posts.forEach(post => {

    const card = document.createElement("div");
    card.className = "post-card";
     if(post.PostStatus!== 'Ok'){
        return;
     }
    card.innerHTML = `
      ${
        post.image
        ? `<img src="${post.image}" class="post-image">`
        : `<div class="post-image"></div>`
      }

      <div class="post-content">

        <span class="post-category">
          Oxytips App
        </span>
        <div class="othaheda">
          <p>   
        <img src="images/newlogo.jpg" class="post-image">
          </p>

        <h2 class="post-title">
         
        </h3>
        </div>
        <p class="post-text">
          ${post.content}
        </p>

        ${
          post.video
          ? `
            <video controls class="post-video">
              <source src="${post.video}" type="video/mp4">
            </video>
          `
          : ""
        }

        <br><br>

        <small>
          Published: ${post.createdAt}
        </small>

        <br><br>
        <button class="delete-btn"
          onclick="deletePost(${post.id})">
          Delete
        </button>

      </div>
    `;

    container.appendChild(card);
  });
  }


/* MEDIA LIBRARY */
function renderMedia(){

  const mediaGrid =
    document.getElementById("mediaGrid");

  const mediaCount =
    document.getElementById("mediaCount");

  mediaGrid.innerHTML = "";

  let count = 0;

  posts.forEach(post => {

    if(post.image){

      count++;

      mediaGrid.innerHTML += `
        <img src="${post.image}">
      `;
    }

    if(post.video){

      count++;

      mediaGrid.innerHTML += `
        <video controls>
          <source src="${post.video}" type="video/mp4">
        </video>
      `;
    }
  });

  mediaCount.textContent = count;

  if(count === 0){

    mediaGrid.innerHTML = `
      <div class="empty">
        No media uploaded yet.
      </div>
    `;
  }
}

/* DELETE POST */
function deletePost(id){

  if(confirm("Delete this post?")){

    posts = posts.filter(post => post.id !== id);

    localStorage.setItem(
      "adminPosts",
      JSON.stringify(posts)
    );

    renderPosts();
    renderMedia();
  }
}

/* CLEAR FORM */
function clearForm(){

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("category").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("videoInput").value = "";
}

/* INITIAL LOAD */
renderPosts();
renderMedia();