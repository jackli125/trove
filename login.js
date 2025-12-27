import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

/* ---------- DOM ---------- */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");

const submitBtn = document.getElementById("submit");
const googleBtn = document.getElementById("google");

const toggle = document.getElementById("toggle");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

const errorBox = document.getElementById("error");
const errorMsg = document.getElementById("error-msg");

const forgotLink = document.getElementById("forgot");

const provider = new GoogleAuthProvider();

let isSignup = false;

/* ---------- BUTTON LOADING ---------- */

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading");
    button.querySelector(".spinner").classList.remove("hidden");
  } else {
    button.classList.remove("loading");
    button.querySelector(".spinner").classList.add("hidden");
  }
}

/* ---------- TOGGLE LOGIN / SIGNUP ---------- */

toggle.addEventListener("click", () => {
  isSignup = !isSignup;
  errorBox.style.display = "none";

  if (isSignup) {
    title.textContent = "Create account";
    subtitle.textContent = "Sign up to get started";
    submitBtn.querySelector(".btn-text").textContent = "Create account";
    confirmInput.style.display = "block";
    forgotLink.style.display = "none";
    toggle.innerHTML = "Already have an account? <span>Sign in</span>";
  } else {
    title.textContent = "Welcome back";
    subtitle.textContent = "Sign in to continue";
    submitBtn.querySelector(".btn-text").textContent = "Sign in";
    confirmInput.style.display = "none";
    forgotLink.style.display = "inline";
    toggle.innerHTML = "Don’t have an account? <span>Create one</span>";
  }
});

/* ---------- EMAIL / PASSWORD ---------- */

submitBtn.addEventListener("click", async () => {
  errorBox.style.display = "none";

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!email || !password) {
    errorMsg.textContent = "Please fill in all required fields.";
    errorBox.style.display = "flex";
    return;
  }

  if (isSignup && password !== confirm) {
    errorMsg.textContent = "Passwords do not match.";
    errorBox.style.display = "flex";
    return;
  }

  setButtonLoading(submitBtn, true);

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

    window.location.replace("/dashboard.html");

  } catch (err) {
    errorMsg.textContent = err.message;
    errorBox.style.display = "flex";
    setButtonLoading(submitBtn, false);
  }
});

/* ---------- GOOGLE SIGN IN ---------- */

googleBtn.addEventListener("click", async () => {
  errorBox.style.display = "none";
  setButtonLoading(googleBtn, true);

  try {
    await signInWithPopup(auth, provider);
    window.location.replace("/dashboard.html");

  } catch (err) {
    errorMsg.textContent = err.message;
    errorBox.style.display = "flex";
    setButtonLoading(googleBtn, false);
  }
});


import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

forgotLink.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        errorMsg.textContent = "Please enter your email address first.";
        errorBox.style.display = "flex";
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        errorMsg.textContent = `Password reset email sent to ${email}. Check your inbox.`;
        errorBox.style.display = "flex";
        errorBox.style.background = "#e7f5ff"; // subtle success colour
        errorBox.style.color = "#00338D"; // match primary
    } catch (err) {
        errorMsg.textContent = err.message;
        errorBox.style.display = "flex";
        errorBox.style.background = "#fdecea"; // error colour
        errorBox.style.color = "#c0392b";
    }
});
