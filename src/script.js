"use strict";

const filesContainerNode = document.querySelector(".files-container");
const previewImageNode = document.querySelector(".preview-container .preview");
const previewTextNode = document.querySelector(".preview-container p");
const lines = 3;

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
        const fileNameNode = fileNode.children[1];
        let fileNameOverflowHeight = fileNameNode.clientHeight;

        fileNameNode.style.whiteSpace = "nowrap";
        let lineHeight = fileNameNode.clientHeight;
        fileNameNode.style.whiteSpace = "";
        
        const textContent = fileNameNode.innerText;
        let front = textContent.slice(0, textContent.length/2 + 1);
        let back = textContent.slice(textContent.length/2 + 1);
        while (fileNameOverflowHeight > lineHeight * lines) {
            front = front.slice(0, -1);
            back = back.slice(1);
            fileNameNode.innerHTML = `${front} ... ${back}`;
            fileNameOverflowHeight = fileNameNode.clientHeight;
        }
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
