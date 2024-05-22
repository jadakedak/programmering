const { contextBridge, ipcRenderer } = require('electron');
const { exec } = require('child_process')

const fs = require('fs');
const path = require('path')
const ndi = require("node-disk-info")

contextBridge.exposeInMainWorld('fs', {
  readdir: fs.readdir,
  constants: fs.constants,
  statSync: fs.statSync
})

contextBridge.exposeInMainWorld('path', {
  join: path.join
})

contextBridge.exposeInMainWorld('child_process', {
  execute: (filePath, callback) => {
    exec(filePath, (error, stdout, stderr) => {
        if (callback) {
            callback(error, stdout, stderr);
        }
    });
  }
})

contextBridge.exposeInMainWorld('diskAPI', {
  getDiskInfo: () => {
    return ndi.getDiskInfo();
  }
})


contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
      // Whitelist channels
      let validChannels = ["Open-Directory", "update-directory", "File-Context-Menu", "Normal-Context-Menu", "Remove-File"];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
  },
  receive: (channel, func) => {
    let validChannels = ["Open-Directory", "update-directory", "File-Context-Menu", "Normal-Context-Menu", "Remove-File"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});