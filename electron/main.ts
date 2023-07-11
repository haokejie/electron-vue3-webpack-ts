const { app, BrowserWindow } = require('electron')
const join = require('path').join
const { MODE_PATH } = require('./config.json')
// 引入 dotenv 模块
const dotenv = require('dotenv')
// 调用 dotenv.config() 方法，读取 .env 文件
dotenv.config({
  path: MODE_PATH
})
// 现在您可以在代码中访问环境变量
console.log('环境变量', MODE_PATH)
console.log('环境变量', process.env.NODE_ENV)
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  // win.loadFile('index.html')
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080')
  } else {
    win.loadFile(join(__dirname, '..', 'web', 'index.html'))
  }
  // win.loadFile(join(__dirname, '..', 'web', 'index.html'))
  // win.loadURL('http://localhost:8080')
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
  app.quit()
})
