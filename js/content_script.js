// document.body.style.backgroundColor = 'blue'
function getDownloadUrls (filterStr) {
  let urls1 = getLinkUrl(), urls2 = getImgUrl(), urls3 = getVideoUrl()
  let urls = [...urls1, ...urls2, ...urls3]
  urls = unique(filter(urls, filterStr))
  return urls
}
function unique (urls) {
  // 去重
  obj = {}
  urls.forEach((item) => {
    obj[item.url] = item
  })
  urls = Object.values(obj)
  return urls
}
function filter (urls, filterStr) {
  filterStr = filterStr.toLowerCase()
  return urls.filter((item) => {
    let link = item.url.toLowerCase()
    if (!/(^http(s)?:\/\/)|(^ftp)|(^magnet)|(^ed2k)|^(blob:)/.test(link)) {
      return false
    }
    if (filterStr) {
      if (filterStr[0] === '/' && filterStr[filterStr.length - 1] === '/') {
        let regex = new RegExp(filterStr.slice(1, filterStr.length - 1), 'i')
        return regex.test(link)
      }
      return link.indexOf(filterStr) > -1
    }
    return true
  })
}

// a标签url
function getLinkUrl () {
  let urls = document.querySelectorAll('a[href]')
  urls = [...urls]
  urls = urls.map((a) => {
    return {
      url: a.href,
      name: a.download || a.href.split('/').pop() || a.title || a.alt || Math.random().toString(32).slice(2)
    }
  })
  return urls
}
// img src
function getImgUrl () {
  let urls = document.querySelectorAll('img[src]')
  urls = [...urls]
  urls = urls.map((item) => {
    return {
      url: item.src,
      name: item.alt || item.title || item.src.split('/').pop() || Math.random().toString(32).slice(2)
    }
  })
  return urls
}
// video src
function getVideoUrl () {
  let urls = document.querySelectorAll('video[src]')
  urls = [...urls]
  urls = urls.map((img) => {
    return {
      url: img.src,
      name: img.alt || img.title || img.src.split('/').pop() || Math.random().toString(32).slice(2)
    }
  })
  return urls
}

// chrome.runtime.sendMessage('sendid')
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'sendFilter') {
    let urls = getDownloadUrls(msg.data)
    chrome.runtime.sendMessage({
      type: 'sendUrl',
      data: urls
    })
  }

  // chrome.runtime.sendMessage(urls)
  // 发给background
  // chrome.extension.sendMessage(urls)
})

