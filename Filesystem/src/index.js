const { app, BrowserWindow, Menu, MenuItem, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
const { exec } = require("child_process")

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 630,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};

const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        click: () => {
          app.quit()
        },
        accelerator: 'Ctrl+Q'
      }
    ]
  },
  {
    label: "window",
    submenu: [
      {
      label: "New Window",
      click: () => {
        createWindow()
      },
      accelerator: 'Ctrl+N'
    }
  ]
  },
  {
    label: "settings",
    click: () => {
      // message to renderer
    },
    accelerator: "Ctrl+I"
  }
]

//ipcMain.on("Normal-Context-Menu", (event) => {
//  const NormalContextMenu = new Menu();
//
//  const NewSubmenu = new Menu();
//  NewSubmenu.append(new MenuItem({label: "file", click(){ console.log("New File") }}))
//  NewSubmenu.append(new MenuItem({label: "folder", click(){ console.log("new folder") }}))
//
//
//  NormalContextMenu.append(new MenuItem({label: 'New', submenu: NewSubmenu}))
//
//  const window = BrowserWindow.fromWebContents(event.sender);
//  NormalContextMenu.popup({window: window});
//})


// listener for om en file er blevet højre klikket

ipcMain.on("File-Context-Menu", (event, File) => {
  // lav fil objectet fra en json string tilbage til et file object
  let file = JSON.parse(File)
  // ny context menu
  const specialContextMenu = new Menu();
  // Add items to specialContextMenu based on arg or other conditions
  specialContextMenu.append(new MenuItem({ label: 'Open', click() { 
    let command;
    file.isfile === true ? command = `start "" "${file.location}"`.toString() : event.sender.send('Open-Directory', File)
    if(file.isfile){
      exec(command, (err, stdout, stderr) => {
        if(stderr){
          console.log("Error", stderr)
        }
      })
    }
   }}
  ))
  specialContextMenu.append(new MenuItem({ label: 'Rename', click() { 
    let parsed_file = JSON.parse(File);
    console.log(parsed_file)
  }
  }));
  specialContextMenu.append(new MenuItem({ label: 'Delete', click() { 
    let parsed_file = JSON.parse(file)
    let command;
    // sæt command alt efter om filen er en folder eller en fil
    file.isfile === true ? command = `del ${parsed_file.location}` : command = `rmdir ${parsed_file.location}`
    // kør commanden
    exec(command, (error, stdout, stderr) => {
      if(error || stderr){
        // vis fejl i console
        console.log(error, stderr)
      }else{
        // send "remove-file" request til render.js
        event.sender.send('Remove-File', JSON.stringify(file))
      }
    })
  } }));

  // You can access the BrowserWindow from the event.sender
  const win = BrowserWindow.fromWebContents(event.sender);
  specialContextMenu.popup({window: win});
}); 

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

