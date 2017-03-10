const configData = {
  ROOT: __dirname,
  CONTROLLERS: `${__dirname}/controllers`,
  VIEWS: `${__dirname}/views`,
  STATIC: `${__dirname}/static`,
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 8080,
  SERVER_INFO: `Koa/${require('koa/package.json').version}`,
  DEFAULT_PAGE_PATH: '/activity/declare',
}
try {
  configData.MANIFEST = require('./static/rev-manifest.json')
} catch(e) {
  configData.NODE_ENV === 'production' && console.error(e)
}

module.exports = configData
