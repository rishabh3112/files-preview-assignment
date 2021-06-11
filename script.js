"use strict";

const filesContainerNode = document.querySelector(".files-container");
const previewImageNode = document.querySelector(".preview-container .preview");
const previewTextNode = document.querySelector(".preview-container p");

let files = [];
let currentFileIndex = 0;

const renderFiles = async () => {
    for (const file in files) {
        const fileNode = document.createElement("div");

        const thumbnailNode = document.createElement("div");
        thumbnailNode.classList.add("thumbnail");
        thumbnailNode.style.backgroundImage = `url("${files[file].previewImage}")`;

        const textContent = document.createElement("span");
        textContent.innerText = files[file].title;

        fileNode.classList.add("file");
        fileNode.appendChild(thumbnailNode);
        fileNode.appendChild(textContent);
        fileNode.addEventListener("click", async () => {
            setFileIndex(parseInt(file));
            await renderPreview();
        });

        filesContainerNode.appendChild(fileNode);
    }

    currentFileIndex = 0;

    const fileNodes = document.querySelectorAll(".file");
    for (const fileNode of fileNodes) {
        const thumbnailNode = fileNode.children[0];
        const thumbnailStyle = window.getComputedStyle(thumbnailNode);
        const fileNameNode = fileNode.children[1];
        const textWidth = fileNameNode.clientWidth;
        const boxWidth =
            fileNode.clientWidth -
            (thumbnailNode.clientWidth +
                parseInt(thumbnailStyle.marginLeft) +
                parseInt(thumbnailStyle.marginRight));
        // Width of text overflowed out of box
        const redundantWidth = textWidth - boxWidth;

        if (redundantWidth <= 0) {
            continue;
        }

        // Truncate text if overflowing
        const textContent = fileNameNode.innerText;
        const whiteSpaceFactor = parseInt(window.getComputedStyle(document.body).getPropertyValue("--white-space-factor"));
        Object.assign(fileNameNode.style, {
            width: "50%",
            overflow: "hidden",
            "word-break": "break-all",
            "white-space": "normal",
        });
        fileNameNode.style.setProperty(
            "--file-width",
            `${fileNameNode.clientWidth - whiteSpaceFactor/2}px`
        );
        fileNameNode.setAttribute("data-before", textContent);
        fileNameNode.style.setProperty(
            "height",
            window.getComputedStyle(fileNameNode, ":before").height
        );
    }
};

const renderPreview = async () => {
    filesContainerNode.children[currentFileIndex].classList.add("focus");
    previewImageNode.style.backgroundImage = `url("${files[currentFileIndex].previewImage}")`;
    previewTextNode.innerHTML = files[currentFileIndex].title;
};

const fetchFiles = async () => {
    const response = await fetch("data.json");
    files = await response.json();
};

const setFileIndex = (newIndex) => {
    if (newIndex < 0 || newIndex >= files.length) return;
    filesContainerNode.children[currentFileIndex].classList.remove("focus");
    currentFileIndex = newIndex;
};

(async () => {
    await fetchFiles();
    await renderFiles();
    await renderPreview();

    // Register event listeners after initial render
    document.body.addEventListener("keydown", async ({ key }) => {
        switch (key) {
            case "ArrowUp":
                setFileIndex(currentFileIndex - 1);
                await renderPreview();
                break;

            case "ArrowDown":
                setFileIndex(currentFileIndex + 1);
                await renderPreview();
                break;

            default:
                break;
        }
    });
})();
