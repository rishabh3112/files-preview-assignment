"use strict";


const filesContainerNode = document.getElementsByClassName("files-container")[0];
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
        })
        
        filesContainerNode.appendChild(fileNode);
    }

    currentFileIndex = 0;
    const fileNodes = document.querySelectorAll(".file");
    for (const fileNode of fileNodes) {
        const thumbnailNode = fileNode.children[0];
        const thumbnailStyle = window.getComputedStyle(thumbnailNode);
        const fileNameNode = fileNode.children[1];
        const textWidth = fileNameNode.clientWidth;
        const boxWidth = fileNode.clientWidth - (thumbnailNode.clientWidth + parseInt(thumbnailStyle.marginLeft) + parseInt(thumbnailStyle.marginRight));
        // Width of text overflowed out of box
        const redundantWidth = textWidth - boxWidth;
        
        if (redundantWidth <= 0) {
            continue;
        }

        const textContent = fileNameNode.innerText;
        const computedStyles = window.getComputedStyle(fileNameNode, null);
        const fontSize = parseInt(computedStyles.getPropertyValue("font-size"));
        // Approximate redundant characters in string
        const redundantChars = redundantWidth / (fontSize * 0.4);
        const requiredWidth = textContent.length - redundantChars;
        fileNameNode.innerText = textContent.substring(0, requiredWidth/2) + "..." + textContent.slice(-1 * (requiredWidth/2 - 2));
    }
}

const renderPreview = async () => {
    filesContainerNode.children[currentFileIndex].classList.add("focus");
    previewImageNode.style.backgroundImage = `url("${files[currentFileIndex].previewImage}")`;
    previewTextNode.innerHTML = files[currentFileIndex].title;
}

const fetchFiles = async () => {
    const response = await fetch("data.json");
    files = await response.json();
}

const setFileIndex = (newIndex) => {
    if (newIndex < 0 || newIndex >= files.length) return;
    filesContainerNode.children[currentFileIndex].classList.remove("focus");
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