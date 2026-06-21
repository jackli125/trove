const GITHUB_USER = "jackli125";
const GITHUB_REPO = "trove";

const SUBJECT = "chemistry";

const TOPICS = [
    {
        folder: "topic 1",
        label: "Topic 1",
        title: "Atomic Structure",
        description:
            "Atoms, isotopes and electron configuration"
    },

    {
        folder: "topic 2",
        label: "Topic 2",
        title: "Bonding",
        description:
            "Ionic, covalent and metallic bonding"
    },

    {
        folder: "topic 3",
        label: "Topic 3",
        title: "Quantitative Chemistry",
        description:
            "Moles, concentration and stoichiometry"
    },

    {
        folder: "topic 4",
        label: "Topic 4",
        title: "Organic Chemistry",
        description:
            "Hydrocarbons and functional groups"
    }
];

let currentFiles = [];

function formatSize(bytes) {

    if (bytes < 1024)
        return `${bytes} B`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getIcon(filename) {

    const ext =
        filename.split(".").pop().toLowerCase();

    if (ext === "pdf")
        return "📕";

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

    for (const topic of TOPICS) {

        const url =
`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/files/${SUBJECT}/${encodeURIComponent(topic.folder)}`;

        try {

            const response =
                await fetch(url);

            const files =
                await response.json();

            const fileCount =
                Array.isArray(files)
                    ? files.length
                    : 0;

            const card =
                document.createElement("div");

            card.className = "topic-card";

            card.innerHTML = `
                <div class="topic-number">
                    ${topic.label}
                </div>

                <div class="topic-name">
                    ${topic.title}
                </div>

                <div class="topic-meta">
                    ${fileCount} resources
                </div>
            `;

            card.onclick = () => {

                document
                    .querySelectorAll(".topic-card")
                    .forEach(card =>
                        card.classList.remove("active"));

                card.classList.add("active");

                showTopic(
                    topic,
                    files
                );
            };

            container.appendChild(card);

        } catch(err) {

            console.error(
                topic.folder,
                err
            );
        }
    }
}

function showTopic(topic, files) {

    currentFiles = files;

    document.getElementById(
        "currentTopic"
    ).textContent =
        topic.title;

    document.getElementById(
        "topicDescription"
    ).textContent =
        topic.description;

    renderFiles(files);
}

function renderFiles(files) {

    const table =
        document.getElementById(
            "resourceTable"
        );

    table.innerHTML = `
        <div class="resource-header">
            <div></div>
            <div>Resource</div>
            <div style="text-align:right">
                Size
            </div>
            <div style="text-align:right">
                Open
            </div>
        </div>
    `;

    files.forEach(file => {

        const row =
            document.createElement("a");

        row.className =
            "resource-row";

        row.href =
            file.download_url;

        row.target =
            "_blank";

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
                →
            </div>
        `;

        table.appendChild(row);
    });
}

document
.getElementById("resourceSearch")
.addEventListener("input", e => {

    const term =
        e.target.value.toLowerCase();

    const filtered =
        currentFiles.filter(file =>
            file.name
                .toLowerCase()
                .includes(term)
        );

    renderFiles(filtered);
});

loadTopics();
