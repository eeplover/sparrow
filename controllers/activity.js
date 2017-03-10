const Controller = require('./controller')

class welcome extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  // 该函数对应一个页面
  // 可通过http://localhost:8080/activity/declare访问
  async declare() {
    const data = {
      content: 'Hello Sparrow!'
    }
    // 进行API接口配置
    const php = {
      title: {
        domain: 'api.xxxx.com',
        path: '/welcome/index',
        method: 'GET',
        data: {}
      }
    }
    // fetch 用于获取接口数据
    // let res = await this.fetch(php)

    // 脚本路径设置
    data._JS = ['wap/activity/declare']
    // 样式路径设置
    data._CSS = ['wap/activity/declare']
    // 页面标题设置
    data._TITLE = 'Sparrow 1.0'
    // 渲染设置
    await this.render('activity/declare', data)
  }
}

module.exports = welcome
