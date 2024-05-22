class Drive{
    constructor(drivename, capacity, filesystem){
        this.name = drivename;
        this.capacity = capacity
        this.filesystem = filesystem

        this.width = 200
        this.height = 100

        // the Container thats going to hold all of the information about the drive
        this.Container = document.createElement("div");
            this.Container.style.width = `${this.width}px`
            this.Container.style.height = `${this.height}px`
            this.Container.id = `Drive-Object-Container`

        // image to show that what the user is seeing IS in fact a drive
        this.Image = document.createElement("img")
            this.Image.style.position = "relative"
            this.Image.style.marginRight = "20px";
            this.Image.src = "./pictures/harddrive.png"

        // show the name of the drive ex: C:, D:
        this.DriveNameLabel = document.createElement("label")
            this.DriveNameLabel.style.fontSize = "70px"
            this.DriveNameLabel.textContent = this.name
    }

    Newline(){
        let newline = document.getElementById("br")
        return newline
    }
    // adds all of the elements to the container and adds the container to the filecontainer in the ui
    Create(){
        this.Container.appendChild(this.Image)
        this.Container.appendChild(this.DriveNameLabel)
        filesContainer.appendChild(this.Container)
    }
    // if the filescontainer contains this Drive then it removes it
    remove(){
        if(filesContainer.contains(this.Container)){
            filesContainer.removeChild(this.Container)
        }
    }
    // removes all of the files, changes directory and reloads the files
    Open() {
        FilesInDir.forEach(file => file.remove());
        FilesInDir.length = 0;
    
        updateDirectoryPath();
        CreateFilesInDirectory(FilesInDir);
    }

    // listens for double click and goes into the drive
    ListenForSelect() {
        this.Container.removeEventListener("dblclick", this.openDriveHandler);
        this.openDriveHandler = () => {
            Directory[0] = this.name + "\\";
            for (let drive of Drives) {
                drive.remove();
            }
            this.Open();
        };
        this.Container.addEventListener("dblclick", this.openDriveHandler);
    }
}

class FileObj{
    constructor(name, size, location, isfile){
        this.name = name,
        this.size = size,
        this.location = location

        this.selected = false;
        this.isfile = isfile

        this.width = 380 
        this.height = 18 

        this.Container = document.createElement("div"); 
            this.Container.style.width = `${this.width}px`
            this.Container.style.height = `${this.height}px`
            this.Container.id = "File-Object-Container"

        this.FilenameLabel = document.createElement("label");
            this.FilenameLabel.id = "File-Object-Name"
            this.FilenameLabel.textContent = this.name

        this.FileOrDirImage = new Image(15, 15)
            this.FileOrDirImage.style.marginRight = "7px"
            this.FileOrDirImage.style.userSelect = "none"

        this.calculatePosition = function() {
            const rect = this.Container.getBoundingClientRect();
            this.x = rect.left + window.scrollX; // X position relative to the document
            this.y = rect.top + window.scrollY;  // Y position relative to the document
        };
    }

    remove(){
        if(filesContainer.contains(this.Container)){
            filesContainer.removeChild(this.Container)
        }
    }
    // highlight the file object as selected
    Select(){
        this.selected = true
        this.Container.style.backgroundColor = "darkgrey"
    }
    // unselect this element
    unselect(){
        this.selected = false
        this.Container.style.backgroundColor = "rgb(74, 74, 74)"
    }
    // makes sure that if another file is clicked, the prevous file stops being selected
    SelectOpenListeners(){
        this.Container.addEventListener("click", (event) => {
            if(this.selected === false){
                for(let file of FilesInDir){
                    file.unselect()
                }
                this.Select()
            }
        })
        // when double clicked, open the directory/file
        this.Container.addEventListener("dblclick", (event) => {
            try{
                this.Open()
            } catch(error){
                alert(error)
            }
        })
    }

    Open(){
        // checks if the opened element is a file or a directory and opens it
        if(this.isfile === false){
            FilesInDir.forEach(file => file.remove()); 
            FilesInDir.length = 0; 
            Directory.push(`${this.name}\\`)

            updateDirectoryPath()
            CreateFilesInDirectory(FilesInDir)
        }else{
            // open file
            let command = `start "" "${this.location}"`.toString()
            try{
                window.child_process.execute(command, (err, stdout, stderr) => {
                    if(err || stderr){
                        console.log("Error", stderr)
                    }else{
                        null
                    }
                })
            } catch(error){
                alert(error)
            }
        }
    }
    Create(){
        // set the image for this element
        if(this.isfile){
            this.FileOrDirImage.src = "./pictures/file.png"
        }else{
            this.FileOrDirImage.src = "./pictures/directory.png"
        }
        this.Container.appendChild(this.FileOrDirImage)
        this.Container.appendChild(this.FilenameLabel)

        if(this.isfile){
            this.FilesizeLabel = document.createElement("label");
            this.FilesizeLabel.style.userSelect = "none"
            this.FilesizeLabel.id = "File-Object-Size"
            this.FilesizeLabel.textContent = this.size + " kb"
            this.Container.appendChild(this.FilesizeLabel)
        }

        filesContainer.appendChild(this.Container)
    }
}