// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");
const nativeImage = require("electron").nativeImage;

let appIcon = null;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    center: true,
    show: false,
    alwaysOnTop: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  // mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, "src/index.html"));
  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.on("hide", () => {
    console.log("Executed..");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);
// app.whenReady().then(crateSettingWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin" || process.platform !== "win32") {
    app.quit();
  }
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on("ready", () => {
  var iconPath = path.join(__dirname, "/images/tray-icon.png");
  let trayIcon = nativeImage.createFromPath(iconPath);
  appIcon = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Settings",
      click: () => {
        crateSettingWindow();
      },
    },
    {
      label: "Quit",
      click: () => {
        console.log("Quit Clicked");
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);
  appIcon.setToolTip("Time Braker");
  appIcon.setContextMenu(contextMenu);
});

/* Create  Settings Window*/
function crateSettingWindow() {
  const settingsWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: true,
    center: true,
    show: true,
    autoHideMenuBar: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  settingsWindow.loadFile(path.join(__dirname, "src/settings.html"));
  // Open the DevTools.
  // settingsWindow.webContents.openDevTools({ mode: "detach" });

  settingsWindow.on("closed", () => {
    console.log("Settings Colosed..");
  });
}
