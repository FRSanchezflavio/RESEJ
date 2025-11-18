const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess = null;

// Configuración de paths
const isDev = process.env.NODE_ENV === 'development';
const backendPath = isDev 
  ? path.join(__dirname, 'BACKEND') 
  : path.join(process.resourcesPath, 'BACKEND');
const frontendPath = isDev 
  ? path.join(__dirname, 'frontend', 'dist')
  : path.join(process.resourcesPath, 'frontend', 'dist');

// Cargar variables de entorno del backend
function loadEnvFile() {
  const envPath = path.join(backendPath, '.env');
  const envExamplePath = path.join(backendPath, '.env.example');
  
  // Si no existe .env, crear uno desde .env.example
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('Creando .env desde .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
  }
  
  // Cargar las variables de entorno
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log('Variables de entorno cargadas desde:', envPath);
  } else {
    console.warn('Advertencia: No se encontró archivo .env');
  }
}

// Iniciar el servidor backend
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('Iniciando servidor backend...');
    
    // Cargar variables de entorno antes de iniciar el backend
    loadEnvFile();
    
    const serverPath = path.join(backendPath, 'server.js');
    
    if (!fs.existsSync(serverPath)) {
      const error = `No se encontró el servidor en: ${serverPath}`;
      console.error(error);
      reject(new Error(error));
      return;
    }
    
    backendProcess = spawn('node', [serverPath], {
      cwd: backendPath,
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Backend] ${output}`);
      
      // Detectar cuando el servidor esté listo
      if (output.includes('Servidor iniciado') || output.includes('listening')) {
        resolve();
      }
    });
    
    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString()}`);
    });
    
    backendProcess.on('error', (error) => {
      console.error('Error al iniciar el backend:', error);
      reject(error);
    });
    
    backendProcess.on('exit', (code) => {
      console.log(`Backend cerrado con código: ${code}`);
      backendProcess = null;
    });
    
    // Timeout de 10 segundos para iniciar
    setTimeout(() => {
      if (backendProcess) {
        resolve(); // Asumir que está listo después del timeout
      }
    }, 10000);
  });
}

// Crear ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'image', 'logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    autoHideMenuBar: true,
    title: 'RE.SE.J - Sistema de Registro de Secuestros Judiciales'
  });

  // Cargar la aplicación frontend
  if (isDev) {
    // En desarrollo, usar el servidor de Vite
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar los archivos estáticos
    const indexPath = path.join(frontendPath, 'index.html');
    console.log('Frontend path:', frontendPath);
    console.log('Index path:', indexPath);
    console.log('Existe index.html?', fs.existsSync(indexPath));
    
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
      // Abrir DevTools temporalmente para debug
      mainWindow.webContents.openDevTools();
      
      // Interceptar errores de carga
      mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Error cargando página:', errorCode, errorDescription);
      });
      
      // Log cuando termine de cargar
      mainWindow.webContents.on('did-finish-load', () => {
        console.log('Página cargada correctamente');
      });
    } else {
      console.error('No se encontró el archivo index.html en:', indexPath);
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Prevenir navegación externa
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

// Detener el servidor backend
function stopBackend() {
  if (backendProcess) {
    console.log('Deteniendo servidor backend...');
    backendProcess.kill();
    backendProcess = null;
  }
}

// Verificar que PostgreSQL esté disponible
async function checkDatabase() {
  return new Promise((resolve) => {
    const { Client } = require('pg');
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'resej_db',
      user: process.env.DB_USER || 'resej_user',
      password: process.env.DB_PASSWORD
    };
    
    const client = new Client(dbConfig);
    
    client.connect()
      .then(() => {
        console.log('✓ Conexión a PostgreSQL exitosa');
        client.end();
        resolve(true);
      })
      .catch((err) => {
        console.error('✗ Error conectando a PostgreSQL:', err.message);
        console.log('\nAsegúrate de que:');
        console.log('1. PostgreSQL esté instalado y en ejecución');
        console.log('2. La base de datos exista');
        console.log('3. Las credenciales en .env sean correctas');
        resolve(false);
      });
  });
}

// Evento: Aplicación lista
app.whenReady().then(async () => {
  console.log('=== Iniciando RE.SE.J ===');
  
  // Cargar variables de entorno
  loadEnvFile();
  
  // Verificar conexión a base de datos
  const dbOk = await checkDatabase();
  if (!dbOk) {
    console.warn('⚠ Advertencia: No se pudo conectar a la base de datos');
  }
  
  // Iniciar backend
  try {
    await startBackend();
    console.log('✓ Backend iniciado correctamente');
  } catch (error) {
    console.error('✗ Error al iniciar backend:', error.message);
  }
  
  // Dar tiempo al backend para inicializar completamente
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cerrar cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

// Cerrar el backend antes de salir
app.on('before-quit', () => {
  stopBackend();
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

// IPC Handlers (para comunicación con el renderer process)
ipcMain.handle('get-backend-status', () => {
  return backendProcess !== null;
});

ipcMain.handle('restart-backend', async () => {
  stopBackend();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await startBackend();
  return true;
});
