
const https = require('https')
    , fs = require('fs')
    , path = require('path')

var URL
    URL = (typeof window !== 'undefined' && window.URL)
      ? window.URL : require('url').URL

function features(url_object) {
  url_object.download = features.download(url_object)
  url_object.downloadToFile = features.downloadToFile(url_object)

  return url_object
}

features.download = url_object =>
  (options = {timeout: features.request_timeout}) =>
    new Promise((resolve, reject) => {
      const request = https.get(
        Object.assign(
          options,
          URL.parse(url_object.toString())
        ),
        resolve
      )
      request.on('error', reject)
      request.on('timeout', reject)
      request.end()
    })

features.downloadToFile = url_object =>
  (file_path, options) =>
    features.download(url_object)(options).then(response =>
      response.pipe(fs.createWriteStream(path.resolve(file_path)))
    )

features.request_timeout = 5000

module.exports = features