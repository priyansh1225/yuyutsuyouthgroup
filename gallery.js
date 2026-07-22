// gallery.js
// Publicly fetches all posts from Supabase and displays them - no login required

async function loadGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = "Could not load updates right now.";
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = "<p>No updates posted yet. Check back soon!</p>";
    return;
  }

  grid.innerHTML = "";
  data.forEach((post) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    if (post.image_url) {
      item.innerHTML = `
        <img src="${post.image_url}" alt="${post.title}" onclick="openGalleryImage(this.src)">
        <div class="gallery-overlay">
          <span>${post.title}</span>
          <p class="gallery-overlay-desc">${post.description}</p>
        </div>
      `;
    } else {
      // Text-only post (no image) - shown as a plain card instead
      item.innerHTML = `
        <div class="gallery-overlay" style="position:static; opacity:1; transform:none; background:rgba(255,255,255,0.06);">
          <span>${post.title}</span>
          <p class="gallery-overlay-desc">${post.description}</p>
        </div>
      `;
    }
    grid.appendChild(item);
  });
}

loadGallery();