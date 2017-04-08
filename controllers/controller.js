const Vue = require('vue')
const fs = require('fs')
const fetch = require('../fetch')
const config = require('../config')

class Controller {
  constructor(ctx) {
    this.ctx = ctx
    this.fetch = fetch()
  }

  render(path, data) {
    if (this.ctx.query.showmedata == 1)
      return this.ctx.body = data
    const tmplStr = this.getTmplStr(path)
    if (config.CSS_MANIFEST) {
      data._CSS = data._CSS.map(item => {
        return 'css/' + config.CSS_MANIFEST[`page/${item}.css`]
      })
    } else {
      data._CSS = data._CSS.map(item => {
        return `styles/page/${item}.less`
      })
    }
    if (config.JS_MANIFEST) {
      data._JS = data._JS.map(item => {
        return 'js/' + config.JS_MANIFEST[`page/${item}.js`]
      })
    } else {
      data._JS = data._JS.map(item => {
        return `scripts/page/${item}.js`
      })
    }
    data._ENV = config.NODE_ENV
    this.ctx.response.set('Server', config.SERVER_INFO)
    try {
      this.ctx.body = this.tmpl(tmplStr, data)
    } catch(e) {
      console.error(`error during render: ${e}`)
      this.ctx.throw('Internal Error 500')
    }
  }

  getTmplStr(path) {
    if (path.indexOf('.html') === -1) path += '.html'
    let tmplStr = fs.readFileSync(`${config.VIEWS}/${path}`, 'utf-8')
    if (tmplStr.indexOf('<!DOCTYPE') === -1) {
      let fp = this.ctx.uaInfo.device.type === 'mobile' ? 'index.m' : 'index'
      tmplStr = fs.readFileSync(`${config.VIEWS}/${fp}.template.html`, 'utf-8').replace(`<!-- APP -->`, tmplStr)
    }
    return tmplStr
  }

  tmpl(str, data) {
    const fn = new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" +
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
      + "');}return p.join('');")
    return data ? fn( data ) : fn
  }
}

module.exports = Controller
