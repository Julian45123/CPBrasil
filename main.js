const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const DiscordRPC = require('discord-rpc')

const path = require('path')

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'flash/pepflashplayer32_32_0_0_303.dll'
    break
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'flash/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))

autoUpdater.checkForUpdatesAndNotify()
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Connecting...',
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      plugins: true,
    },
  })
  mainWindow.maximize()

  mainWindow.setMenu(null)
  mainWindow.loadURL('https://cpbrasil.pw/play/')

  const clientId = '815061695831212093'
  DiscordRPC.register(clientId)
  const rpc = new DiscordRPC.Client({ transport: 'ipc' })
  const startTimestamp = new Date()
  rpc.on('ready', () => {
    rpc.setActivity({
      details: `Pinguinando`,
      state: `cpbrasil.pw`,
      startTimestamp,
      largeImageKey: `main-logo`, //,
    })
  })
  rpc.login({ clientId }).catch(console.error)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
