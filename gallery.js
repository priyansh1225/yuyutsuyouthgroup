// gallery.js
async function loadGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { grid.innerHTML = "Could not load updates right now."; return; }
  if (!data || data.length === 0) { grid.innerHTML = "<p>No updates posted yet. Check back soon!</p>"; return; }

  grid.innerHTML = "";
  data.forEach((post) => {
    const images = post.image_urls && post.image_urls.length > 0 ? post.image_urls : (post.image_url ? [post.image_url] : []);
    const imagesHtml = images.map(url =>
      `<img src="${url}" alt="${post.title}" onclick="openGalleryImage(this.src)">`
    ).join("");

    const item = document.createElement("div");
    item.className = "card glass-card gallery-post-card";
    item.innerHTML = `
      <div class="gallery-post-images">${imagesHtml}</div>
      <div class="gallery-post-text">
        <h4>${post.title}</h4>
        <p class="gallery-overlay-desc">${post.description}</p>
      </div>
    `;
    grid.appendChild(item);
  });
}

loadGallery();