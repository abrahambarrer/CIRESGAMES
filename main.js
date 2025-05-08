const { app, BrowserWindow, screen } = require('electron/main')

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const win = new BrowserWindow({
    width: width,
    height: height,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('pantallaInicio.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})