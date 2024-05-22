const NewFolderButton = document.getElementById("New-Folder-Button");

const inputDialog = document.getElementById("inputDialog");
const userInput = document.getElementById("userInput");
const submitInput = document.getElementById("submitInput");
const cancelInput = document.getElementById("cancelInput");

const NewFileButton = document.getElementById("New-File-Button")

const inputDialog_2 = document.getElementById("inputDialog_2");
const userInput_2 = document.getElementById("userInput_2");
const submitInput_2 = document.getElementById("submitInput_2");
const cancelInput_2 = document.getElementById("cancelInput_2");

const deletebutton = document.getElementById("Delete-File-Button");

function GetCwd(){
  let actDir = ""
  for(let dir of Directory){
      actDir += dir
  }
  return actDir
}

function FileSelected(){
  for(let file of FilesInDir){
    if(file.selected){
      return true
    }else{
      null
    }
  }
  return false
}

setInterval(() => {
    if(Directory.length === 0){
        NewFolderButton.disabled = true
        NewFileButton.disabled = true
    }else{
        NewFolderButton.disabled = false
        NewFileButton.disabled = false;
    }

    if(FileSelected()){
      deletebutton.disabled = false
    }else{
      deletebutton.disabled = true
    }
}, 50)


NewFolderButton.addEventListener('click', () => {
  inputDialog.style.display = 'block';
  userInput.value = '';
  userInput.focus();
});

NewFileButton.addEventListener("click", () => {
  inputDialog_2.style.display = 'block';
  userInput_2.value = '';
  userInput_2.focus();
})


function CreateMissingFile(path){
  let old_files = []
  fs.readdir(path, (err, f) => {
    for(let oldfile of FilesInDir){
      old_files.push(oldfile.name)
    }
    for(let file of f){
      if(!old_files.includes(file)){
        let fullpath = path + "\\" + file
        const stats = files.statSync(fullpath);
        const isDirectory = (stats.mode & fs.constants.S_IFDIR) === fs.constants.S_IFDIR;
        // Create the new element
        let Newfile = new FileObj(file, stats.size, fullpath, false);
        isDirectory === true ? Newfile.isfile = false : Newfile.isfile = true;

        Newfile.Create()
        Newfile.SelectOpenListeners()
        Newfile.Container.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          ipcRenderer.send("File-Context-Menu", JSON.stringify(Newfile))
        });
        FilesInDir.push(Newfile)
      }
    }
  }
)}


submitInput.addEventListener('click', function() {
  const FolderName = userInput.value;
  if(FolderName){
    const command = `mkdir ${GetCwd()}${FolderName}`
    window.child_process.execute(command, (err, stdout, stderr) => {
      if(stderr){
          console.log("Error", stderr)
      }else{
        if(FilesInDir.length <= 0){
          UpdateDirectoryFiles()
        }else{
          setTimeout(() => {
            CreateMissingFile(GetCwd())
          }, 100)
        }
        /*
        setTimeout(() => {
          fs.readdir(dir, (err, f) => {
            for(let oldfile of FilesInDir){
              old_files.push(oldfile.name)
            }
            for(let file of f){
              if(!old_files.includes(file)){
                let fullpath = dir + "\\" + file
                const stats = files.statSync(fullpath);
                const isDirectory = (stats.mode & fs.constants.S_IFDIR) === fs.constants.S_IFDIR;

                // Create the new element
                let Newfile = new FileObj(file, stats.size, fullpath, false);
                isDirectory === true ? Newfile.isfile = false : Newfile.isfile = true;

                Newfile.Create()
                Newfile.SelectOpenListeners()
              }
            }
          }, 100)
        })
        */
        //UpdateDirectoryFiles()
      }
    })
  }else{
    return;
  }
  inputDialog.style.display = 'none';
});

submitInput_2.addEventListener("click", function(){
  const filename = userInput_2.value;
  if(filename){
    const command = `echo. > ${GetCwd()}${filename}`

    window.child_process.execute(command, (err, stdout, stderr) => {
      if(stderr){
        console.log("Error", stderr)
      }else{
        if(FilesInDir.length <= 0){
          UpdateDirectoryFiles()
        }else{
          setTimeout(() => {
            CreateMissingFile(GetCwd())
          }, 100)
        }
      }
    })
  }else{
    return;
  }
  inputDialog_2.style.display = 'none';
})



cancelInput.addEventListener('click', function() {
    inputDialog.style.display = 'none';
});

cancelInput_2.addEventListener("click", function(){
  inputDialog_2.style.display = 'none';
})


deletebutton.addEventListener("click", function(){
  let command;
  for(let file of FilesInDir){
    if(file.selected){
      file.isfile === true ? command = `del ${file.location}` : command = `rmdir ${file.location}`
      window.child_process.execute(command, (err, stdout, stderr) => {
        if(err || stderr){
          null
        }else{
          file.remove()
          if(FilesInDir.includes(file)){
            let index = FilesInDir.indexOf(file)
            FilesInDir.splice(index, 1)
          }
          if(FilesInDir.length <= 0){
            filesContainer.appendChild(empty_dir)
          }
          //UpdateDirectoryFiles()
        }
      })
    }
  }
})