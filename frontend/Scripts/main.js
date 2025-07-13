const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function fetchFeed() {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();

  const container = document.getElementById("feed-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const el = document.createElement("div");
    el.className = "card";
el.innerHTML = `
  <div class="flex items-center mb-2">
    <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
    <div>
      <p class="font-semibold">${post.user.username}</p>
      <p class="text-sm text-gray-500">${new Date(post.timestamp).toLocaleString()}</p>
    </div>
  </div>
  <p class="mb-2">${post.content}</p>
  <p class="text-sm text-gray-600 mb-2">❤️ Likes: ${post.likes.length}</p>
  <div class="flex space-x-3 mb-3">
    <button onclick="likePost('${post._id}')" class="text-blue-500 hover:underline">Like</button>
    <button onclick="unlikePost('${post._id}')" class="text-red-500 hover:underline">Unlike</button>
  </div>
  <input type="text" id="comment-input-${post._id}" placeholder="Add a comment" class="input" />
  <button onclick="addComment('${post._id}')" class="button w-full mb-2">Comment</button>
  <div id="comments-${post._id}" class="text-sm text-gray-700"></div>
`;



    container.appendChild(el);
  });
}

async function createPost() {
  const content = document.getElementById("content").value;

  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (res.ok) {
    document.getElementById("content").value = "";
    fetchFeed(); // Refresh posts
  } else {
    alert("Error posting");
  }
}
async function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value;

  const res = await fetch(`${API_URL}/comments/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (res.ok) {
    input.value = "";
    loadComments(postId); // Refresh comments
  } else {
    alert("Failed to post comment");
  }
}

async function loadComments(postId) {
  const res = await fetch(`${API_URL}/comments/${postId}`);
  const comments = await res.json();

  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.innerHTML = comments.map((c) =>
    `<p><strong>${c.user.username}:</strong> ${c.text}</p>`
  ).join("");
}


// ❤️ Like/Unlike functionality
async function likePost(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  fetchFeed();
}

async function unlikePost(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}/unlike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  fetchFeed();
}

// Load feed on page load
fetchFeed();
