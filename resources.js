const USERNAME = "jackli125";
const REPO = "trove";

// structure you want to display
const TOPICS = [
  "topic 1",
  "topic 2",
  "topic 3",
  "topic 4"
];

const SUBJECT = "chemistry";

// ---------- FETCH FILES FROM GITHUB ----------
async function fetchFolder(path) {
  const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${path}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load: " + path);

  return await res.json();
}

// ---------- RENDER TOPIC FOLDERS ----------
function renderFolders() {
  const container = document.getElementById("folder-container");

  TOPICS.forEach(topic => {
    const div = document.createElement("div");
    div.className = "topic-folder";

    div.innerHTML = `
      <div class="folder-icon">📁</div>
      <div class="folder-info">
        <h3>${topic}</h3>
        <p>Click to view files</p>
      </div>
      <button class="open-folder">Open</button>
    `;

    div.onclick = () => loadTopic(topic);

    container.appendChild(div);
  });
}

// ---------- LOAD FILES IN A TOPIC ----------
async function loadTopic(topic) {
  const container = document.getElementById("file-container");
  container.innerHTML = "<p>Loading...</p>";

  const path = `files/${SUBJECT}/${topic}`;

  try {
    const files = await fetchFolder(path);

    container.innerHTML = `<h2>${topic}</h2>`;

    files.forEach(file => {
      if (file.type !== "file") return;

      const fileCard = document.createElement("a");
      fileCard.className = "file-card";
      fileCard.href = file.download_url;
      fileCard.target = "_blank";

      const ext = file.name.split(".").pop().toLowerCase();

      fileCard.innerHTML = `
        <div class="file-icon ${ext}">
          ${ext.toUpperCase()}
        </div>

        <div class="file-details">
          <h4>${file.name}</h4>
          <span>Open file</span>
        </div>
      `;

      container.appendChild(fileCard);
    });

  } catch (err) {
    container.innerHTML = "<p>Could not load files.</p>";
    console.error(err);
  }
}

// ---------- INIT ----------
renderFolders();
loadTopic(TOPICS[0]);
