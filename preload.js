const { contextBridge, ipcRenderer } = require('electron')

// デバッグ情報をコンソールに出力
console.log('preload.jsが読み込まれました');

// contextBridgeを使用してAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
  startRecording: (sourceId) => ipcRenderer.invoke('start-recording', sourceId),
  stopRecording: () => ipcRenderer.invoke('stop-recording')
}) 