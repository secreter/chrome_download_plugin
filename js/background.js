
// ///////////////////////////////////////////////////////
// popup --> content_script -->background.js --> popup //
// ///////////////////////////////////////////////////////

let urls = [], filterStr = '', downloadQueue = [], MAX_DOWNLOADING = 2

function download () {
  downloadQueue = downloadQueue.concat(urls)
  let list = downloadQueue.splice(0, MAX_DOWNLOADING)
  if (list.length === 0) {
    return
  }
  list.map((item) => {
    chrome.downloads.download({
      url: item.url
    })
  })
}
// chrome.browserAction.onClicked.addListener(function (tab) {
//     // 扩展向内容脚本发送消息
//   chrome.tabs.sendMessage(tab.id, {
//     greeting: 'hello to content script!'
//   }, function (response) {
//     console.log(response.farewell)
//   })
// })
// 接收消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'sendUrl') {
    urls = msg.data
    chrome.runtime.sendMessage({
      type: 'listUrl',
      data: urls
    })
  }
  if (msg.type === 'download') {
    download()
    chrome.runtime.sendMessage({
      type: 'listDownloadQueue',
      data: downloadQueue
    })
  }
})
// 修改文件名和文件路径
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  console.log(downloadItem)
  let subDir = downloadItem.url.split('/')[2]
  let suggestion = {
    filename: `so_download/${subDir}/${downloadItem.filename}`
  }
  suggest(suggestion)
})
// 维护一个下载队列，下载完成pop
chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state &&
    (downloadDelta.state.current === 'interrupted' || downloadDelta.state.current === 'complete') &&
    downloadQueue.length > 0) {
    let task = downloadQueue.shift()
    setTimeout((task) => {
      chrome.downloads.download({
        url: task.url
      })
      chrome.runtime.sendMessage({
        type: 'listDownloadQueue',
        data: downloadQueue
      })
      console.warn('开始下一个')
    }, 2000, task)
  }
})

