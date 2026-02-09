const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  resizeWindow: (width, height) =>
    ipcRenderer.invoke('resize-window', width, height)
})