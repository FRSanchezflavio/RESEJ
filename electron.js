const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'frontend/public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // Permitir comunicación con API backend
      webSecurity: true,
    },
    autoHideMenuBar: true,
    title: 'Sistema RESEJ - Policía',
    backgroundColor: '#ffffff',
  });

  // En desarrollo: conectar a servidor Vite
  // En producción: cargar archivos build
  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'frontend/dist/index.html')}`;

  mainWindow.loadURL(startURL);

  // Abrir DevTools solo en desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Abrir enlaces externos en el navegador predeterminado
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Deshabilitar aceleración de hardware si hay problemas de rendimiento
// app.disableHardwareAcceleration();
