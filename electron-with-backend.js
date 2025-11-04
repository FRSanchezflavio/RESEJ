const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let backendProcess;

function startBackend() {
  console.log('Iniciando servidor backend...');

  const backendPath = path.join(__dirname, 'BACKEND', 'server.js');

  // Iniciar el proceso del backend
  backendProcess = spawn('node', [backendPath], {
    env: {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: '3001',
    },
    cwd: path.join(__dirname, 'BACKEND'),
  });

  backendProcess.stdout.on('data', data => {
    console.log(`Backend: ${data.toString()}`);
  });

  backendProcess.stderr.on('data', data => {
    console.error(`Backend Error: ${data.toString()}`);
  });

  backendProcess.on('close', code => {
    console.log(`Backend cerrado con código ${code}`);
  });
}

function createWindow() {
  // Iniciar el backend primero
  startBackend();

  // Esperar a que el backend inicie (3 segundos)
  setTimeout(() => {
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
        webSecurity: true,
      },
      autoHideMenuBar: true,
      title: 'Sistema RESEJ - Policía',
      backgroundColor: '#ffffff',
    });

    // En desarrollo conecta a Vite, en producción al backend
    const startURL = isDev ? 'http://localhost:5173' : 'http://localhost:3001';

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
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    });

    // Manejar errores de carga
    mainWindow.webContents.on(
      'did-fail-load',
      (event, errorCode, errorDescription) => {
        console.error('Error al cargar:', errorDescription);

        // Reintentar después de 2 segundos
        setTimeout(() => {
          mainWindow.loadURL(startURL);
        }, 2000);
      }
    );
  }, 3000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // Cerrar el proceso del backend
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Asegurar que el backend se cierre
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
});

// Manejar cierre inesperado
process.on('exit', () => {
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
});
