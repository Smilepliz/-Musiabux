const { app, BrowserWindow } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // В собранном приложении грузим dist/index.html
  const distPath = path.join(__dirname, '..', 'dist', 'index.html');
  const indexUrl = pathToFileURL(distPath).href;
  win.loadURL(indexUrl);

  win.on('closed', () => app.quit());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
