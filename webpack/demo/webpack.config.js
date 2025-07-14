const path = require("path")
const HtmlWebpackPlugins = require("html-webpack-plugin")

const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
    //一出一入一模块

    //插件loader  和模式

    //入口配置   通过入口解析和解析依赖  属于make阶段


    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "output")
    },
    module: {

        //把某些文件归为一类然后通过某些柜子进行处理
        rules: [{
            test: /\.js$/,
            loader: path.resolve(__dirname, "loaders", "loaderA")
        }, {
            test: /\.js$/,
            loader: path.resolve(__dirname, "loaders", "loaderB")
        }, {
            test: /\.js$/,
            loader: path.resolve(__dirname, "loaders", "loaderC"),
            options: {
                name: "loaderKing",
                size: 1000
            }
        }]
    },

    /**
     * none  不使用任何优化选项
     * development 开发模式
     * production  生产模式  整体全量编译
     */
    mode: "none",
    plugins: [
        new HtmlWebpackPlugins({
            template: path.join(__dirname, "./index.html")
        }),
        new CleanWebpackPlugin()
    ]

}


/**
 * loader和plugin的区别和作用
 * loader是一个加载器，主要功能是对文件的引入和加载，在加载的过程中顺带进行一些预处理，如压缩和编译，也即是可以处理非js文件
 * 打包文件之前
 *
 * plugin  插件，  辅助整体功能  比如:打包优化，变量注入，代码去除
 * 全局，在整个生命周期中
 *
 */