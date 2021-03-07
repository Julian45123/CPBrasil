const { app, BrowserWindow } = require('electron')
const path = require('path')
const DiscordRPC = require('discord-rpc')

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
app.commandLine.appendSwitch('ppapi-flash-version', '32_32_0_0_303')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    title: 'Connecting...',
    icon: __dirname + '/favicon.ico',
    backgroundColor: '#22a4f3',
    webPreferences: {
      plugins: true,
    },
  })

  mainWindow.loadURL('https://cpbrasil.pw/play/').then(() => {
    mainWindow.maximize()
    mainWindow.setMenu(null)
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const clientId = '815061695831212093'
const startTimestamp = new Date()
const rpc = new DiscordRPC.Client({ transport: 'ipc' })

async function setActivity() {
  if (!rpc) {
    return
  }

  await rpc.setActivity({
    details: `Pinguinando`,
    state: `cpbrasil.pw`,
    startTimestamp,
    largeImageKey: `main-logo`,
  })
}

rpc.on('ready', async () => {
  await setActivity()

  setInterval(() => {
    setActivity()
  }, 15e3)
})

rpc.login({ clientId }).catch(console.error)
