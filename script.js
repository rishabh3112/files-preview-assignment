"use strict";


const filesContainerNode = document.getElementsByClassName("files-container")[0];
const previewImageNode = document.querySelector(".preview-container img");
const previewTextNode = document.querySelector(".preview-container p");

let files = [];
let currentFileIndex = 0;

const renderFiles = async () => {
    for (const file in files) {
        const fileNode = document.createElement("div");
        const textContent = document.createTextNode(files[file].title);
        fileNode.classList.add("file");
        fileNode.appendChild(textContent);
        fileNode.addEventListener("click", async () => {
            setFileIndex(file);
            await renderPreview();
        })
        filesContainerNode.appendChild(fileNode);
    }
    currentFileIndex = 0;
}

const renderPreview = async () => {
    previewImageNode.src = files[currentFileIndex].previewImage;
    previewTextNode.innerHTML = files[currentFileIndex].title;
}

const fetchFiles = async () => {
    const response = await fetch("/data.json");
    files = await response.json();
    console.log(files[0]);
}

const setFileIndex = (newIndex) => {
    filesContainerNode.children[currentFileIndex].classList.remove("focus");
    filesContainerNode.children[newIndex].classList.add("focus");
    currentFileIndex = newIndex;
}

(async () => {
    await fetchFiles();
    await renderFiles();
    await renderPreview();

    // Register event listeners after initial render
    document.body.addEventListener("keydown", async ({key}) => {
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
    })
})();