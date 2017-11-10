const webpack = require('webpack')
const path = require('path');
const glob = require('glob');

var PATH_root = path.resolve(__dirname, '../');
var PATH_src = path.resolve(PATH_root, './src');
var PATH_bindev = path.resolve(PATH_root, './bin_dev');
var PATH_bin = path.resolve(PATH_root, './bin');
var PATH_nodeMod = path.resolve(PATH_root, './node_modules');

console.log("PATH_src:"+PATH_src+"\n")

// production | development
var NODE_ENV = process.env.NODE_ENV;
var isDev = NODE_ENV=="development";
console.log("env:", NODE_ENV);
var minimist = require('minimist');
console.log("run parameter:", minimist(process.argv).dev);


/* 以 src 目录为基准 */
var pathmap = require('./pathmap.json');
console.log("pathmap:", pathmap)
function getPathToSrc(_path){
    return path.resolve(PATH_src, _path);
}


//输出目录
var out_bin = isDev ? PATH_bindev : PATH_bin;
//输出chunkhash
var out_chunkhash = isDev ? "" : ".[chunkhash]";
var out_hash = isDev ? "" : ".[hash]";

//html path 每个html对应1个同名入口文件(.ts)
var htmlList = {};
for(var i=0; i<pathmap.pathHtml.length; i++){
    var _path = pathmap.pathHtml[i];
    var _basename = path.basename(_path, '.html');
    if(_basename=="*"){
        var _childhtmllist = glob.sync(getPathToSrc(_path));
        for( var j=0; j<_childhtmllist.length; j++){
            var _childPath = _childhtmllist[j];
            createHtmlPath(_childPath);
        }
    }else{
        createHtmlPath(_path);
    }
}
function createHtmlPath(_path){
    var htmlPath = getPathToSrc(_path);
    var filePath = path.dirname(htmlPath);
    var name = path.basename(htmlPath, '.html');
    var htmlName = name+'.html';
    var tsName = name+'.ts';
    var tsPath = path.resolve(filePath,tsName);
    htmlList[name] = {
        filePath:filePath,
        htmlName:htmlName,
        htmlPath:htmlPath,
        tsName:tsName,
        tsPath:tsPath
    };
}

console.log("entry:", htmlList)

//pulgins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');



var plugins = [];
var entries = {};
var plugin_html = function(){
    var plus = [];
    for( var key in htmlList ){
        var item = htmlList[key];
        var conf = {
            template:item.htmlPath,
            filename:item.htmlName
        }
        conf.inject = 'body';
        conf.chunks = ["common", item.tsName];
        if(pathmap.favicon) conf.favicon = getPathToSrc(pathmap.favicon);
        plus.push(new HtmlWebpackPlugin(conf));
        entries[item.tsName] = item.tsPath;
    }
    return plus;
}
plugins = plugins.concat(plugin_html());


//抽取css
const extractCSS = new ExtractTextPlugin({
    filename: "css/[name]"+out_chunkhash+".css"
});
const extractSass = new ExtractTextPlugin({
    filename: "css/[name]"+out_chunkhash+".css",
    disable: isDev
});

plugins.push(
    new webpack.DefinePlugin({
        'process.env': {NODE_ENV: JSON.stringify(NODE_ENV)}
    }),
    extractCSS,
    extractSass,
    //抽取公共库/代码，配合entry使用//页面上使用的时候最后一个会块最先加载,其它依次加载
    new webpack.optimize.CommonsChunkPlugin({
        "names": ["common"],
        "filename": "views/[name]"+out_chunkhash+".js",
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to common
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, '../node_modules')
              ) === 0
            )
        }
    }),
    new CleanWebpackPlugin(out_bin, PATH_root)
);

//暴露的库
// plugins.push(
    // new webpack.ProvidePlugin({"$":"jquery", "jQuery":"jquery"}),
    // new webpack.ProvidePlugin({"_":"lodash"})
    // new webpack.ProvidePlugin({"Vue":"vue"})
// )
//生产环境 清除/压缩
if(isDev==false){
    plugins.unshift(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress:{
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    );
    plugins.push(new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: { //删除css注释
            removeAll: true
          }
        }
    }));
}
//复制目录/文件
if(pathmap.pathStatic) {
    plugins.push(new CopyWebpackPlugin([
        {
        from: getPathToSrc(pathmap.pathStatic),
        to: path.resolve(out_bin, pathmap.pathStatic),
        ignore: ['.*']
        }
    ]))
}




var config = {
    entry:Object.assign(entries, {

    }),
    output:{
        path:out_bin,
        filename:'views/[name]'+out_chunkhash+'.js',
        chunkFilename:'modules/[name]'+out_chunkhash+'.js',
        publicPath:'/',
    },
    module:{
        // noParse:'/vue/',
        rules:[
            {
                test: /\.vue$/,
                loader:'vue-loader',
                options:{
                    esModule: true
                }
            },
            {
                test:/\.ts$/,
                loader:'ts-loader',
                options:{
                    appendTsSuffixTo: [/\.vue$/]//<script lang="ts">
                }
            },
            {
                test:/\.js$/,
                // exclude:[PATH_nodeMod],
                include: [PATH_src],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['latest','stage-2'],
                        plugins: ['transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/,
                exclude:[PATH_nodeMod],
                use: extractCSS.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test:/\.scss|.sass$/i,
                use:extractSass.extract({
                    use: [{ loader: "css-loader" }, { loader: "sass-loader" }],
                    // 在开发环境使用 style-loader
                    fallback: "style-loader"
                })
            },
            {
                test:/\.html$/,
                use:'html-loader'
            },
            {
                test:/\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader:'file-loader',
                options:{
                    name:'images/[name]'+out_hash+'.[ext]',
                }
            }
        ]
    },
    devtool: isDev ? 'source-map': false,
    plugins:plugins,
    resolve: {
        modules: [PATH_root+"/node_modules/", PATH_src],
        extensions: ['.js', '.ts', '.vue', '.css', '.scss','.sass', '.json'],
        alias: Object.assign(
            pathmap.lib,
            {
                "@":PATH_src,
            }
        )
    },
    externals:{

    }
}
// console.log("config:",JSON.stringify(config))
// module.exports = config;
const compiler = webpack(config);
if(isDev){
    const watching = compiler.watch({
        ignored: /node_modules/,
        // poll: 1000
    }, (err, stats) => {
        // 在这里打印 watch/build 结果...
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }

        console.log(stats.toString({
            assets: true,// 增加资源信息
            chunks: false,  // 使构建过程更静默无输出
            colors: true,    // 在控制台展示颜色
            cached: false,// 增加缓存了的（但没构建）模块的信息
            cachedAssets: false,// Show cached assets (setting this to `false` only shows emitted files)
            entrypoints: true,// Display the entry points with the corresponding bundles
        }));
    });
}else{
    compiler.run((err, stats)=>{
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }

        console.log(stats.toString({
            assets: true,// 增加资源信息
            chunks: false,  // 使构建过程更静默无输出
            colors: true,    // 在控制台展示颜色
            cached: false,// 增加缓存了的（但没构建）模块的信息
            cachedAssets: false,// Show cached assets (setting this to `false` only shows emitted files)
            entrypoints: true,// Display the entry points with the corresponding bundles
        }));
    })
}

