// import $ from './jquery-3.2.1.min.js'
// let getDownloadUrls = () => {
//   let urls = $('a[href]').map((a) => {
//     return a.href
//   })
//   console.log(urls)
//   document.body.style.backgroundColor = 'red'
// }
// document.getElementById('download').addEventListener('click', () => {
//   // 在当前页面执行脚本
//   chrome.tabs.executeScript(null, {
//     // code: `getDownloadUrls()`,
//     file: 'js/func.js'
//   }, (result) => {
//     result = result[0]
//     console.log(result)

//     result.map((item) => {
//       let domain = item.url.split('/')[2]
//       let name = item.name
//       console.log(`so_download/${domain}/${name}`)
//       // 下载文件
//       chrome.downloads.download({
//         url: item.url,
//         filename: `so_download/${domain}/${name}`
//       })
//     })
//   })
// }, false)

let urls = [], filterStr = '', downloadQueue = [], MAX_DOWNLOADING = 2
document.getElementById('filterInput').addEventListener('input', (e) => {
  filterStr = e.target.value
})
document.getElementById('filter').addEventListener('click', (e) => {
  sendFilter()
}, false)
document.getElementById('download').addEventListener('click', () => {
  // sendFilter()
  chrome.runtime.sendMessage({type: 'download'})
  // setTimeout(download, 1000)
  console.log('download')
}, false)

document.getElementById('btn-img').addEventListener('click', (e) => {
  filterStr = '/(.jpg)|(.jpeg)|(.png)|(.gif)/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)
document.getElementById('btn-mp3').addEventListener('click', (e) => {
  filterStr = '/(.mp3)|(.wav)/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)
document.getElementById('btn-zip').addEventListener('click', (e) => {
  filterStr = '/(.zip)|(.rar)/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)
document.getElementById('btn-pdf').addEventListener('click', (e) => {
  filterStr = '/.pdf/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)
document.getElementById('btn-doc').addEventListener('click', (e) => {
  filterStr = '/.doc/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)
document.getElementById('downloading').addEventListener('click', (e) => {
  filterStr = '/.doc/'
  document.getElementById('filterInput').value = filterStr
  sendFilter()
}, false)

function sendFilter () {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    var tab = tabs[0]
    console.log(tab)
    // 需要知道tab id 并且给content script 只能用tab
    chrome.tabs.sendMessage(tab.id, {
      type: 'sendFilter',
      data: filterStr
    })
  })
}
function listUrl () {
  // chrome.runtime.sendMessage(filterStr)
  $('#filter-list').empty()
  urls.forEach((item) => {
    let name = item.name.length > 15 ? '...' + item.name.slice(-15) : item.name
    $('#filter-list').append(`<a target="_blank" title="${item.url}" href="${item.url}" class="list-group-item">${name}</a>`)
  })
}
function listQueue () {
  $('#downloading').empty()
  downloadQueue.forEach((item) => {
    let name = item.name.length > 15 ? '...' + item.name.slice(-15) : item.name
    $('#downloading').append(`<a target="_blank" title="${item.url}" href="${item.url}" class="list-group-item">${name}</a>`)
  })
}
// function download () {
//   downloadQueue = downloadQueue.concat(urls)
//   let list = downloadQueue.splice(0, MAX_DOWNLOADING)
//   list.map((item) => {
//     chrome.downloads.download({
//       url: item.url
//     })
//   })
//   listQueue()
// }
// 先要接收一个runtime msg，获取senderid
chrome.runtime.onMessage.addListener((msg, sender,) => {
  if (msg.type === 'listUrl') {
    urls = msg.data
    listUrl()
  }
  if (msg.type === 'listDownloadQueue') {
    downloadQueue = msg.data
    listQueue()
  }
})
// // 修改文件名和文件路径
// chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
//   console.log(downloadItem)
//   let subDir = downloadItem.url.split('/')[2]
//   let suggestion = {
//     filename: `so_download/${subDir}/${downloadItem.filename}`
//   }
//   suggest(suggestion)
// })
// // 维护一个下载队列，下载完成pop
// chrome.downloads.onChanged.addListener((downloadDelta) => {
//   if (downloadDelta.state &&
//     (downloadDelta.state.current === 'interrupted' || downloadDelta.state.current === 'complete') &&
//     downloadQueue.length > 0) {
//     let task = downloadQueue.shift()
//     setTimeout((task) => {
//       chrome.downloads.download({
//         url: task.url
//       })
//       listQueue()
//       console.warn('开始下一个')
//     }, 2000, task)
//   }
// })

