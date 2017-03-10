# Sparrow-1.0

Sparrow-1.0采用RequireJs进行模块化开发 + Less来写样式 + Gulp负责打包编译。   


## 优点
* 服务器端渲染（Server Side Render）
  *  服务端获取api接口数据
  *  模板引擎简单易用（John Resig的Micro-Template）  
* 对开发友好
  *  业务逻辑清晰
  *  支持页面灵活拼装

## 使用说明

```bash
// 安装依赖包
npm install

// 开发环境起服务
npm run dev

// 正式线起服务
npm start
```

##### 页面开发

1. 按*业务类型*在controllers目录下新建一个文件。eg: activity.js
2. 业务细分到具体页面，对应controller文件里的一个*函数*。eg: declare()
3. 在函数体内配置相应的html，css，js，接口路径和自定义一些数据。
4. view下放模板、static/styles下放置样式、static/scripts下放置脚本
