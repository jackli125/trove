import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// ---------------- DOM ELEMENTS ----------------
const loading = document.getElementById("loading");
const onboarding = document.getElementById("onboarding");
const dashboard = document.getElementById("dashboard-content");

const logoutBtn = document.getElementById("logout");
const completeBtn = document.getElementById("complete-onboarding");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const dobInput = document.getElementById("dob");

// Custom Year Level Select
const selectWrapper = document.querySelector('.custom-select');
const selectedValue = selectWrapper.querySelector('.selected-value');
const optionsList = selectWrapper.querySelector('.options');
const yearOptions = optionsList.querySelectorAll('li');

// Subject Inputs
const subjectsWrapper = document.getElementById("subjects-container-wrapper");
const subjectInput = document.getElementById("subjectInput");
const subjectsContainer = document.getElementById("subjectsContainer");
const subjectDropdown = document.getElementById("subjectDropdown");

// ---------------- VARIABLES ----------------
let userRef;
let selectedSubjects = [];
let highlightedIndex = -1;

// ---------------- SUBJECT LISTS ----------------
const subjectsYear11 = [
  "English / Essential English","English as an Additional Language","Essential Mathematics","General Mathematics",
  "Mathematical Methods","Specialist Mathematics","Activating Identities and Future","Exploring Identities and Futures",
  "Aboriginal Studies","Accounting","Ancient Studies","Australian Languages - Revival Language (Kaurna)",
  "Biology","Business Innovation","Chemistry","Chinese Background Speakers","Chinese Continuers","Creative Arts: Film",
  "Design Engineering & Innovation","Graphics & Architecture","Digital Technologies","Drama","Economics","French Continuers",
  "Geography","German Continuers","Health and Wellbeing","Legal Studies","Modern History","Music","Outdoor Education",
  "Physical Education","Physics","Psychology","Scientific Studies","Spanish Continuers","Tourism","Visual Arts"
];

const subjectsYear12 = [
  "Aboriginal Studies","Accounting","Ancient Studies","Biology","Business Innovation","Chemistry",
  "Chinese Background Speakers","Chinese Continuers","Creative Arts: Film","Design Engineering & Innovation",
  "Game Development","Graphics & Architecture","Material Solutions","Dance","Drama","Economics","English",
  "English Literary Studies","Essential English","English as an Additional Language","French Continuers","Geography",
  "German Continuers","Legal Studies","Essential Mathematics","General Mathematics","Mathematical Methods",
  "Specialist Mathematics","Modern History","Music Explorations","Music Studies","Music Performance: Ensemble (10) and Solo (10)",
  "Nutrition","Outdoor Education","Physical Education","Physics","Psychology","Scientific Studies","Spanish Continuers",
  "Tourism","Visual Arts","Workplace Practices"
];

// ---------------- AUTH CHECK ----------------
onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.replace("login.html");

  if (!db) {
    console.error("Firestore not initialised!");
    return;
  }

  if (!user.uid) {
    console.error("User object invalid:", user);
    return;
  }

  userRef = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(userRef);
    loading.style.display = "none";

    if (!snap.exists() || !snap.data().onboardingComplete) {
      onboarding.style.display = "block";
    } else {
      dashboard.style.display = "block";
      populateDashboard(userRef);
    }
  } catch (err) {
    console.error("Error fetching user document:", err);
    dashboard.style.display = "block";
  }
});

// ---------------- CUSTOM YEAR LEVEL SELECT ----------------
selectWrapper.addEventListener('click', () => {
  optionsList.style.display = optionsList.style.display === 'block' ? 'none' : 'block';
});

yearOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const value = opt.getAttribute('data-value');
    selectedValue.textContent = value; // Right side updates
    optionsList.style.display = 'none';

    if (value === "11" || value === "12") {
      subjectsWrapper.style.display = "block";
      selectedSubjects = [];
      subjectsContainer.innerHTML = "";
      subjectInput.value = "";
      subjectDropdown.innerHTML = "";
    } else {
      subjectsWrapper.style.display = "none";
      selectedSubjects = [];
      subjectsContainer.innerHTML = "";
      subjectDropdown.innerHTML = "";
    }

    window.selectedYearLevel = value;
  });
});

// Close dropdown if clicking outside
document.addEventListener('click', e => {
  if (!selectWrapper.contains(e.target)) optionsList.style.display = 'none';
});

// ---------------- SUBJECT SEARCH ----------------
subjectInput.addEventListener('input', () => {
  const year = window.selectedYearLevel;
  if (!year) return;

  const list = year === "11" ? subjectsYear11 : subjectsYear12;
  const query = subjectInput.value.toLowerCase();
  const matches = list.filter(sub => sub.toLowerCase().includes(query) && !selectedSubjects.includes(sub));

  if (matches.length === 0) {
    subjectDropdown.style.display = "none";
    subjectDropdown.innerHTML = "";
    return;
  }

  subjectDropdown.style.display = "block";
  subjectDropdown.innerHTML = matches.map(sub => `<div class="subjectOption">${sub}</div>`).join("");

  highlightedIndex = -1;

  subjectDropdown.querySelectorAll(".subjectOption").forEach(el => {
    el.onclick = () => {
      addSubjectTag(el.textContent);
      subjectInput.value = "";
      subjectDropdown.innerHTML = "";
      subjectDropdown.style.display = "none";
    };
  });
});

subjectInput.addEventListener("keydown", e => {
  const items = Array.from(subjectDropdown.querySelectorAll(".subjectOption"));
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex = (highlightedIndex + 1) % items.length;
    updateHighlight(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
    updateHighlight(items);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (highlightedIndex >= 0) {
      addSubjectTag(items[highlightedIndex].textContent);
      subjectInput.value = "";
      subjectDropdown.innerHTML = "";
      subjectDropdown.style.display = "none";
    }
  }
});

function updateHighlight(items) {
  items.forEach((el, i) => el.classList.toggle("highlighted", i === highlightedIndex));
}

function addSubjectTag(subject) {
  if (selectedSubjects.includes(subject)) return;
  selectedSubjects.push(subject);

  const tag = document.createElement("div");
  tag.className = "subject-tag";
  tag.textContent = subject;

  const removeBtn = document.createElement("span");
  removeBtn.textContent = "×";
  removeBtn.onclick = () => {
    selectedSubjects = selectedSubjects.filter(s => s !== subject);
    subjectsContainer.removeChild(tag);
  };

  tag.appendChild(removeBtn);
  subjectsContainer.appendChild(tag);
}

// ---------------- DOB INPUT MASK ----------------
dobInput.addEventListener("input", () => {
  let value = dobInput.value.replace(/\D/g, ''); 
  if (value.length > 8) value = value.slice(0,8);

  let formatted = "";
  if (value.length <= 2) formatted = value;
  else if (value.length <= 4) formatted = value.slice(0,2) + "/" + value.slice(2);
  else formatted = value.slice(0,2) + "/" + value.slice(2,4) + "/" + value.slice(4);

  dobInput.value = formatted;
});

dobInput.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    const pos = dobInput.selectionStart;
    if (pos > 0 && dobInput.value[pos-1] === "/") {
      e.preventDefault();
      dobInput.setSelectionRange(pos-1, pos-1);
      dobInput.value = dobInput.value.slice(0,pos-1) + dobInput.value.slice(pos);
    }
  }
});

// ---------------- COMPLETE ONBOARDING ----------------
completeBtn.addEventListener("click", async () => {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const dob = dobInput.value.trim();
  const yearLevel = window.selectedYearLevel;

  if (!firstName) { alert("Please enter your first name."); firstNameInput.focus(); return; }
  if (!lastName) { alert("Please enter your last name."); lastNameInput.focus(); return; }
  if (!dob || dob.length !== 10) { alert("Please enter your date of birth in DD/MM/YYYY format."); dobInput.focus(); return; }
  if (!yearLevel) { alert("Please select your year level."); return; }
  if ((yearLevel === "11" || yearLevel === "12") && selectedSubjects.length === 0) {
    alert("Please select at least one subject for your year level.");
    subjectInput.focus();
    return;
  }

  try {
    await setDoc(userRef, {
      firstName,
      lastName,
      dob,
      yearLevel,
      subjects: selectedSubjects,
      onboardingComplete: true
    }, { merge: true });

    onboarding.style.display = "none";
    dashboard.style.display = "block";
    populateDashboard(userRef);
  } catch (err) {
    console.error("Error saving onboarding:", err);
    alert("Failed to save data. Check your internet connection.");
  }
});

// ---------------- POPULATE DASHBOARD ----------------
async function populateDashboard(userRef) {
  if (!userRef) return;
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();

    // ---------- PROFILE INFO ----------
    document.getElementById("profile-firstName").textContent = data.firstName || "";
    document.getElementById("profile-lastName").textContent = data.lastName || "";
    document.getElementById("profile-dob").textContent = data.dob || "";
    document.getElementById("profile-yearLevel").textContent = data.yearLevel || "";
    document.getElementById("profile-subjects").textContent = (data.subjects || []).join(", ");

    // ---------- SUBJECT RESOURCES ----------
    const resourcesList = document.getElementById("resources-list");
    resourcesList.innerHTML = "";

    const subjectResources = getSubjectResources(data.subjects || []);
    subjectResources.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${item.link}" target="_blank">${item.name}</a>`;
      resourcesList.appendChild(li);
    });

  } catch (err) {
    console.error("Error populating dashboard:", err);
  }
}

function getSubjectResources(subjects) {
  const resources = {
    "English": "english.html",
    "Essential English": "https://www.essentialenglish.com",
    "Mathematical Methods": "https://www.mathmethods.com",
    "Specialist Mathematics": "https://www.specialistmath.com",
    "Physics": "https://www.physicsresources.com",
    "Biology": "https://www.biologyresources.com",
    "Chemistry": "https://www.chemistryresources.com",
    "Economics": "https://www.economicsresources.com",
    "History": "https://www.historyresources.com",
    "Visual Arts": "https://www.visualartsresources.com",
    // Add more subject links as needed
  };

  return subjects.map(sub => ({
    name: sub,
    link: resources[sub] || "#"
  }));
}

// ---------------- LOGOUT ----------------
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed. Try again.");
  }
});


