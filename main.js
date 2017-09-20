const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './favicon.ico',
    frame: false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))



  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // // Emitted when the window is closed.
  // mainWindow.on('closed', function () {
  //   if (!application.isQuiting && process.platform == 'darwin') {
  //     event.preventDefault()
  //     mainWindow.hide();
  //   }
  //   return false;
  // })

  // Emitted minimize window
  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();

    appIcon = new Tray('./favicon.ico');
    var contextMenu = Menu.buildFromTemplate([

      {
        label: 'Show App',
        click: function () {
          mainWindow.show();
        }
      },
      {
        label: 'Quit',
        click: function () {
          application.isQuiting = true;
          application.quit();

        }
      }
    ]);
    appIcon.setToolTip('Electron.js App');
    appIcon.setContextMenu(contextMenu);

    if (appIcon) {
      appIcon.on('double-click', () => {
        mainWindow.show();
      })
      appIcon.displayBalloon({
        title: 'Crytpo Watchdog',
        content: 'Minimized to tray'
      })
    }

  })



  mainWindow.on('show', () => {
    appIcon.destroy();
  })

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  if (appIcon) appIcon.destroy()

})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})