var express = require('express')
var webpack = require('webpack')
var webpackConfig = require('./webpack.local')
var devMiddleware = require('webpack-dev-middleware')
var opn = require('opn')

var port = process.env.PORT || 3000 //服务器启动端口
var isExPort = false //是否输出真实文件
var isOpen = false //是否自动打开浏览器

var app = express()
var compiler = webpack(webpackConfig)


if(!isExPort){
	var devMiddlewareConf = devMiddleware(compiler, {
		publicPath: '/',
		quiet: true
	})
	
	app.use(devMiddlewareConf)
	
	if(process.env.NODE_ENV == 'development'){
		devMiddlewareConf.waitUntilValid(() => {
			console.log('> 本地服务器启动在: ' + `http://localhost:${port}` + '\n')
		})
	}
}

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: () => {}
})

compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		hotMiddleware.publish({ action: 'reload' })
		cb()
	})
})

app.use(hotMiddleware)

app.listen(port,(err) => {

	if(err) {
		console.log(err)
		return 
	}

	if(isOpen) {
		opn(`http://localhost:${port}`)
	}

})