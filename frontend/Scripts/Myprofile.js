const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function fetchProfile() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    alert("Please login again");
    logout();
    return;
  }

  const user = await res.json();

  // Show basic info
  document.getElementById("user-info").innerHTML = `
    <p>Username: ${user.username}</p>
    <p>Email: ${user.email}</p>
    <p>Followers: ${user.followers?.length || 0}</p>
    <p>Following: ${user.following?.length || 0}</p>
  `;

  // Load user's own posts
  const postsRes = await fetch(`${API_URL}/users/${user._id}`);
  const postsData = await postsRes.json();

  const myPostsDiv = document.getElementById("my-posts");
  myPostsDiv.innerHTML = postsData.posts
    .map((p) => `<p>${p.content}</p><hr/>`)
    .join("");
}

fetchProfile();
