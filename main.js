const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

// デバッグ情報をコンソールに出力
console.log('main.jsが読み込まれました');

// 録画関連の変数
let mainWindow = null;
let mediaRecorder = null;
let recordedChunks = [];

function createWindow () {
  console.log('createWindowが呼び出されました');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // セキュリティのためfalseに設定
      contextIsolation: true,
      webSecurity: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // デベロッパーツールを開く
  mainWindow.webContents.openDevTools();

  // プリロードスクリプトが正しく読み込まれたか確認
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('ページの読み込みが完了しました');
    mainWindow.webContents.executeJavaScript(`
      console.log('window.electron:', window.electron);
      console.log('window.electron.desktopCapturer:', window.electron ? window.electron.desktopCapturer : 'undefined');
    `);
  });

  mainWindow.loadFile('index.html')
}

// IPCハンドラーを設定
ipcMain.handle('get-screen-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 320, height: 180 }
    });
    console.log('取得したソース:', sources);
    return sources;
  } catch (error) {
    console.error('get-screen-sources エラー:', error);
    throw error;
  }
});

ipcMain.handle('start-recording', async (event, sourceId) => {
  try {
    console.log('録画開始:', sourceId);
    // ここでは実際の録画処理は行わず、成功したことを返すだけ
    return { success: true };
  } catch (error) {
    console.error('start-recording エラー:', error);
    throw error;
  }
});

ipcMain.handle('stop-recording', async () => {
  try {
    console.log('録画停止');
    // ここでは実際の録画停止処理は行わず、成功したことを返すだけ
    return { success: true };
  } catch (error) {
    console.error('stop-recording エラー:', error);
    throw error;
  }
});

app.whenReady().then(() => {
  console.log('アプリが準備できました');
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