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
    item.innerHTML = `
      ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" onclick="openGalleryImage(this.src)">` : ""}
      <div style="padding:10px 4px;">
        <h4 style="margin-bottom:4px;">${post.title}</h4>
        <p style="font-size:0.88rem; color:var(--text-soft);">${post.description}</p>
      </div>
    `;
    grid.appendChild(item);
  });
}

loadGallery();