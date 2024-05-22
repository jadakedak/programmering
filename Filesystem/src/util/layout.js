let explorer = document.getElementById("explorer")
let shortcuts = document.getElementById("shortcuts")
let dirpath = document.getElementById("Path");
let reload = document.getElementById("reload")

let fileobjectcontainer = document.getElementById("File-Object-Container")

setInterval(() => {
    filesContainer.style.maxHeight = `${window.innerHeight - 200}px`
    dirpath.style.width = `${window.innerWidth - 200}px`
    filesContainer.style.width = `${(window.innerWidth) - 200}px`;
}, 50);

