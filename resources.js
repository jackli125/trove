const GITHUB_USER = "Yjackli125";
const GITHUB_REPO = "trove";

const SUBJECT = "chemistry";

const TOPICS = {

    "Topic 1": {
        title: "Industrial Chemistry",
        description:
            "Topics 1.3 and 2"
    },

    "Topic 2": {
        title: "Environmental Chemistry",
        description:
            "1.1 1.2 1.4 1.5 4.1"
    },

    "Topic 3": {
        title: "Organic Chemistry",
        description:
            "Topic 3"
    },

    "Topic 4": {
        title: "Managing Resources",
        description:
            "Topic 4"
    }

};

let currentFiles = [];

function formatSize(bytes) {

    if (bytes < 1024)
        return `${bytes} B`;

    if (bytes < 1024 * 1024)
        return `${(bytes/1024).toFixed(1)} KB`;

    return `${(bytes/1024/1024).toFixed(1)} MB`;
}

function getIcon(filename) {

    const ext =
        filename.split(".").pop().toLowerCase();

    if (ext === "pdf") return "📕";

    if (["ppt","pptx"].includes(ext))
        return "📊";

    if (["doc","docx"].includes(ext))
        return "📝";

    if (["xls","xlsx"].includes(ext))
        return "📈";

    return "📄";
}

async function loadTopics() {

    const container =
        document.getElementById("folder-container");

    for (const topic in TOPICS) {

        const url =
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/files/${SUBJECT}/${encodeURIComponent(topic)}`;

        const response =
            await fetch(url);

        const files =
            await response.json();

        const card =
            document.createElement("div");

        card.className = "topic-card";

        card.innerHTML = `
            <div class="topic-number">
                ${topic}
            </div>

            <div class="topic-name">
                ${TOPICS[topic].title}
            </div>

            <div class="topic-meta">
                <span>${files.length} resources</span>
            </div>
        `;

        card.onclick = () => {

            document
                .querySelectorAll(".topic-card")
                .forEach(x =>
                    x.classList.remove("active"));

            card.classList.add("active");

            showTopic(
                topic,
                files
            );
        };

        container.appendChild(card);
    }
}

function showTopic(topic, files) {

    currentFiles = files;

    document.getElementById(
        "currentTopic"
    ).textContent =
        TOPICS[topic].title;

    document.getElementById(
        "topicDescription"
    ).textContent =
        TOPICS[topic].description;

    renderTable(files);
}

function renderTable(files) {

    const table =
        document.getElementById(
            "resourceTable"
        );

    table.innerHTML = "";

    files.forEach(file => {

        const row =
            document.createElement("a");

        row.className =
            "resource-row";

        row.href =
            file.download_url;

        row.target = "_blank";

        row.innerHTML = `
            <div class="resource-type">
                ${getIcon(file.name)}
            </div>

            <div class="resource-name">
                ${file.name}
            </div>

            <div class="resource-size">
                ${formatSize(file.size)}
            </div>

            <div class="resource-action">
                Open →
            </div>
        `;

        table.appendChild(row);
    });
}

loadTopics();
