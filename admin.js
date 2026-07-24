// admin.js
const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const messageBox = document.getElementById("message");
const loginError = document.getElementById("loginError");

const imageFile = document.getElementById("imageFile");
const imagePreviewWrap = document.getElementById("imagePreviewWrap");

let selectedFiles = [];

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) { showAdminPanel(); } else { showLogin(); }
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
  if (error) { loginError.textContent = "Login failed: " + error.message; }
  else { showAdminPanel(); }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showLogin();
});

// Handle picking photos - builds our own list so we can remove individual ones
imageFile.addEventListener("change", () => {
  selectedFiles = Array.from(imageFile.files);
  renderPreviews();
});

function renderPreviews() {
  imagePreviewWrap.innerHTML = "";
  selectedFiles.forEach((file, index) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative; display:inline-block;";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.cssText = "width:90px; height:90px; object-fit:cover; border-radius:10px; display:block;";

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "×";
    removeBtn.style.cssText = "position:absolute; top:-6px; right:-6px; background:#ff4d4d; color:white; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold; font-size:14px;";
    removeBtn.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderPreviews();
    });

    wrap.appendChild(img);
    wrap.appendChild(removeBtn);
    imagePreviewWrap.appendChild(wrap);
  });
}

// PUBLISH NEW POST (supports multiple images)
document.getElementById("submitPost").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description) {
    messageBox.textContent = "Please fill in both title and description.";
    return;
  }

  messageBox.textContent = "Publishing...";

  let imageUrls = [];

  for (const file of selectedFiles) {
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabaseClient.storage.from("images").upload(fileName, file);
    if (uploadError) {
      messageBox.textContent = "Image upload failed: " + uploadError.message;
      return;
    }
    const { data: publicUrlData } = supabaseClient.storage.from("images").getPublicUrl(fileName);
    imageUrls.push(publicUrlData.publicUrl);
  }

  const { error: insertError } = await supabaseClient
    .from("posts")
    .insert([{ title, description, image_urls: imageUrls }]);

  if (insertError) {
    messageBox.textContent = "Error saving post: " + insertError.message;
  } else {
    messageBox.textContent = "Post published successfully!";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    imageFile.value = "";
    selectedFiles = [];
    renderPreviews();
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

  if (error) { postsList.innerHTML = "Error loading posts."; return; }

  postsList.innerHTML = "";
  data.forEach((post) => {
    const images = post.image_urls && post.image_urls.length > 0 ? post.image_urls : (post.image_url ? [post.image_url] : []);
    const div = document.createElement("div");
    div.className = "card glass-card post-admin-card";
    div.innerHTML = `
      ${images[0] ? `<img src="${images[0]}" alt="${post.title}">` : ""}
      <div class="post-info">
        <h4>${post.title} ${images.length > 1 ? `<span style="font-size:0.75rem; color:var(--text-soft);">(+${images.length - 1} more photos)</span>` : ""}</h4>
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