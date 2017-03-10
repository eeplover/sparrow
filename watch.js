const fs = require('fs')
const path = require('path')
const watch = (dir, except) => {
  let files = fs.readdirSync(dir)
  except && (() => {
    files = files.filter((item) => {
      return item.indexOf(except) === -1
    })
  })();

  files.forEach((item) => {
    item = dir + '/' + item
    let stats = fs.lstatSync(item)
    if (stats.isFile()) {
      item = path.resolve(item)

      // NOTICE: 这里不用fs.watch是因为这货在各平台使用时需要安装依赖
      fs.watchFile(item, {
        persistent: true,
        interval: 1000
      }, cbk)

      function cbk(curr, prev) {
        if (curr.mtime !== prev.mtime) {
          delete require.cache[item]
        }
      }

    } else if (stats.isDirectory()) {
      watch(item, except)
    }
  })
}

module.exports = watch
