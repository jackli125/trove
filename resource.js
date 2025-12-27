import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

const loading = document.getElementById("loading");
const content = document.getElementById("resource-content");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------------- AUTH GATE ---------------- */

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("/login.html");
    return;
  }

  // Auth confirmed
  loading.style.display = "none";
  content.style.display = "block";
});

/* ---------------- LOGOUT ---------------- */

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("/login.html");
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed. Please try again.");
  }
});
