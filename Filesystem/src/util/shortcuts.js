class Shortcut{
    constructor(filedirname, path){
        this.filedirname = filedirname
        this.path = path
        this.Element = document.getElementById("shortcuts")

        // shortcut container
        this.Container = document.createElement("div")
            this.Container.id = "Shortcut-Container"

        this.ShortcutLabel = document.createElement("label");
            this.ShortcutLabel.style.cursor = "pointer"
            this.ShortcutLabel.style.userSelect = "none";
            this.ShortcutLabel.textContent = this.filedirname
    }

    addListeners(){
        this.Container.addEventListener("click", () => {
            Directory.length = 0;
            for(let dir of this.path){
                Directory.push(dir)
            }
            dir = GetActualDirectory()
            updateDirectoryPath()
            
            ClearDisks();
            CreateFilesInDirectory(FilesInDir)
        })
    }

    Create(){
        this.Container.appendChild(this.ShortcutLabel)
        this.Element.appendChild(this.Container)
    }

    remove(){
        if(this.Element.contains(this.Container)){
            this.Element.removeChild(this.Container)
        }
    }
}

GetUser().then(user => {
    let Desktop_shortcut = new Shortcut('Desktop', ["C:\\", "Users\\", `${user}\\`, `Desktop\\`])
    Desktop_shortcut.Create()

    let Downloads_shortcut = new Shortcut('Downloads', ["C:\\", "Users\\", `${user}\\`, "Downloads\\"])
    Downloads_shortcut.Create()

    let Documents_shortcut = new Shortcut("Documents", ["C:\\", "Users\\", `${user}\\`, "OneDrive\\", "Dokumenter\\"])
    Documents_shortcut.Create()

    let All_shortcuts = [Desktop_shortcut, Documents_shortcut, Downloads_shortcut]
    
    for(let shortcut of All_shortcuts){
        shortcut.Container.addEventListener("click", () => {
            Directory.length = 0;
            for(let dir of shortcut.path){
                Directory.push(dir)
            }
            dir = GetActualDirectory()
            updateDirectoryPath()
            
            ClearDisks();
            CreateFilesInDirectory(FilesInDir)
        })
    }
})

let DriveShortcuts = [];

function ClearDriveShortcuts(){
    for(let shortcut of DriveShortcuts){
        shortcut.Element.removeChild(shortcut.Container)
    }
    DriveShortcuts.length = 0;
}

function CreateDriveShortcuts(){
    for(let drive of Drives){
        // laver et nyt shortcut objekt for hvert drive i Drives listen
        let DriveShortcut = new Shortcut(drive.name + "\\", [`${drive.name + "\\"}`])
        // sætter shortcutten ind i DriveShortcuts listen og laver alle elementerne som Shortcut objectet har
        DriveShortcuts.push(DriveShortcut)
        DriveShortcut.Create()
    
        // sætter en eventlistener som lytter efter kliks på Shortcut objectets Container element
        DriveShortcut.Container.addEventListener("click", () => {
            // fjerner alle fil objekter fra UI fil containeren
            ClearFiles()
            // sætter directory og filesindir listernes længde til 0
            Directory.length = 0;
            FilesInDir.length = 0;
            
            // sætter drive navnet ind i Directory listen
            Directory.push(drive.name + "\\")
            //sætter UI directory variablen til det første element i Directory listen
            dir = Directory[0]
            // opdatere UI elementets text til dir variablens text
            updateDirectoryPath()
            // fjerner alle disk objekter
            ClearDisks()
            
            // laver alle filer i FilesInDir listen
            CreateFilesInDirectory(FilesInDir)
        })
    }
}
// kalder functionen
CreateDriveShortcuts()
