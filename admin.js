// admin.js
// Handles: login, logout, publishing new posts with an image, listing/deleting posts

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const messageBox = document.getElementById("message");
const loginError = document.getElementById("loginError");
const imageFile = document.getElementById("imageFile");
const imagePreviewWrap = document.getElementById("imagePreviewWrap");
const imagePreview = document.getElementById("imagePreview");
const removeImageBtn = document.getElementById("removeImageBtn");

// Show a preview thumbnail when a file is chosen
imageFile.addEventListener("change", () => {
  const file = imageFile.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreviewWrap.classList.remove("hidden");
  }
});

// Clear the selected file when × is clicked
removeImageBtn.addEventListener("click", () => {
  imageFile.value = "";
  imagePreviewWrap.classList.add("hidden");
  imagePreview.src = "";
});



async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    showAdminPanel();
  } else {
    showLogin();
  }
}

function showAdminPanel() {
  loginSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
  loadPosts();
}

function showLogin() {
  loginSection.classList.remove("hidden");
  adminSection.classList.add("hidden");
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginError.textContent = "";

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = "Login failed: " + error.message;
  } else {
    showAdminPanel();
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

document.getElementById("submitPost").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const fileInput = document.getElementById("imageFile");
  const file = fileInput.files[0];

  if (!title || !description) {
    messageBox.textContent = "Please fill in both title and description.";
    return;
  }

  messageBox.textContent = "Publishing...";

  let imageUrl = null;

  if (file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabaseClient
      .storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
      messageBox.textContent = "Image upload failed: " + uploadError.message;
      return;
    }

    const { data: publicUrlData } = supabaseClient
      .storage
      .from("images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabaseClient
    .from("posts")
    .insert([{ title, description, image_url: imageUrl }]);

  if (insertError) {
    messageBox.textContent = "Error saving post: " + insertError.message;
  } else {
    messageBox.textContent = "Post published successfully!";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    fileInput.value = "";
    loadPosts();
  }
});

async function loadPosts() {
  const postsList = document.getElementById("postsList");
  postsList.innerHTML = "Loading...";

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    postsList.innerHTML = "Error loading posts.";
    return;
  }

  postsList.innerHTML = "";
  data.forEach((post) => {
    const div = document.createElement("div");
    div.className = "card glass-card post-admin-card";
    div.innerHTML = `
      ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : ""}
      <div class="post-info">
        <h4>${post.title}</h4>
        <p>${post.description}</p>
        <button data-id="${post.id}" class="delete-btn">Delete</button>
      </div>
    `;
    postsList.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      if (confirm("Delete this post?")) {
        await supabaseClient.from("posts").delete().eq("id", id);
        loadPosts();
      }
    });
  });
}

checkSession();