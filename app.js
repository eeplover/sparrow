const fs = require('fs')
const Koa = require('koa')
const less = require('less')
const route = require('./routes')
const favicon = require('koa-favicon')
const uaParser = require('ua-parser-js')
const config = require('./config')

const app = new Koa()
const isProd = config.NODE_ENV === 'production'

global.caches = {
  modules: {}
}

// 预先加载所有模块
if (isProd) {
  const files = fs.readdirSync(config.CONTROLLERS)
  for (let file of files) {
    caches.modules[file] = require(`${config.CONTROLLERS}/${file}`)
  }
} else {
  // watch controllers file
  require('./watch')(config.CONTROLLERS)
}

app.use(favicon(`${config.STATIC}/logo-48.png`))

app.use(async(ctx, next) => {
  const p = ctx.request.path
  const i = p.lastIndexOf('.')
  if (p.slice(i) !== '.less')
    return next()
  const file = fs.readFileSync(`./static/${p}`)
  const output = await less.render(file.toString(), {
      paths: [`${config.STATIC}/styles`]
  })
  ctx.type = 'text/css'
  ctx.body = output.css
})

app.use(require('koa-static')(config.STATIC, {
  maxage: 5 * 60 * 60 * 1000
}))

app.use((ctx, next) => {
  if (ctx.req.headers['user-agent'])
    ctx.uaInfo = uaParser(ctx.req.headers['user-agent'])
  return next()
})

app.use(route.register())

app.listen(config.PORT)
console.log(`Server running on port ${config.PORT}.`)
