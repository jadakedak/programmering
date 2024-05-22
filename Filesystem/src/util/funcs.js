// get all the disks and append them to the Drives list
function GetDisks(){
    diskAPI.getDiskInfo().then(disks => {
        for(const disk of disks){
            let name = disk._mounted
            let capacity = disk._capacity
            let filesystem = disk._filesystem
    
            const drive = new Drive(name, capacity, filesystem)
            Drives.push(drive)
        }
      }).catch(error => {
        console.log(error)
    })
}

// update the contents of the current directory
function UpdateDirectoryFiles(){
    for(let file of FilesInDir){
        file.remove()
    }
    CreateFilesInDirectory(FilesInDir)
}

// updates the Drive Shortcuts
function UpdateDriveShortcuts(){
    for(let shortcut of DriveShortcuts){
        shortcut.remove()
    }
    DriveShortcuts.length = 0;
    CreateDriveShortcuts()
}

// updates the Drives
function UpdateDrives(){
    ClearDisks()
    Drives.length = 0;
    GetDisks()
    setTimeout(() => {
        CreateDisks()
    }, 100)
}

// removes all of the drives so they arent visible in the ui
function ClearDisks(){
    for(let drive of Drives){
        drive.remove()
    }
}

// create all of the drives in the Drives list
function CreateDisks(){
    for(let drive of Drives){
        drive.Create();
        drive.ListenForSelect()
    }
}

// clears all files so they arent visible in the ui
function ClearFiles(){
    for(let file of FilesInDir){
        file.remove()
    }
    FilesInDir.length = 0;
}

// read a directory, if directory is null, it reads from FilesInDir
async function GetFilesInDirectory(outputlist, directory = null) {
    return new Promise((resolve, reject) => {
        let dirtoread = directory === null ? GetActualDirectory() : directory;
        let dir_as_list = true;
        directory === null ? dir_as_list = true : dir_as_list = false;

        if (dir_as_list === true) {
            ClearFiles()
        }

        files.readdir(dirtoread, (err, f) => {
            if (err) {
                reject(err);
                return;
            }
            // creates the full path for the file
            for (let fil of f) {
                let fullpath = dirtoread + "\\" + fil;
                try {
                    // get all of the statistics of the file or directory
                    const stats = files.statSync(fullpath);
                    // check if this element is a directory or file
                    const isDirectory = (stats.mode & fs.constants.S_IFDIR) === fs.constants.S_IFDIR;

                    // Create the new element
                    let Newfile = new FileObj(fil, stats.size, fullpath, false);
                    isDirectory === true ? Newfile.isfile = false : Newfile.isfile = true;

                    // append them to the output list
                    outputlist.push(Newfile);
                } catch (error) {
                    if (error.code === "EBUSY" || error.code === "EPERM") {
                        continue;
                    }
                }
            }
            // adds all of the context menu listeners on the file/directory objects
            if (dir_as_list === true) {
                for (let file of FilesInDir) {
                    file.Container.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                        ipcRenderer.send("File-Context-Menu", JSON.stringify(file))
                    });
                }
            }
            // resolve the promise when the action is complete
            resolve(outputlist);
        });
    });
}

