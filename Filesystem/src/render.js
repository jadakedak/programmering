const files = window.fs
const Path = window.path
const ipcRenderer = window.api

const backbutton = document.getElementById("go-back");
const DirectoryPath = document.getElementById("Path");
const reload_button = document.getElementById("reload");

const empty_dir = document.createElement("label")
empty_dir.style.textAlign = "center";
empty_dir.textContent = "This directory is empty"

// gets the username by taking the name of the bottom folder in the Users folder
async function GetUser(){
    try{
        let temp_files = []
        let dir = "C:\\Users\\"
        const results = await GetFilesInDirectory(temp_files, dir)
        
        return results[temp_files.length - 1].name
    }catch(error){
        console.log(error)
    }
}

GetDisks()
setTimeout(() => {
    CreateDisks()
}, 200)

// File, Drives and directory storage
let Drives = []
let FilesInDir = []
let Directory = []
let filesContainer = document.getElementById("files-container");

// takes all of the parts of the path in Directory and puts them together into a single path
function GetActualDirectory(){
    let actdir = "";
    if(Directory.length === 0){
        actdir = "Choose Disk"
    }else{
        for(let path of Directory){
            actdir += path
        }
    }
    return actdir
}

let dir = GetActualDirectory()
updateDirectoryPath()

// checks wich file was clicked relative to the window and the file objects x and y cords
document.addEventListener("click", (event) => {
    // Check if the click is inside any file object
    let clickedOnFile = FilesInDir.some(file => {
        let fileRect = file.Container.getBoundingClientRect();
        return (
            event.clientX >= fileRect.left &&
            event.clientX <= fileRect.right &&
            event.clientY >= fileRect.top &&
            event.clientY <= fileRect.bottom
        );
    });

    // If the click was not on any file, unselect all
    if (!clickedOnFile) {
        FilesInDir.forEach(file => {
            if (file.selected) {
                file.unselect();
            }
        });
    }
});



// function for going back through directories
backbutton.addEventListener("click", () => {
    Directory.pop()
    if(Directory.length > 0){
        dir = GetActualDirectory()
        UpdateDirectoryFiles()
    }else if(Directory.length === 0){
        ClearFiles()
        for(const drive of Drives){
            drive.Create()
            drive.ListenForSelect()
        }
    }else{
        return;
    }
    updateDirectoryPath()
})

reload_button.addEventListener("click", () => {
    if(Directory.length > 0){
        UpdateDirectoryFiles()
    }else{
        UpdateDrives()
    }
})

document.getElementById("files-container").addEventListener("contextmenu", () => {
    ipcRenderer.send("Normal-Context-Menu")
})

/* IPC RENDER LISTENERS */
ipcRenderer.receive('Remove-File', (file) => {
    // modtag objectet og konverter det fra et json String til et object
    let File = JSON.parse(file)

    // brug et af fil objectets functioner ved navn delete, til at fjerne filen fra ui'en
    File.remove()
    // fjerner filen fra listen "filesindir" med splice
    if(FilesInDir.includes(File)){
        let index = FilesInDir.indexOf(File)
        FilesInDir.splice(index, 1)
    }
    // tjekker om directoriet er tomt, og hvis det er, sætter noget text som siger at det er tomt
    CheckEmptyDirectory()
})

// listens for the update directory event from index.js
ipcRenderer.receive('update-directory', () => {
    updateDirectoryPath()
    UpdateDirectoryFiles()
})

// listens for open directory event from index.js
ipcRenderer.receive('Open-Directory', (file) => {
    let File = JSON.parse(file)

    FilesInDir.forEach(file => file.remove()); 
    FilesInDir.length = 0; 
    Directory.push(`${File.name}\\`)

    updateDirectoryPath()
    CreateFilesInDirectory(FilesInDir)
})


// updates the UI Directory
function updateDirectoryPath(){
    DirectoryPath.value = GetActualDirectory()
}

function CheckEmptyDirectory(){
    if(FilesInDir.length <= 0){
        filesContainer.appendChild(empty_dir)
    }
}

// Gathers all of the files in a list and appends all of them to the ui
function CreateFilesInDirectory(Files) {
    GetFilesInDirectory(FilesInDir);
    // sætter en timeout på 100 millisekunder, så "GetFilesInDirectory" kan nå at appende alle filerne til FilesInDir listen
    setTimeout(() => {
        // tjekker om UI fil containeren har "empty_dir" elementet i sig, og hvis den har, fjerner den det
        if(filesContainer.contains(empty_dir)){
            filesContainer.removeChild(empty_dir)
        }
        // for hver eneste fil fra function argumentet og bruger "Create", "SelectOpenListeners" og "calculatePosition" på dem
        for (let file of Files) {
            file.Create();
            file.SelectOpenListeners();
            file.calculatePosition();
        }
        // tjekker om Directoriet er tomt
        CheckEmptyDirectory()
    }, 100);
}
