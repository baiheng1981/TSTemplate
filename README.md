# 项目目录

## 运行平台
> App WebView
> explorer

## 项目描述
> 无

---

### 目录结构
 - bin                         生产运行目录
 - bin_dev                     开发运行目录(增量编译目录)
 - config                      项目配置(webpack)
  - custom_modules             自定义插件
  - pathmap.json               自定义webpack.config引用文件路径配置
                               {
                                 "pathHtml": //入口页面路径
                                 [
                                   "./main/index.html", //固定名称的页面
                                   "./main/*.html"  //路径下所有html页面
                                 ]
                               }
  - webpack.config.js          webpack配置文件
 - src                         源码
  - assets                     资源目录
     - d.ts                    ts声明文件
     - images                  图片资源
     - lib                     外部库
     - style                   style sheet
  - main                       入口页面+文件
  - model                      数据
     - Data.ts                 公共数据
  - router                     vue router
  - serve                      公共服务(路由信息, 工具Class/Function, API, ...)
     - app_interactive         WebView调用App工具
     - utils                   工具Class/Function
  - store                      VUEX
  - views                      页面模块
     - components                 vue公共组件
     - App.vue                 vue根组件

---
### 快速开始
> 1. 在命令行输入： npm i  --- 安装编译所所需要的第三方依赖包
> 2. 在命令行输入： npm run dev  --- 编译开发环境代码
> 3. 在命令行输入： npm run build  --- 编译dev生产环境代码
> 4. 在命令行输入： npm run build_test  --- 编译test生产环境代码
> 5. 在命令行输入： npm run build_pro  --- 编译production生产环境代码
> 6. 建立服务器，web首页指向 /index.html（测试）

---
## v1.0.0 - 2017-9-28
### 新增功能
  - [项目结构]  项目结构目录




