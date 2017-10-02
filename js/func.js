function getDownloadUrls () {
  let urls = document.querySelectorAll('a[href]')
  urls = [...urls]
  urls = urls.map((a) => {
    return {
      url: a.href,
      name: a.download || a.href.split('/').pop() || Math.random().toString(32).slice(2)
    }
  })
  console.log(urls)
  document.body.style.backgroundColor = 'red'
  return urls
}
getDownloadUrls()
