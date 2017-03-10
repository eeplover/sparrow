const NodeFetch = require('node-fetch')

const fetch = (context) => {
  return async function(phps) {
    const ctx = this.ctx || context
    let options = {
        protocol: ctx.request.protocol,
        hostname: '', // 默认接口域名
        path: '/',
        data: {},
        headers: {},
        timeout: 7000
      },
      data = {},
      counter = 0,
      header = ctx.request.header,
      fields = ['referer', 'cookie']

    // 添加请求头信息
    fields.forEach((item) => {
      header.hasOwnProperty(item) ? options.headers[item] = header[item] : 0
    })

    for (let item in phps) {
      let opts = typeof phps[item] === 'object' ? Object.assign({}, options, phps[item]) : Object.assign({}, options, phps)
      let url = opts.protocol + '://' + opts.hostname + opts.path
      try {
        const res = await NodeFetch(url)
        res.headers['set-cookie'] && ctx.response.set('set-cookie', res.headers['set-cookie'])
        data[item] = await res.json()
      } catch (err) {
        console.error(err)
      }
    }
    return data
  }
}

module.exports = fetch
