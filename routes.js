const config = require('./config')
const defaultPagePath = config.DEFAULT_PAGE_PATH || '/welcome/index'
const _p = defaultPagePath.split('/')
const _fn = _p.pop()
const _ctl = _p.pop()

module.exports = {
  register() {
    return async(ctx) => {
      let pathInfo = this.pathHandle(ctx.path)
      let mod = require(`.${pathInfo.filePath}`)
      await (new mod(ctx))[pathInfo.functionName]()
    }
  },
  pathHandle(path) {
    let p = path.split('/')
    p = p.filter(item => item)
    const fn = p.pop() || _fn
    const fp = `/controllers/${p.join('/') || _ctl}`
    return {
      functionName: fn,
      filePath: fp
    }
  }
}
